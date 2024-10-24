# 🌐 DBINFOZ Universal Database Adapter

A simple and unified interface to interact with different types of SQL databases including PostgreSQL, MySQL, MSSQL, and SQLite.

## ✨ Features

- 📚 List all databases
- 📃 List all tables within a database
- 📄 Get the schema of a table
- 🗂 Get all tables and their schemas within a database

Supports PostgreSQL, MySQL, MSSQL, and SQLite databases.

## 🛠 Installation

```bash
npm install dbinfoz
```

## 🚀 Usage

First, require the package and use the factory function to get an instance of the database adapter based on the type of database you're working with:

```javascript
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

// For MSSQL
const mssqlConfig = {
  server: 'localhost',
  user: 'yourUsername',
  database: 'yourDatabase',
  password: 'yourPassword',
  port: 1433,
};
const mssqlAdapter = getDatabaseAdapter('mssql', mssqlConfig);

// For SQLite
const sqliteConfig = {
  filename: './path/to/database.sqlite',
};
const sqliteAdapter = getDatabaseAdapter('sqlite', sqliteConfig);
```

## 📖 Examples

```javascript
const getDatabaseAdapter = require('./index');

// Configuration for the required database
const config = {
  host: 'localhost', // For MySQL and PostgreSQL
  user: 'root', // For MySQL
  password: 'password', // For MySQL and PostgreSQL
  database: 'mydb',
  filename: './mydb.sqlite' // For SQLite
};

// Specify the database type ('sqlite', 'mysql', 'postgres')
const type = 'sqlite'; // Change as needed

(async () => {
  try {
    const dbAdapter = getDatabaseAdapter(type, config);

    // List databases
    const databases = await dbAdapter.listDatabases();
    console.log('Databases:', databases);

    // List tables
    const tables = await dbAdapter.listTables();
    console.log('Tables:', tables);

    // Get table schema
    const schema = await dbAdapter.getTableSchema('my_table');
    console.log('Schema:', schema);

    // Run a custom query
    const result = await dbAdapter.runQuery('SELECT * FROM my_table');
    console.log('Query Result:', result);

    // Close the connection (SQLite specific method for example purposes)
    if (dbAdapter.close) {
      await dbAdapter.close();
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
```

## 💡 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/rootedbox/dbinfoz/issues).

## 📝 License

[MIT](https://github.com/rootedbox/dbinfoz/blob/main/LICENSE) © Jason Jacobs

## 📁 Repository

The source code is available at [GitHub](https://github.com/rootedbox/dbinfoz).
