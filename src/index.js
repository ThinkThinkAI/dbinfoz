import PostgresAdapter from "./adapters/PostgresAdapter";
import MysqlAdapter from "./adapters/MysqlAdapter";
import SqliteAdapter from "./adapters/SqliteAdapter";

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

export default getDatabaseAdapter;
