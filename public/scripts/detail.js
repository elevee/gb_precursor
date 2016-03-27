$(document).ready(function(){
	// var str = "https://statsapi.web.nhl.com/api/v1/schedule?startDate=2016-03-18&endDate=2016-03-18&expand=schedule.teams,schedule.linescore,schedule.broadcasts.all,schedule.ticket,schedule.game.content.media.epg,schedule.decisions,schedule.scoringplays,schedule.game.content.highlights.scoreboard,team.leaders&leaderCategories=points,goals,assists&site=en_nhl&teamId=";
	var gameId 			= $('.game').attr('data-gameId'),
		sched_uri 		= "https://statsapi.web.nhl.com/api/v1/schedule?gamePk=" + gameId + "&expand=schedule.teams,schedule.linescore,schedule.broadcasts.all,schedule.ticket,schedule.game.content.media.epg,schedule.decisions,schedule.scoringplays,schedule.game.content.highlights.scoreboard,team.leaders&leaderCategories=points,goals,assists&site=en_nhl&teamId=",
		media_uri 		= "https://statsapi.web.nhl.com/api/v1/game/"+gameId+"/content",
		schedResponse 	= null,
		mediaResponse 	= null;

	var $game = $('.game');

	var getSched = function(){
		return $.ajax({
			url: sched_uri,
			dataType: 'json',
			success: function(data){
				console.log("Sched info: ", data);
				schedResponse = data;
			}
		});
	};

	var getMedia = function(){
		return $.ajax({
			url: media_uri,
			dataType: 'json',
			success: function(data){
				console.log("Media info: ", data);
				mediaResponse = data;
			}
		});
	};

	$.when(
		getSched(),
		getMedia()
	).then(function(){
		var game = ( schedResponse["dates"][0]["games"] && schedResponse["dates"][0]["games"][0] && schedResponse["dates"][0]["games"].length === 1) ? schedResponse["dates"][0]["games"][0] : null;
		if (game){
			var pdCtr = 0, //counts the periods
				pd = "",
				awayTeamName 	= game["teams"]["away"]["team"]["teamName"],
				awayAbbrev 		= le(game["teams"]["away"]["team"]["abbreviation"]),
				awayTeamScore	= game["teams"]["away"]["score"],
				homeTeamName 	= game["teams"]["home"]["team"]["teamName"],
				homeAbbrev 		= le(game["teams"]["home"]["team"]["abbreviation"]),
				homeTeamScore	= game["teams"]["home"]["score"],
				status			= game["status"]["detailedState"];

			$matchup = $('.matchup');
			$matchup.find('.away_team span').html(awayTeamName);
			$matchup.find('.away_team h1').html(awayTeamScore);
			$matchup.find('.away_team img').attr("src", "http://a.espncdn.com/combiner/i?img=/i/teamlogos/nhl/500/"+awayAbbrev+".png&h=400&w=400");
			$matchup.find('.home_team span').html(homeTeamName);
			$matchup.find('.home_team h1').html(homeTeamScore);
			$matchup.find('.home_team img').attr("src", "http://a.espncdn.com/combiner/i?img=/i/teamlogos/nhl/500/"+homeAbbrev+".png&h=400&w=400");
			$matchup.find('.status').html(status);

			var goals = [],
				avail_prds = [1,2,3,4,5]; //remaining ones will show as 'No Scoring'
			
			console.log("GOALS PARSED FROM MEDIA BY TYPE GOAL, (dupes in past): ", goals, " count: ", goals.length);

			game["scoringPlays"].forEach(function(scoringPlay, index){
				console.log(scoringPlay, index);
				var period = scoringPlay["about"]["period"],
					payload = "", //start concatenation
					scorer,
					scorerId,
					pbs,
					playbackUrl,
					playbackWidth,
					desired_size = "FLASH_450K_400X224";
				
				//Keep track of non-goal-scoring periods
				var pos = $.inArray(period, avail_prds);
				if (pos !== -1){
					avail_prds.splice(pos, 1)
				}

				scoringPlay["players"].forEach(function(player){ //assign scorer name
					if (player["playerType"] === "Scorer"){
						scorer = player["player"]["fullName"];
						scorerId = player["player"]["id"];
					}
					//Assists?
				});


				var mediaItems = mediaResponse["media"]["milestones"]["items"];
				if (mediaItems && mediaItems.length > 0){
					for(var i=0,j=mediaItems.length;i<j;i++) {
						// If it's of type Goal, and the playerIds and period times match up (prob overkill)
						// console.log("Test 1: Type goal?  ", mediaItems[i]["type"], "\n");
						// console.log("Test 2: MediaItems id (", mediaItems[i]["playerId"], ") matches scorerId (", scorerId, ")? \n");
						// console.log("Test 3: Same time of period?  ", mediaItems[i]["periodTime"], "   vs   ", scoringPlay["about"]["periodTime"], "\n");
						if (mediaItems[i]["type"] === "GOAL" && (mediaItems[i]["period"] == scoringPlay["about"]["period"]) && (mediaItems[i]["periodTime"] === scoringPlay["about"]["periodTime"]) ){  // (mediaItems[i]["playerId"] == scorerId)
							goals.push(mediaItems[i]);
							break; //there could be duplicates of same goal. Puttin an end to that.
						}
					};	
				}
				console.log("HOW OUR GOALS LOOKIN? ", goals);
				console.log("goals index: ", goals[index]);
				pbs = goals[index]["highlight"]["playbacks"];
				for(var i=0,j=pbs.length; i<j;i++){
					if (pbs[i]["name"] === desired_size){
						playbackUrl = pbs[i]["url"];
						playbackWidth = pbs[i]["width"] ? pbs[i]["width"] : 400;
						console.log("actual playback width is "+pbs[i]["width"]);
					}
				}

				// console.log("Going to play video "+goals[index]+" at index "+ index + " ("+scorer+") which has a width of "+playbackWidth+". Should give a media record")

				payload += "<div class='goal "+ (scoringPlay["team"]["name"] === game["teams"]["home"]["team"]["name"] ? "home":"away")+"Goal'><h4>" + scorer + "</h4>";
				payload += "<div class='goalGif' data-playbackId='"+goals[index]["highlight"]["mediaPlaybackId"]+"' data-playbackUrl='"+playbackUrl+"'></div>";
				payload += "</div>";
				$("div#period"+period+".accordion-content").append(payload);


				var devMode = false; 
				console.log("about to process video " + playbackUrl);
				if (!devMode){
					var duration = 15; // seconds
					gifshot.createGIF({
						'video': [
							playbackUrl
							//'http://md-akc.med.nhl.com/mp4/nhl/2016/03/17/9b13092c-abd3-44f5-a8a7-bcbbbc0f61e4/1458256644042/asset_450k.mp4', 
							// 'http://md-akc.med.nhl.com/mp4/nhl/2016/03/17/31edb250-046d-46f9-a91a-48dfb723abb4/1458256765257/asset_450k.mp4'
						],
						'gifWidth': playbackWidth,
						// The number of frames to use to create the animated GIF 
						// Note: Each frame is captured every 100 milleseconds of a video and every ms for existing images 
						'numFrames': ( (1000*duration) / 100 ),
					},function(obj) {
						if(!obj.error) {
							console.log("GIFSHOT COMPLETE");
							var image = obj.image,
							animatedImage = document.createElement('img');
							animatedImage.src = image;
							// document.body.appendChild(animatedImage);
							$(".goalGif[data-playbackUrl='"+playbackUrl+"']").html(animatedImage);
							console.log("GIF ELEMENT: ", animatedImage, "      width was input as "+playbackWidth);
						}
					});	
				} else {
					var _html = "<a href='"+playbackUrl+"' target='_blank'><img src='http://placehold.it/400x275?text="+playbackWidth+"' /></a>";
					$(".goalGif[data-playbackUrl='"+playbackUrl+"']").html(_html);
				}
				

			});
			// console.log("periods now avail: ", avail_prds);
			avail_prds.forEach(function(prd){
				$("div#period"+prd+".accordion-content").append("No Scoring");
			});

		}
	


	});



	// $('.accordion a').on('click', function(event){
	// 	var $t = $(this),
	// 		$tab = $t.closest('li');

	// 	console.log('nearest li is ', $tab);
	// 	if ($tab.find('.accordion-content').is(':visible')){
	// 		console.log("yeah this shit's visible");
	// 		$tab.find('.accordion-content').slideUp();
	// 	}
	// });	

});