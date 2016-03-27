// var playback_id = 42643203; //42643003;
// var json_url = "https://nhl.bamcontent.com/nhl/id/v1/"+playback_id+"/details/web-v1.json";
// // var json_url = "http://jsonview.com/example.json";

// var page = require('webpage').create();
// page.open(json_url, function() {
//   var json_string = page.plainText; //$('body').html();
//   console.log(json_string);
//   var json_object = JSON.parse(json_string);
//   console.log(json_object);

//   var vids = json_object["playbacks"],
//   	  desired_size = "FLASH_450K_400X224",
//   	  video_url = "";


//   for(var i=0,j=vids.length; i<j; i++){
//   	if (vids[i]["name"] === desired_size){
//   		video_url = vids[i]["url"];
//   	}
//   }
//   console.log(video_url);
//   phantom.exit()
// });

var gifshot = require('gifshot');

console.log(gifshot);


var duration = 15; // seconds

gifshot.createGIF({
	'video': [
		//'http://md-akc.med.nhl.com/mp4/nhl/2016/03/17/9b13092c-abd3-44f5-a8a7-bcbbbc0f61e4/1458256644042/asset_450k.mp4', 
		'http://md-akc.med.nhl.com/mp4/nhl/2016/03/17/31edb250-046d-46f9-a91a-48dfb723abb4/1458256765257/asset_450k.mp4'
	],
	'gifWidth': 400,
	// The number of frames to use to create the animated GIF 
	// Note: Each frame is captured every 100 milleseconds of a video and every ms for existing images 
	'numFrames': ( (1000*duration) / 100 ),
},function(obj) {
	if(!obj.error) {
		var image = obj.image,
		animatedImage = document.createElement('img');
		animatedImage.src = image;
		document.body.appendChild(animatedImage);
	}
});



// phantom.exit();