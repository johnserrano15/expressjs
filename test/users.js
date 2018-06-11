const expect = require("chai").expect;
const request = require("supertest");
// const app = require('../app');
// const Connect = require('../conecction.js');

// describe('Users request', () => {

//   it('should server 200 on index', (done) => {
//     // request(app).get('/').expect('Content-Type', /html/).expect(200, done);
//     request(app).get('/').expect(200, done);
//   });

//   describe('POST /users', () => {
//     it('responds with message 200', (done) => {
//       request(app)
//         .post('/signup')
//         .send({
//           name: 'John Serrano',
//           email: 'web@johnserrano.co',
//           password: '123456'
//         })
//         .set('Accept', 'application/json')
//         .expect(200)
//         .end((err, res) => {
//           if (err) return done(err);
//           done();
//         })
//     })

//     it('responds with message 200', (done) => {
//       request(app)
//         .post('/login')
//         .send({ email: 'web@johnserrano.co', password: '123456' })
//         .set('Accept', 'application/json')
//         .expect(200)
//         .end((err, res) => {
//           if (err) return done(err);
//           done();
//         });
//     })
//   })
// })