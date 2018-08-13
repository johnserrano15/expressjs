const expect = require('chai').expect;
const Connect = require('../conecction.js');
const User = require('./utils/user.js');

describe('Database tests mongodb', () => {
  const db = new Connect('test');

  // mongoosejs.com/docs/api.html#connection_Connection-readyState
  // https://mochajs.org/#hooks

  beforeEach(function (done) {
    this.timeout(3000);
    const conn = db.connect();
    // console.info(conn.readyState);
    conn.on('error', console.error.bind(console, 'connection error'));
    conn.once('open', function () {
      console.log(`We are connected to test database en: ${db.uri()}`);
      done();
    });
  });

  describe('User model', () => {
    it('Create and save user', async () => {
      const user = await User.save();
      // console.log(user)
      expect(user.email).to.equal('ja@gmail.com')
    })  
  })

  describe('WebSocket test', function () {
    it('Just one more test', function (done) {
      expect(1).to.equal(1);
      done();
    });
  });
  
  afterEach((done) => {
    const conn = db.connection();
    //MONGO_URI
    if (process.env.MONGO_URI) {
      // El error era que al segundo test ya no existia la collection users
      // Se podria validar si la collection existe
      conn.dropCollection('users', function () {
        console.log('The collection was destroyed!')
        conn.close(function () {
          console.log('Close connection!')
          done();
        });
      })
    } else {
      conn.dropDatabase(function () {
        console.log('The database was destroyed!')
        conn.close(function () {
          console.log('Close connection!')
          done();
        });
      });
    }
  });

})