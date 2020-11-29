var express = require('express');
var router = express.Router();
const url = require('url');
const axios = require('axios');
const db=require('./db')
const key = "AIzaSyBxvqGxEvb6ZBnyRTM8isBU_6O-MAfuNiQ"



//מקבל בקשה לחיפוש ומנסה לחפש במסד נתונים
router.get('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  const searchText = url.parse(req.url, true).query.searchText;

  db.query(`select pts.search_text, name ,adress
  from places as p
  join place_to_search as pts
  on pts.place_id =p.id 
  join searches s
  on s.search_text= pts.search_text
  where s.search_text='${searchText}'`, async (err, response) => {
    //אם נמצאו תוצאות מתאימות , שולח אותם לקליינט
    if (response.rowCount != 0) {
      res.send(response.rows)
      db.query(`select counter from searches where search_text='${searchText}'`, (err, response) => {
        var counter = response.rows[0].counter + 1
        //מעדכן את המונה של החיפוש
        db.query(`update searches
        set counter = ${counter}
        where search_text='${searchText}'`)
      })
    }
    else {
      //אם לא נמצאו תוצאות מתאימות, ניגש לחפש בגוגל
      try {
        var uri= `https://maps.googleapis.com/maps/api/place/textsearch/json?input=${searchText}&inputyype=textquery&fields=formatted_address,name&language=iw&key=${key}`
        var aaa = encodeURI(uri)
        const placesList = [];
        const { data } = await axios.get(
          aaa        )
        var counter = 0;
        var num = data.results.length;
        //במידה ונמצאו תוצאות- הכנס את הנתוני למסד נתונים
        if (num != 0) {
          do {
            placesList.push({ "id": data.results[counter].place_id, "name": data.results[counter].name, "adress": data.results[counter].formatted_address })
            counter++
          }
          while (counter < 5 && counter < num)

          db.query(`insert into searches values('${searchText}',1)`)
          placesList.forEach(place => {
            db.query(`select * from places where id= '${place.id}'`, (err, resp) => {
              if (resp.rowCount == 0)
                db.query(`insert into places values('${place.id}', '${place.name}','${place.adress}');`, (err, resp) => {
                  db.query(`insert into place_to_search values('${searchText}', '${place.id}');`, (err, resp) => { })
                  console.log(err);
                })
              else
                db.query(`insert into place_to_search values('${searchText}', '${place.id}');`, (err, resp) => { })
            });
          });
        }
        //שלח את הנתונים לקליינט
        res.json(placesList)
      }
      catch (err) {
        next(err);
      }
    }
  });
});

module.exports = router;
