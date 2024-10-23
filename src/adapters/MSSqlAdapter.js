import mssql from "mssql";
import DatabaseAdapter from "./DatabaseAdapter.js";

class MSSqlAdapter extends DatabaseAdapter {

    connected = false;
    constructor(config) {
        super(config);
        config.options = { trustServerCertificate: true }
        this.pool = new mssql.ConnectionPool(config);
        this.pool.connect().then(() => {
            this.connected = true;
        }).catch(err => {
            console.error("Failed to connect to the database:", err);
            throw err;
        });
    }

    async isConnected() {
        if (this.connected == false) {
            //wait until connected or until timed out after 5 seconds
            await new Promise((resolve, reject) => {
                var timeout = setTimeout(reject, 5000);
                var interval = setInterval(() => {
                    if(this.connected == true){
                        clearTimeout(timeout);
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }
    }

    async listDatabases() {
        await this.isConnected();
        const query = `
            SELECT name AS datname
            FROM sys.databases
            WHERE name NOT IN ('master', 'model', 'msdb', 'tempdb');
        `;
        try {
            const request = await this.pool.request(); // Ensure the request is awaited
            const res = await request.query(query);
            return res.recordset.map((row) => row.datname);
        } catch (err) {
            console.error("Error querying tables:", err);
            throw err;
        }
    }

    async listTables() {
        await this.isConnected();
        const query = `
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG = @database;
          `;
        try {
            const request = await this.pool.request(); // Ensure the request is awaited
            request.input("database", this.config.database); // Set the input parameter
            const res = await request.query(query); // Execute the query and wait for results
            return res.recordset.map((row) => row.TABLE_NAME);
        } catch (err) {
            console.error("Error querying tables:", err);
            throw err;
        }
    }

    async getTableSchema(tableName) {
        await this.isConnected();
        const query = `
        SELECT COLUMN_NAME, DATA_TYPE 
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = @tableName;
      `;
        try {
            const res = await this.pool.request().input("tableName", tableName).query(query);
            return res.recordset.reduce((schema, row) => {
                schema[row.COLUMN_NAME] = row.DATA_TYPE;
                return schema;
            }, {});
        } catch (err) {
            console.error(`Error querying tables schema -> ${tableName}:`, err);
            throw err;
        }
    }

    async getAllTablesAndSchemas() {
        const tables = await this.listTables();
        const schemas = {};
        for (const table of tables) {
            schemas[table] = await this.getTableSchema(table);
        }
        return schemas;
    }

    async runQuery(query) {
        await this.isConnected();
        const pool = await this.pool.acquire();
        try {
            const res = await pool.request().query(query);
            return res.recordset;
        } catch (err) {
            console.error(`Error running SQL query`, query, err);
            throw err;
        }
    }
}

export default MSSqlAdapter;