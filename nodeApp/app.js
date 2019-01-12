const express = require('express')
const app = express()
const port = 3000

app.get('/', function (req, res) {
    res.send('Hello World!')
})

const Sequelize = require('sequelize');
const sequelize = new Sequelize('db', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // SQLite only
    storage: 'db.sqlite'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// define Dummy model
const Dummy = sequelize.define('dummy', {
    name: {
        type: Sequelize.STRING
    },
    active: {
        type: Sequelize.BOOLEAN
    }
});

// force: true will drop the table if it already exists
Dummy.sync({
    force: true
}).then(() => {
    // Table created
    return Dummy.create({
        name: 'dummi 1',
        active: true
    });
});


// read
app.get('/dummies', function (req, res) {
    Dummy.findAll().then(dummies => {
        console.log(dummies)
        res.send(dummies)
    })


})

// Create 
app.post('/dummies', function (req, res) {

    Dummy.create({
        name: 'dummi 1',
        active: true
    }).then(() => res.send('dummy created'));
})

// update
app.put('/dummies/:id', function (req, res) {
    res.send('dummy updated')
})

// delete
app.delete('/dummies/:id', function (req, res) {
    req.body
    res.send('dummy deleted')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))