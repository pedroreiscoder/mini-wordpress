const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')

const admin = require('./routes/admin')

const app = express()

app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'public')))

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/blogApp", { useNewUrlParser: true }).then(() => {
    console.log("Conectado ao mongo")
}).catch((err) => {
    console.log("Erro ao se conectar: " + err)
})

app.get('/', (req, res) => {

    res.send('Rota principal')
})

app.get('/posts', (req, res) => {

    res.send('Lista Posts')
})

app.use('/admin', admin)

const PORT = process.env.PORT || 8081

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})