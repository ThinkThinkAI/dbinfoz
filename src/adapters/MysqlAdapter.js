const mysql = require("mysql2/promise");
const DatabaseAdapter = require("./DatabaseAdapter");

class MysqlAdapter extends DatabaseAdapter {
  constructor(config) {
    super(config);
    this.pool = mysql.createPool(config);
  }

  async listDatabases() {
    const query = "SHOW DATABASES;";
    const [rows] = await this.pool.query(query);
    return rows.map((row) => row.Database);
  }

  async listTables() {
    await this.pool.query(`USE ${mysql.escapeId(this.config.database)};`);
    const query = "SHOW TABLES;";
    const [rows] = await this.pool.query(query);
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

  async getAllTablesAndSchemas() {
    const tables = await this.listTables();
    const schemas = {};
    for (const table of tables) {
      schemas[table] = await this.getTableSchema(table);
    }
    return schemas;
  }

  async runQuery(query) {
    const [rows] = await this.pool.query(query);
    return rows;
  }
}

module.exports = MysqlAdapter;
