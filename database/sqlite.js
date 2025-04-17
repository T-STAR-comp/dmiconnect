const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create or connect to the SQLite database file
const dbPath = path.resolve(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    //console.error('Error opening database:', err.message);
  } else {
    //console.log('Connected to SQLite database.');
  }
});

db.serialize(() => {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phonenumber TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        balance REAL DEFAULT 0
      )
    `, (err) => {
        if (err) {
          //console.error('❌ Error creating products table:', err.message);
        } else {
          //console.log('✅ users table is ready.');
        }
      });
  
    // Create products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        product TEXT NOT NULL,
        price REAL NOT NULL,
        imageUrl TEXT,
        user TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        //console.error('❌ Error creating products table:', err.message);
      } else {
        //console.log('✅ Products table is ready.');
      }
    });
  
    // Create orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        customer TEXT NOT NULL,
        hostel TEXT NOT NULL,
        room TEXT NOT NULL,
        orderName TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        email TEXT,
        orderID TEXT NOT NULL,
        user TEXT NOT NULL,
        state INTEGER
      )
    `, (err) => {
      if (err) {
        //console.error('❌ Error creating orders table:', err.message);
      } else {
        //console.log('✅ tables are ready.');
      }
    });
  });
  

module.exports = db;
