// server side
const express = require("express")
const path = require("path")
const bodyParser = require('body-parser')
const apiRouter = require('./api')

const app = express()

const assetsFolder = path.resolve(__dirname, 'views/assets')
app.use(express.static(assetsFolder))

app.use(bodyParser.json({ type: 'application/json' }))


// step 1. define path
const viewsFolder = path.resolve(__dirname, 'views')

// step 2. set engine
app.set("view engine", "ejs")

// step 3. render view
app.get('/', (req, res) => {
    res.render('home')
})

app.use('/api', apiRouter)

app.listen(8088)

console.log('App started on 8088...')