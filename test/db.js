const expect = require('chai').expect;
const Connect = require('../conecction.js');
const User = require('./utils/user.js');

describe('Database tests mongodb', () => {
  const db = new Connect('test');
  const conn = db.connection();

  beforeEach((done) => {
    // console.log("before every test in every file");
    console.log(`Conexión a la base de datos establecidad en: ${db.uri()}`);
    // conn.on('connected', function() {
    //   console.log(`Conexión a la base de datos establecidad en: ${db.uri()}`);
    // });
    
    if(conn.readyState != 1) {
      db.connection()
      // console.log(`Conexión a la base de datos establecidad en: ${db.uri()}`);
    }
    // expect(conn.readyState).to.equal(1);
    done();
  })

  describe('User model', () => {
    it('Save user', (done) => {
      User.save()
        .then((data) => {
          console.log('okk')
          done();
        })
        .catch((err) => {
          console.log(err)
          done(err);
        })
    })  
  })

  describe('WebSocket test', function () {
    it('should run test and invoke hooks', function (done) {
      expect(1).to.equal(1);
      done();
    });
  });
  
  afterEach((done) => {    
    conn.dropDatabase(function () {
      console.log('Fue destruida la base de datos')
      conn.close(function () {
        console.log('Se cerro la conexión')
        done();
      });
    });
  });

})