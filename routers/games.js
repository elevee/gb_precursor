var express = require('express');
var router = express.Router();

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });
// // define the home page route
// router.get('/', function(req, res) {
//   res.send('Birds home page');
// });
	router.get('/', function(req, res){
		// res.render('index')
		res.send("We on the /games side of things.");
	});
// // define the about route
// router.get('/about', function(req, res) {
//   res.send('About birds');
// });
	router.get('/:id', function(req, res){
		res.render('detail.ejs', { 
			title: "GIF Beukeboom Detail Page",
			style: "detail",
			id: req.params.id 
		});
		// res.send("we at the games id page. Id= "+req.params.id);
	});

module.exports = router;