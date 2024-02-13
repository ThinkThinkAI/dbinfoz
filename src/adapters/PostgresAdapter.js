const { Pool } = require("pg");
const DatabaseAdapter = require("./DatabaseAdapter");

class PostgresAdapter extends DatabaseAdapter {
  constructor(config) {
    super();
    this.pool = new Pool(config);
  }

  async listDatabases() {
    const query =
      "SELECT datname FROM pg_database WHERE datistemplate = false;";
    const client = await this.pool.connect();
    try {
      const res = await client.query(query);
      return res.rows.map((row) => row.datname);
    } finally {
      client.release();
    }
  }

  async listTables(dbName) {
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_catalog = $1;
    `;
    const client = await this.pool.connect();
    try {
      const res = await client.query(query, [dbName]);
      return res.rows.map((row) => row.table_name);
    } finally {
      client.release();
    }
  }

  async getTableSchema(tableName) {
    const query = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1;
    `;
    const client = await this.pool.connect();
    try {
      const res = await client.query(query, [tableName]);
      return res.rows.reduce((schema, row) => {
        schema[row.column_name] = row.data_type;
        return schema;
      }, {});
    } finally {
      client.release();
    }
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

module.exports = PostgresAdapter;
