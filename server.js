const app = require('./app');
const Connect = require('./conecction');
// const middle = require('./middlewares/session');

const port = 3000;
const db = new Connect();
const conn = db.connection();
// console.log(middle.conn)

conn.on('error', console.error.bind(console, 'connection error'));

conn.on('open', () => {
  // console.info(conn.readyState)
  console.log('Conexión a la base de datos establecidad....');
});

const server = app.listen(port, () => {
  console.log(`Escuchando en el port ${port}`)
})

module.exports = server;
