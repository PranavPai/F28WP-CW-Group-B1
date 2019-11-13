let mongoose = require('mongoose');

const server = 'localhost';
const database = 'game-v1';

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(`mongodb://${server}/${database}`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error(`Database connection error: ${err}`)
       })
  }
}

module.exports = new Database()