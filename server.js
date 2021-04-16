const express = require('express')
const aws = require('aws-sdk')
const app = express()
//const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const homeRouter = require('./routes/home')
const createRouter = require('./routes/create')
const editRouter = require('./routes/edit')
const putRouter = require('./routes/put')
const queueRouter = require('./routes/queue')
const activateRouter = require('./routes/activate')

let awsConfig = {
    "region": "us-west-2",
    "endpoint": "http://dynamodb.us-west-2.amazonaws.com",
    "accessKeyId": "AKIA4QBLLSYMKH4BY4FS", "secretAccessKey": "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"
};
aws.config.update(awsConfig);
const docClient = new aws.DynamoDB.DocumentClient()

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
//app.set('layout', 'layouts/layout')
//app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))
app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/home', homeRouter)
app.use('/create', createRouter)
app.use('/edit', editRouter)
app.use('/put', putRouter)
app.use('/queue', queueRouter)
app.use('/activate', activateRouter)

app.use(methodOverride('_method'))

app.listen(process.env.PORT || 4000)
