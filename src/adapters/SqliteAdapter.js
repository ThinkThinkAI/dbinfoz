import sqlite3 from "sqlite3";
import { promisify } from "util";
import DatabaseAdapter from "./DatabaseAdapter.js";

sqlite3.verbose();

class SqliteAdapter extends DatabaseAdapter {
  constructor(config) {
    super(config);
    const db = new sqlite3.Database(config.filename);
    this.db = db;
    this.db.all = promisify(db.all.bind(db));
    this.db.get = promisify(db.get.bind(db));
    this.db.run = promisify(db.run.bind(db));
  }

  async listDatabases() {
    return [`${this.db.filename}`];
  }

  async listTables() {
    const query = `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`;
    const rows = await this.db.all(query);
    return rows.map((row) => row.name);
  }

  async getTableSchema(tableName) {
    const query = `PRAGMA table_info(${tableName});`;
    const rows = await this.db.all(query);
    return rows.reduce((schema, { name, type, notnull, dflt_value, pk }) => {
      schema[name] = {
        type,
        nullable: notnull === 0,
        default: dflt_value,
        primaryKey: pk !== 0,
      };
      return schema;
    }, {});
  }

  async getAllTablesAndSchemas() {
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

  async runQuery(query) {
    return this.db.all(query);
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

export default SqliteAdapter;
