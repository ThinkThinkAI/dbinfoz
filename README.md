# 🌐 DBINFOZ Universal Database Adapter

A simple and unified interface to interact with different types of SQL databases including PostgreSQL, MySQL, and SQLite.

## ✨ Features

- 📚 List all databases
- 📃 List all tables within a database
- 📄 Get the schema of a table
- 🗂 Get all tables and their schemas within a database

Supports PostgreSQL, MySQL, and SQLite databases.

## 🛠 Installation

```bash
npm install dbinfoz
```

## 🚀 Usage

First, require the package and use the factory function to get an instance of the database adapter based on the type of database you're working with:

```
const getDatabaseAdapter = require('dbinfo');

// For PostgreSQL
const postgresConfig = {
  user: 'yourUsername',
  host: 'localhost',
  database: 'yourDatabase',
  password: 'yourPassword',
  port: 5432,
};
const postgresAdapter = getDatabaseAdapter('postgres', postgresConfig);

// For MySQL
const mysqlConfig = {
  host: 'localhost',
  user: 'yourUsername',
  database: 'yourDatabase',
  password: 'yourPassword',
  port: 3306,
};
const mysqlAdapter = getDatabaseAdapter('mysql', mysqlConfig);

// For SQLite
const sqliteConfig = {
  filename: './path/to/database.sqlite',
};
const sqliteAdapter = getDatabaseAdapter('sqlite', sqliteConfig);
```

## 📖 Examples
Listing Databases
```
async function listDatabases(adapter) {
  const databases = await adapter.listDatabases();
  console.log(databases);
}

listDatabases(postgresAdapter); // Example for PostgreSQL
```

Listing Tables
```
async function listTables(adapter) {
  const tables = await adapter.listTables('yourDatabaseName'); // For SQLite, the dbName is ignored
  console.log(tables);
}

listTables(mysqlAdapter); // Example for MySQL
```
Getting Table Schema
```
async function getTableSchema(adapter, tableName) {
  const schema = await adapter.getTableSchema(tableName);
  console.log(schema);
}

getTableSchema(sqliteAdapter, 'yourTableName');
```
Getting All Tables and Their Schemas
```
async function getAllTablesAndSchemas(adapter, dbName) {
  const tablesAndSchemas = await adapter.getAllTablesAndSchemas(dbName); // For SQLite, the dbName is ignored
  console.log(tablesAndSchemas);
}

getAllTablesAndSchemas(postgresAdapter, 'yourDatabaseName');
```

## 💡 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/rootedbox/dbinfoz/issues).

## 📝 License

[MIT](https://github.com/rootedbox/dbinfoz/blob/main/LICENSE) © Jason Jacobs

## 📁 Repository

The source code is available at [GitHub](https://github.com/rootedbox/dbinfoz).
