const app = require('./app');
const Connect = require('./conecction');

const port = 3000;
const db = new Connect();
const conn = db.createConnection();

conn.on('error', console.error.bind(console, 'connection error'));

conn.on('open', () => {
  console.log('Conexión a la base de datos establecidad....');
});

app.listen(port, () => {
  console.log(`Escuchando en el port ${port}`)
})