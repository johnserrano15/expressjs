const app = require('./app');
const port = 3000;

app.conn.on('error', console.error.bind(console, 'connection error'));

app.conn.on('open', () => {
  console.log('Conexión a la base de datos establecidad....');
});

app.app.listen(port, () => {
  console.log(`Escuchando en el port ${port}`)
})