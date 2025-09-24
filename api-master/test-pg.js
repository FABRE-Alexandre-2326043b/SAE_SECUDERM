const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'root',
  password: 'root',
  database: 'secuderm',
});
client.connect()
  .then(() => {
    console.log('Connected!');
    return client.end();
  })
  .catch(err => {
    console.error('Connection error', err);
  });