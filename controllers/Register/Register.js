const moment = require('moment')

// exports.findAll = (req, res, next) => {
//     req.getConnection((err, connection) => {
//         if (err) return next(err)
//         var sql = "SELECT * FROM diligent_queue_register ";
//         // var params = "%" + req.query.term + "%"
//         connection.query(sql, (err, results) => {
//             if (err) return next(err)
//             res.send(results)
//         })
//     })
// }

exports.create = (req, res, next) => {
    let { body } = req
    console.log(body)
    let post = {
        cid: body.cid,
        user_id: body.user_id,
        picture: body.picture,
        tel: body.tel,
        d_update: moment().format('YYYY-MM-DD') + ' ' + moment().format('HH:mm:ss')

    }

    req.getConnection(function (err, connection) {

        connection.query("select cid from diligent_queue_register where cid=?", [post.cid], function (err, results) {
            let usersRows = JSON.stringify(results);
            if (parseInt(usersRows.length) > 2) {
                console.log('dup')
                res.send({
                    status: 201, message: 'เลขบัตร 13 หลัก is Duplicate'

                })
            } else {
                console.log('no')
                connection.query("insert into diligent_queue_register set ?", post, (err, results) => {
                    if (err) return console.log(err)
                    res.send({ status: 'ok', results })
                })
            }
        })
    })

}


exports.getCid = (req, res, next) => {
    let userid = req.params.userid
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = `SELECT * FROM diligent_queue_register  where user_id = '${userid}'  `;
        // var params = "%" + req.query.term + "%"
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}


