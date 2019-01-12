const express = require('express')
const app = express()
const port = 3000

app.get('/', function (req, res) {
    res.send('Hello World!')
})



// read
app.get('/dummies', function (req, res) {
    res.send('dummy readed')
})

// Create 
app.post('/dummies', function (req, res) {
    res.send('dummy created')
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