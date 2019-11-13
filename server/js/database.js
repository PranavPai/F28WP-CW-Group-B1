var mongoose = require('mongoose');
var Player = require('./models/player')

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



  addPlayer(player) {
    player.save()
      .then(doc => {
        console.log(doc)
      })
      .catch(err => {
        console.error(err.code)
      })
  }

  getPlayer(passed_username) {
    Player.find({
        username: passed_username
      })
      .then(doc => {
        // console.log(doc)
        return doc
      })
      .catch(err => {
        console.error(err)
      })
  }

  removePlayer(passed_username) {
    Player.findOneAndRemove({
        username: passed_username
      })
      .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.error(err)
      });
  }
}

module.exports = new Database()