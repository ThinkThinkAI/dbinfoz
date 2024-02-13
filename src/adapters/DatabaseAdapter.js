class DatabaseAdapter {
  async listDatabases() {
    throw new Error("Not implemented");
  }
  async listTables(dbName) {
    throw new Error("Not implemented");
  }
  async getTableSchema(tableName) {
    throw new Error("Not implemented");
  }
  async getAllTablesAndSchemas(dbName) {
    throw new Error("Not implemented");
  }
}

module.exports = DatabaseAdapter;