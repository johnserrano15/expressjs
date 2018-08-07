const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const Connect = require('../conecction.js');
const server = require('../server');

require('dotenv').config();

describe('Users request', () => {
  let db = '';

  process.env.SESSION_MONGO === 'test' ? db = new Connect('test') : db = '';
  const agent = request.agent(app);
  
  before((done) => {
    const conn = db.connect();

    conn.on('error', console.error.bind(console, 'connection error'));
    conn.once('open', function () {
      console.log(`We are connected to test database en: ${db.uri()}`);
      done();
    });
  })

  describe('POST /users', () => {
    it('responds with message 200', (done) => {
      agent
        .post('/signup')
        .send({
          name: 'John Serrano',
          email: 'web@johnserrano.co',
          password: '123456'
        })
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          // console.info(res)
          done();
        })
    })

    it('responds with message 200', (done) => {
      agent
        .post('/login')
        .send({ email: 'web@johnserrano.co', password: '123456' })
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err); 
          done();
        });
    })
  })

  describe('GET /users', () => {
    it('should server 200 on index', (done) => {
      // request(app).get('/').expect('Content-Type', /html/).expect(200, done);
      agent
        .get('/')
        .expect(200, done);
    });
    
    it('responds with json', (done) => {
      agent
        .get('/user/info')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done);
    })

    it('responds with email equal to web@johnserrano.co', () => {
      return agent
        .get('/user/info')
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .then(res => {
          // console.info(res.body)
          expect(res.body.email).to.equal('web@johnserrano.co');
        })
    })

    it('responds with 200 logout', (done) => {
      agent
        .get('/logout')
        .expect(200, done);
    })

  })

  after((done) => {
    // Recibimos solo la coneccion
    const conn = db.connection();
    // console.info(conn.readyState)
    conn.dropDatabase(function () {
      console.log('The database was destroyed!')
      conn.close(function () {
        console.log('Close connection!')
        done();
      });
    });
  })
})
