var express 	= require('express'),
	http 		= require('http'),
	bodyParser 	= require('body-parser'),
	ejs			= require('ejs'),
	port		= 3000,
	app 		= express();

var games = require('./routers/games');

app.use('/games', games);

app.get('/', function(request, response) {
	var date;
	if (request.query.date) {
		date = request.query.date;
	} else {
		d = new Date();
		date = d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + d.getDate()).slice(-2);
		console.log("date is ", date);
	}

	response.render('index', { 
		title: "GIF Beukeboom",
		style: "index",
		date: date 
	});
});

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

// app.get('/', function(req, res){
// 	res.render('index')
// });

// app.get('/games', function(req, res){
	
	

// 	res.on('finish', function(){

// 	});
// });




app.listen(port, function(){
	console.log("Listening on port " + port);	
});

var monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];