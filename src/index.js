const PostgresAdapter = require("./adapters/PostgresAdapter");
const MysqlAdapter = require("./adapters/MysqlAdapter");
const SqliteAdapter = require("./adapters/SqliteAdapter");

// Factory function
function getDatabaseAdapter(type, config) {
  switch (type) {
    case "postgres":
      return new PostgresAdapter(config);
    case "mysql":
      return new MysqlAdapter(config);
    case "sqlite":
      return new SqliteAdapter(config);
    default:
      throw new Error("Unsupported database type");
  }
}

module.exports = getDatabaseAdapter;
