//let config = require('./config.js');
let mongojs = require('mongojs');
let db = mongojs("cho:woshinaochou4@ds235768.mlab.com:35768/truthbook", ['yahoo']);
let express = require('express');
// let https = require('https');
// let fs = require('fs'); // Using the filesystem module
// let credentials = {
//   key: fs.readFileSync('my-key.pem'),
//   cert: fs.readFileSync('my-cert.pem')
// };

let app = express();
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({
  extended: true
}); // for parsing form data


app.use(urlencodedParser);


//set Static path
app.use(express.static('public'));

//incoporate ejs, we are gonna use ejs as the view engine
app.set('view engine', 'ejs');

let count = 0;
let thesubmissions = [];


// app.get('/count', function(req, res) {
//   //this is middleware
//   count++;
//   res.send('<html><body><h1>You recieved' + count + '</h1></body></html>');
// });
app.get('/', function(req, res) {
  db.yahoo.find({}, function(err, saved) {
    if (err || !saved) {
      console.log("No results");
    } else {
      console.log(saved);
      res.render('template.ejs', {
        truthAnswers: saved.reverse()
      });
    }
  });
});
app.get('/new',function(req,res){
  res.render('new.ejs');
})

app.get('/formpost', function(req, res) {

  console.log("They submitted:" + req.query.textfield);
  console.log(typeof(req.query.textfield))
  // let htmltoSend = "<html><head><link rel=\"stylesheet\" href=\"css/submit.css\" ></head><body><div id=\"showAnswer\"><h1 style=\"margin:auto;width:50%\">You wrote: " + req.query.textfield + "</h1><form method=\"GET\" action=\"/\"><button class=\"button\">Back</button></form></div></body></html>";
  // res.send(htmltoSend);
  thesubmissions.push(req.query.textfield);
  db.yahoo.save({
    "truthAnswers": req.query.textfield
  }, function(err, saved) {
    if (err || !saved) console.log("Not saved");
    else console.log("Saved");
  });
  res.render('result.ejs',{submission:req.query.textfield})
  // res.redirect('/test');
  // });


});


app.get('/search', function(req, res) {
  let query = new RegExp(req.query.key, 'i');
  db.yahoo.find({
      "truthAnswers": query
    },
    function(err, saved) {
      if (err || !saved) {
        console.log("No results");
      } else {
        res.render('template.ejs', {
          truthAnswers: saved
        });
      }
  });
});


// app.get('/search', function(req, res) {
//   db.mycollection.find({"attribute":"value_to_search_for"}, function(err, saved) {
//     if( err || !saved) console.log("No results");
//     else saved.forEach( function(record) {
//       console.log(record);
//     } );
//   });
// });
// let httpsServer = https.createServer(credentials, app);

let server = app.listen(app.get('port'), function() {
  console.log('listening on port ', server.address().port);
});

