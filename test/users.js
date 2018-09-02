const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const Connect = require('../conecction.js');

describe('Users request', () => {
  let db = '';
  process.env.SESSION_MONGO === 'test' ? db = new Connect('test') : db = '';
  const agent = request.agent(app);

  let token = '';
  
  before(function (done) {
    // this.timeout(2000);
    let conn = db.connect();
    // console.info(conn.readyState)
    conn.on('error', console.error.bind(console, 'connection error'));
    conn.once('open', function () {
      console.log(`We are connected to test database en: ${db.uri()}`);
      done();
    });
  })

  describe('POST /users', function () {
    // this.timeout(2000);
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
          // console.log(res)
          token = res.body.token
          done();
        })
    })

    it('responds with message 200', (done) => {
      // this.timeout(2000);
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
      request(app)
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
      agent
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

  describe('Get request protected', () => {

    it('responds with message 200', (done) => {
      // this.timeout(2000);
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
  
    it('response with message 200', (done) => {
      agent
        .get('/')
        .set('Accept', 'application/json')
        .expect(200, done);
    })

    it('responds with 200 verify token', () => {
      agent
        .get('/verify')
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
          // console.log(res.text)
          expect(res.text).to.equal('sucess');
        })
    })

    it('responds with email equal to web@johnserrano.co and name equal to John Serrano', () => {
      agent
        .get('/protected')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then(res => {
          // console.log(res)
          console.log('This is your token -> ' + token.substr(1, 20));
          expect(res.body.email).to.equal('web@johnserrano.co');          
          expect(res.body.name).to.equal('John Serrano');
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
    conn.dropDatabase(function () {
      console.log('The database was destroyed!');
      conn.close(function () {
        console.log('Close connection!');
        done();
      });
    });
  })
})
