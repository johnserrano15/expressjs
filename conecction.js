const mongoose = require('mongoose');
// mongoose.connect('mongodb://192.168.99.100:32768/prueba');
// Se conecto a un container de docker
/* const connection = mongoose.createConnection('mongodb://192.168.99.100:27017/auth', (err, res) => {
  if (err) return console.log('Error al conectar con la base de datos: ' + err)
  console.log('Conexión a la base de datos establecidad....');
});
 */

const prod_uri = 'mongodb://192.168.99.100:27017/auth';
const test_uri = 'mongodb://192.168.99.100:27017/test';

class Connect {
  constructor(mode) {
    this.mode = mode;
  }

  connect() {
    const uri = this.uri();
    mongoose.connect(uri);
    return mongoose.connection; // Devuelvo la connection
  }

  uri() {
    return this.mode ? test_uri : prod_uri;
  }

  connection() {
    return mongoose.connection;
  }
}

module.exports = Connect;