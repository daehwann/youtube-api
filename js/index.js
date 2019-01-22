// YouTube API stuff
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Init empty array of iframe IDs, one from each video
var iframeIds = [];

// For each iframe you find, add its ID to the iframeIds array
var iframes = document.querySelectorAll(".video-item iframe");
iframes.forEach(function(iframe) {
	iframeIds.push(iframe.id);
});

// Player Object for trakcing time
var players = {}

// Once the YouTube API is ready, for each iframeId in your array, create
// a new YT player and give it the onReady event
function onYouTubeIframeAPIReady() {
	iframeIds.forEach(function(iframeId) {
		var player = new YT.Player(iframeId, {
			events: {
				onReady: onPlayerReady,
				onStateChange: onPlayerStateChange
			}
		});
	});
}

function onPlayerReady(event) {
	//set player object
	var player = event.target;
	players[player.getVideoData().video_id] = player;
}

/**
 *  Youtube State
 *	UNSTARTED: -1
 *	ENDED: 0
 *	PLAYING: 1
 *	PAUSED: 2
 *  BUFFERING: 3
 *	CUED: 5
 * 
 * @param {*} code 
 */
function getStateByCode(code) {
	return Object.keys(YT.PlayerState).find(key => YT.PlayerState[key] == code)
}

var percentageToTrack = [20, 50, 75, 90];
var stateToTrack = ['UNSTARTED', 'ENDED'];

function onPlayerStateChange(event) {
	var player = event.target;	// iframe player
	var video = player.getVideoData(); // video content data

	var state = getStateByCode(event.data); // player state
	console.log(state, event.target.getVideoData())

	if (player.getPlayerState() == YT.PlayerState.PLAYING) {
		player.intervalID = setInterval(function (){
			var percentage = Math.round(player.getCurrentTime() / player.getDuration() * 100);
			var timeValid = percentageToTrack.some(function (p) { return p == percentage });

			console.log('VALID?', player.intervalID, percentage, timeValid)
			if (timeValid) {
				console.log("ANALYTICS CODE to track video", video.title)
			}
		}, Math.round(player.getDuration()) / 100 * 1000 ); //Set Interval Time by player duration
	} else if (player.intervalID) {
		clearInterval(player.intervalID);
		console.log('internal cleared', player.intervalID, video.video_id)
	}

	function videoInterval(state) {
		
	}
}