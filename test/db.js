const expect = require('chai').expect;
const Connect = require('../conecction.js');

describe('Database tests mongodb', () => {
  
  beforeEach((done) => {
    const db = new Connect('test');
    // function clearDB() {
    //   for (var i in mongoose.connection.collections) {
    //     mongoose.connection.collections[i].remove(function () { });
    //   }
    //   return done();
    // }

    db.connection().on('error', (err) => { console.warn('Error al conectar con la base de datos:', err)});
    db.connection().once('open', () => {
      console.log('Conexión a la base de datos establecidad....');
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

  afterEach(function (done) {
    const db = new Connect('test');
    db.disconnect();
    console.log('Connection close.')
    return done();    
  });

})