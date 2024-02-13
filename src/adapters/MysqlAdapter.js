const mysql = require("mysql2/promise");
const DatabaseAdapter = require("./DatabaseAdapter"); 

class MysqlAdapter extends DatabaseAdapter {
  constructor(config) {
    super();
    this.pool = mysql.createPool(config);
  }

  async listDatabases() {
    const query = "SHOW DATABASES;";
    const [rows] = await this.pool.query(query);
    return rows.map((row) => row.Database);
  }

  async listTables(dbName) {
    // First, ensure the database is selected
    await this.pool.query(`USE ${mysql.escapeId(dbName)};`);
    const query = "SHOW TABLES;";
    const [rows] = await this.pool.query(query);
    // The key for table names depends on the database name, so we dynamically fetch the first column value
    return rows.map((row) => row[Object.keys(row)[0]]);
  }

  async getTableSchema(tableName) {
    const query = `DESCRIBE ${mysql.escapeId(tableName)};`;
    const [rows] = await this.pool.query(query);
    return rows.reduce((schema, row) => {
      schema[row.Field] = {
        type: row.Type,
        nullable: row.Null === "YES",
        key: row.Key,
        default: row.Default,
      };
      return schema;
    }, {});
  }

  async getAllTablesAndSchemas(dbName) {
    const tables = await this.listTables(dbName);
    const schemas = {};
    for (const table of tables) {
      schemas[table] = await this.getTableSchema(table);
    }
    return schemas;
  }
}

module.exports = MysqlAdapter;
