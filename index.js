const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const myConnection = require('express-myconnection')
const http = require('http')
const socketIO = require('socket.io')

const moment = require('moment')
const errorHandler = require('./middleware/errorHandler')
const cron = require('node-cron')

const config = require('./config')
const routes = require('./routes')


const PORT = 4999
const strQrcode = '';


// our server instance
const server = http.createServer(app)
// This creates our socket using the instance of the server
const io = socketIO.listen(server)

app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: '*/*' }))

app.use(myConnection(mysql, config.dbOption, 'pool'))
routes(app)

const con = mysql.createConnection(
    config.dbOption
)
con.connect(function (err) {
    if (err) throw err
    const connectt = con.query
    if (!connectt.length)
        throw new Errors.InternalServerError('country not found');


})

// cron.schedule('10 * * * * *', function () {
//     console.log('run update result lab')
//     con.query(`UPDATE q.queue q
//     LEFT JOIN 
//     (SELECT q.id,q.vn,q.hn,q.queue,confirm_report,SUM(IF(confirm_report = 'Y',1,0))  AS chkLabSuccess,
//             IF(confirm_report IS null ,0,1)  AS chkLab,COUNT(q.vn) AS countLab
//     FROM q.queue q
//     LEFT JOIN ( SELECT vn,confirm_report FROM hos.lab_head WHERE order_date = CURDATE() ) AS  h  ON h.vn = q.vn
//     WHERE vstdate = CURDATE() AND q.lab_chk is NULL
//     GROUP BY q.vn ) AS t1 ON t1.vn = q.vn
//     SET lab_status = if(chkLab > 0 && chkLabSuccess = countLab,'Y',if(chkLab > 0 && chkLabSuccess < countLab,'N',NULL))
//     WHERE  vstdate = CURDATE() AND q.lab_chk is NULL  `, function (err, results) {
//         if (err) return next(err)

//     })
// })

io.on('connection', socket => {
    console.log('New client connected')
    
    // cron.schedule('10 * * * * *', function () {
    //     io.sockets.emit('083')
    //     console.log('refresh monitor')
    // })

    socket.on('kios', (dep, vn) => {
        console.log('kios')
        con.query(`UPDATE q.queue q 
        LEFT JOIN hos.patient p ON p.hn = q.hn
        set tname = CONCAT(p.fname,' ',p.lname),q.cid=p.cid

        WHERE q.vstdate = CURDATE() AND q.tname IS NULL `, function (err, results) {
            if (err) return next(err)

        })


        io.sockets.emit(dep, dep, vn)
        // con.query(" SELECT * FROM amulet  WHERE id = ? ", [id], function (err, results) {
        //     if (err) return next(err)
        //     if (results.lenght > 0) {

            
        //     } else {

        //     }
        // })


    })

    socket.on('call-test', () => {
        console.log('test')
        io.sockets.emit('speech2')

    })

    socket.on('call', (q, tname, room,dep) => {
        io.sockets.emit('speech', q, tname, room,dep)

    })
    socket.on('call-next', (q, tname, room) => {
        io.sockets.emit('call-refresh', q, tname, room)

    })
    socket.on('call-screen', (q, tname, room) => {

        io.sockets.emit('speech-call', q, tname, room)
        con.query(`UPDATE q.queue SET screen_date_time_call = NOW() WHERE vstdate=CURDATE() AND queue = ${q} `, function (err, results) {
            if (err) return console.log(err)

        })


    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})


app.use(errorHandler)


server.listen(PORT, () => {
    console.log('test')
})
server.timeout = 20000