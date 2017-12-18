// server side
const express = require("express")
const path = require("path")
const bodyParser = require('body-parser')
const apiRouter = require('./api')

const app = express()

app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "views"))

const assetsPath = path.resolve(__dirname, 'views/assets')
app.use(express.static(assetsPath))


app.use(bodyParser.json({ type: 'application/json' }))


const viewsFolder = path.resolve(__dirname, 'views')



app.get('/', (req, res) => {
    res.render('home')
})

app.use('/api', apiRouter)

app.listen(8088)

console.log('App started on 8088...')