const expect = require('chai').expect;
const Connect = require('../conecction.js');
const User = require('./utils/user.js');
const mongoose = require('mongoose')

describe('Database tests mongodb', () => {
  
  before((done) => {
    const db = new Connect('test');
    db.connection()
      .then(() => {
        console.log(`Conexión a la base de datos establecidad en: ${db.uri()}`);
        done();
      },
      err => {
        console.warn('Error al conectar con la base de datos:', err);
      }
    );
    /* if (mongoose.connection.db) return done();
    mongoose.connect('mongodb://192.168.99.100:27017/test', done); */
  })

  describe('User model', () => {
    // console.log('es es User -> '+ User)
    it('Save user', (done) => {
      // const foo = 'bar'
      // expect(foo).to.equal('bar');
      // console.log(User)
     /*  User.save()
        .then((data) => {
          console.log('Save'+ data)
          // expect(!)
          done();
        })
        .catch((err) => {
          console.log(err)
          done(err);
        }) */
      done()
    })  
  })

 /*  it('prueba', () => {
    const foo = 'bar'
    expect(foo).to.equal('bar');
  }) */

  afterEach((done) => {
    const db = new Connect('test');

    // db.connection().dropDatabase((err) => {
    //   if(err) return console.warn('Error al momento de eliminar la base de datos: ', err)
      
    //   db.disconnect();
    //   console.log(`Connection close en: ${db.uri()} `);
    //   done();
    // });   
    done();
  });

 /*  after(function (done) {
    db.connection.db.dropDatabase(function () {
      db.connection.close(function () {
        done();
      });
    });
  }); */

})