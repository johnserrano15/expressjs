const expect = require('chai').expect;
const Connect = require('../conecction.js');
const mongoose = require('mongoose');

describe('Database tests mongodb', () => {
  
  before((done) => {
    // const db = new Connect('test');
    mongoose.connect('mongodb://192.168.99.100:27017/test');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function () {
      // console.log('We are connected to test database!');
      done();
    });
  })

  describe('Test database', () => {
    it('prueba_one', () => {
      const foo = 'bar'
      expect(foo).to.equal('bar');
    })  
  })

  it('prueba', () => {
    const foo = 'bar'
    expect(foo).to.equal('bar');
  })  

})