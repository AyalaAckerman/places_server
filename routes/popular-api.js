var express = require('express');
var router = express.Router();
const db=require('./db')


router.get('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    db.query(`select * from searches where counter=
    (select max(counter) from searches)`, (err, response) => {
        console.log(response.rows)
        res.json({ searchText: response.rows[0].search_text, counter: response.rows[0].counter })
    })
})

module.exports = router;