const jwt = require('jwt-simple')
const config = require('../config')
//var time = require('time');

function tokenForUser(user) {
    const timestamp = new Date().getTime()
    return jwt.encode({
        // passowrd: user.fullname,
        username: user.username,
        dep_path : user.dep
        // iat: timestamp
    },
        config.secret
    )
}

exports.signin = (req, res, next) => {
    console.log('user')
    res.send({ token: tokenForUser(req.user) })
}


exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = "select * from q.user ";
        var params = "%" + req.query.term + "%"
        connection.query(sql, (err, results) => {
            if (err) return next(err)
            res.send(results)
        })
    })
}
