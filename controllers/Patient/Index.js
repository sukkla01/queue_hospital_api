exports.findPatient = (req, res, next) => {
    let hn = req.params.hn
    console.log(hn)
    req.getConnection((err, connection) => {
        if (err) return next(err)
        var sql = `SELECT CONCAT(pname,fname,' ',lname) AS tname,hn FROM patient WHERE hn  like '%` + hn + `%' `;
        // var params = "%" + req.query.term + "%"
        connection.query("SET NAMES utf8"); 
        connection.query(sql, (err, results) => {
            if (err) return next(err)
           
            res.send(results)
        })
    })
}
