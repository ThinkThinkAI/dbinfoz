// src/adapters/DatabaseAdapter.js
class DatabaseAdapter {
  constructor(config) {
    this.config = config; // Store the configuration object
  }

  async listDatabases() {
    throw new Error("Not implemented");
  }

  async listTables() {
    throw new Error("Not implemented");
  }

  async getTableSchema(tableName) {
    throw new Error("Not implemented");
  }

  async getAllTablesAndSchemas() {
    throw new Error("Not implemented");
  }

  async runQuery(query) {
    throw new Error("Not implemented");
  }
}

export default DatabaseAdapter;
