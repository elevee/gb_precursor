$(document).ready(function(){
	var date_input = $('.day').attr('data-date');
	var json_url = "https://statsapi.web.nhl.com/api/v1/schedule?startDate="+date_input+"&endDate="+date_input+"&expand=schedule.teams,schedule.linescore,schedule.broadcasts.all,schedule.ticket,schedule.game.content.media.epg,schedule.decisions,schedule.scoringplays,schedule.game.content.highlights.scoreboard,team.leaders&leaderCategories=points,goals,assists&site=en_nhl&teamId=";
	$.get(json_url, null, function(data){
		console.log("success!", data);
		var date 	= data["dates"][0]["date"], 
			games 	= data["dates"][0]["games"];
		console.log(games);
		console.log("this means yesterday is ", moment(date).subtract(1, 'days').format("YYYY-MM-DD"));

		$('.day span').html("<a href='/?date="+ moment(date).subtract(1, 'days').format("YYYY-MM-DD") + "'><span class='yesterday'>&lt </span></a>" + moment(date).format("dddd, MMMM Do") + "<a href='/?date="+ moment(date).add(1, 'days').format("YYYY-MM-DD") + "'><span class='tomorrow'> &gt</span></a>");

		$games = $('.games table');
		for(i=0,j=games.length;i<j;i++){
			var awayTeam 	= games[i]["teams"]["away"]["team"]["teamName"],
				homeTeam 	= games[i]["teams"]["home"]["team"]["teamName"],
				awayAbbrev 	= le(games[i]["teams"]["away"]["team"]["abbreviation"]),
				homeAbbrev	= le(games[i]["teams"]["home"]["team"]["abbreviation"]),
				gameId	 	= games[i]["gamePk"];

			$games.append("<tr onClick='window.location = \"/games/"+gameId+"\";'><td class='team_away'><img src='http://a.espncdn.com/combiner/i?img=/i/teamlogos/nhl/500/"+awayAbbrev+".png&h=75&w=75' />"+awayTeam+"</td><td class='team_home'>"+homeTeam+"<img src='http://a.espncdn.com/combiner/i?img=/i/teamlogos/nhl/500/"+homeAbbrev+".png&h=75&w=75' /></td></tr>");
		}
	});

	

});

// var duration = 15; // seconds

// gifshot.createGIF({
// 	'video': [
// 		//'http://md-akc.med.nhl.com/mp4/nhl/2016/03/17/9b13092c-abd3-44f5-a8a7-bcbbbc0f61e4/1458256644042/asset_450k.mp4', 
// 		'http://md-akc.med.nhl.com/mp4/nhl/2016/03/17/31edb250-046d-46f9-a91a-48dfb723abb4/1458256765257/asset_450k.mp4'
// 	],
// 	'gifWidth': 400,
// 	// The number of frames to use to create the animated GIF 
// 	// Note: Each frame is captured every 100 milleseconds of a video and every ms for existing images 
// 	'numFrames': ( (1000*duration) / 100 ),
// },function(obj) {
// 	if(!obj.error) {
// 		var image = obj.image,
// 		animatedImage = document.createElement('img');
// 		animatedImage.src = image;
// 		document.body.appendChild(animatedImage);
// 	}
// });