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
        console.log(`Username: ${doc.username} : Player Added To Database`)
      })
      .catch(err => {
        if (err.code == 11000) {
          console.log(`Error: ${err.code} :: Player Already Exists`);
        } else {
          console.error(err.code)
        }
      })
  }

  getPlayer(passed_username) {
    Player.find({
        username: passed_username
      })
      .then(doc => {
        console.log(`Username: ${passed_username} : Player Found In Database`)
        return doc
      })
      .catch(err => {
        console.error(err);
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

var defaultplayer = new Player({
  firstname: "Default",
  lastname: "Player",
  email: "defaultplayer@test.com",
  username: "defaultplayer",
  password: "default",
  playerposition: {
    x: 50,
    y: 50
  },
  isOnline: true
});
var defaultplayer2 = new Player({
  firstname: "Default",
  lastname: "Player",
  email: "defaultplayer2@test.com",
  username: "defaultplayer2",
  password: "default",
  playerposition: {
    x: 50,
    y: 50
  },
  isOnline: true
});

module.exports = new Database()