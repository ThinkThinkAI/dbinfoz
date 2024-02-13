const sqlite3 = require("sqlite3").verbose();
const { promisify } = require("util");
const DatabaseAdapter = require("./DatabaseAdapter"); 

class SqliteAdapter extends DatabaseAdapter {
  constructor(config) {
    super();
    const db = new sqlite3.Database(config.filename);
    this.db = db;
    this.db.all = promisify(db.all.bind(db));
    this.db.get = promisify(db.get.bind(db));
    this.db.run = promisify(db.run.bind(db));
  }

  async listDatabases() {
    return [`${this.db.filename}`]; 
  }

  async listTables(dbName) {
    // Ignoring dbName since it's not applicable for SQLite
    const query = `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`;
    return this.db.all(query).then((rows) => rows.map((row) => row.name));
  }

  async getTableSchema(tableName) {
    // tableName is used directly to get the schema via PRAGMA
    const query = `PRAGMA table_info(${tableName});`;
    return this.db.all(query).then((rows) =>
      rows.reduce((schema, { name, type, notnull, dflt_value, pk }) => {
        schema[name] = {
          type,
          nullable: notnull === 0,
          default: dflt_value,
          primaryKey: pk !== 0,
        };
        return schema;
      }, {})
    );
  }

  async getAllTablesAndSchemas(dbName) {
    // Ignoring dbName since it's not applicable for SQLite
    const tables = await this.listTables();
    const schemaPromises = tables.map((tableName) =>
      this.getTableSchema(tableName)
    );
    const schemas = await Promise.all(schemaPromises);
    return tables.reduce((acc, tableName, idx) => {
      acc[tableName] = schemas[idx];
      return acc;
    }, {});
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = SqliteAdapter;
