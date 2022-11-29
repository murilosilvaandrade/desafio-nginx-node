const express = require('express');
const app = express();
const port = 3000;

const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb',
};

const mysql = require('mysql');
const connection = mysql.createConnection(config);

async function insertPeople(name, callbackFunction) {
  const sqlCommand = `INSERT INTO people(name) VALUES('${name}')`;
  if (!name || !connection) return;

  await connection.query(sqlCommand, callbackFunction);
}

async function createTablePeopleIfNotExists() {
  const sqlCommand =
    'CREATE TABLE IF NOT EXISTS people(id int not null auto_increment,name varchar(255), primary key(id));';

  await connection.query(sqlCommand, (err, result, fields) => {
    if (err) throw err;
  });
}

async function getPeople(callbackFunction) {
  const sqlQuery = `SELECT * FROM people`;
  if (!connection) return;

  await connection.query(sqlQuery, callbackFunction);
}

app.get('/', async (req, res) => {
  await getPeople((err, result, fields) => {
    if (err) throw err;
    const str = result[0].id + ' - ' + result[0].name;   
    res.send(`<h1>Full Cycle Rocks!</h1><h3>${str}</h3>`);
  });
});

app.post('/command/:name', async (req, res) => {
  const { name } = req.params;
  if (!name) {
    res.statusCode = 406;
    res.send();
  }

  await insertPeople(name, (err, result, fields) => {
    if (err) throw err;
    res.statusCode = 200;
    res.send();
  });

  res.statusCode = 500;
  res.send();
});

app.listen(port, async () => {
  console.log('Criando a tabela People (se ainda não existir)');
  await createTablePeopleIfNotExists();
  const name = 'Murilo Andrade';
  console.log('Inserir pessoas com nome: ' + name);
  await insertPeople(name, (err, result, fields) => {
    if (err) throw err;
  });
  console.log(`Servidor na porta ${port}`);
});