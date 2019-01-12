const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

const cors = require('cors')

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.get('/', function (req, res, next) {
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
app.get('/dummies', function (req, res, next) {
    Dummy.findAll().then(dummies => {
        res.send({
            success: true,
            data: dummies
        })
    })

});

// read one
app.get('/dummies/:id', function (req, res, next) {
    const id = req.param('id');
    Dummy.findByPk(id).then(dummy => {
        res.send({
            success: true,
            data: dummy
        })
    })

});

// Create 
app.post('/dummies', function (req, res, next) {
    const body = req.body;
    Dummy.create(body).then((created) => res.send({
        success: true,
        data: created
    }));
})

// update
app.put('/dummies/:id', function (req, res, next) {
    const body = req.body;
    const id = req.param('id');

    console.log("id,body", id, body);

    Dummy.update(body, {
            where: {
                id: id
            }
        })
        .then(result =>
            res.send({
                success: true,
                data: result
            })
        )
        .error(err =>
            res.send({
                success: false,
                err: err
            })
        )
})

// delete
app.delete('/dummies/:id', function (req, res, next) {
    const id = req.param('id');
    Dummy.destroy({
            where: {
                id: id
            }
        })
        .then(result =>
            res.send({
                success: true,
                data: result
            })
        )
        .error(err =>
            res.send({
                success: false,
                err: err
            })
        )
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))