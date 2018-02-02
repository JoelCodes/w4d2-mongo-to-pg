const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017/w3d4';

// Use connect method to connect to the server
MongoClient.connect(url, (err, db) => {
  console.log('Connected successfully to server');
  db.collection('scarecrows').find().toArray((err, result) => {
    console.log('result', result);
    db.close();
  });
});

const db = MongoClient.connect(url);
const result = db.collection('scarecrows').find().toArray();
console.log('result', result);
