// Set main video player vars
var videosrc = null;
var oggsrc = null;
var videojq = null;
var forwardFolder = "video/frontH264/";
var backwardFolder = "video/backward/";
var caseFolder = "video/case/";
var videoLayer = 1;

var useVideo = null;
var usemp4 = null;
var useogg = null;

var overlayVideo = document.getElementById("layer2video");
var overlaymp4 = document.getElementById("mp4_src2");
var overlayogg = document.getElementById("ogg_src2");

// Set video list and index vars
var videoList = [
	"01_BookOpen",
	"openTo02",
	"02To03",
	"03To04",
	"04To05",
	"05To06",
	"06To07",
	"07To08",
	"08To09",
	"09To10",
	"10To11",
	"11To12",
	"12To13",
	"13To14",
	"14To15",
	"15To16",
	"16To17",
	"17To18",
	"18To19",
	"19To20",
	"20To21",
	"21To22",
	"22To23",
	"23To24",
	"24To25",
	"25To26",
	"26To27",
	"27To28",
	"28To29",
	"29To30",
	"EndVid"
];
var reverseVideoList = [
	"01_BookOpenReverse",
	"openTo02Reverse",
	"02To03Reverse",
	"03To04Reverse",
	"04To05Reverse",
	"05To06Reverse",
	"06To07Reverse",
	"07To08Reverse",
	"08To09Reverse",
	"09To10Reverse",
	"10To11Reverse",
	"11To12Reverse",
	"12To13Reverse",
	"13To14Reverse",
	"14To15Reverse",
	"15To16Reverse",
	"16To17Reverse",
	"17To18Reverse",
	"18To19Reverse",
	"19To20Reverse",
	"20To21Reverse",
	"21To22Reverse",
	"22To23Reverse",
	"23To24Reverse",
	"24To25Reverse",
	"25To26Reverse",
	"26To27Reverse",
	"27To28Reverse",
	"28To29Reverse",
	"29To30Reverse"
];

var caseStudyVideos = [
	"13To14",
	"15To16",
	"17To18",
	"19To20"
];

var videoIndex = 0;

// Set backwards side load video element (hidden)
var backvideo = document.createElement('video');
backvideo.autoPlay = false;

var back_mp4 = document.createElement('source');
back_mp4.type = "video/mp4";
back_mp4.src = backwardFolder + reverseVideoList[videoIndex] + ".mp4";

var back_ogg = document.createElement('source');
back_ogg.type="video/ogg";
back_ogg.src = backwardFolder + reverseVideoList[videoIndex] + ".ogg";

backvideo.appendChild(back_mp4);
backvideo.appendChild(back_ogg);

backvideo.load();

// Set forwards side load video element (hidden) and init next video
var frontvideo = document.createElement('video');
frontvideo.autoPlay = false;

var front_mp4 = document.createElement('source');
front_mp4.type = "video/mp4";
front_mp4.src = forwardFolder + videoList[videoIndex+1] + ".mp4";

var front_ogg = document.createElement('source');
front_ogg.type="video/ogg";
front_ogg.src = forwardFolder + videoList[videoIndex] + ".ogg";

frontvideo.appendChild(front_mp4);
frontvideo.appendChild(front_ogg);
frontvideo.load();

/**
 * enableButtons function.
 * Fades out video and enables back and forward buttons
 * 
 * @access public
 * @optional param bool fade
 * @optional param int time
 * @return void
 */
var enableButtons = function(fade,time) {
	if (!window.buttonsDisabled || window.end) return;
	if (typeof fade == 'undefined') fade = false;
	if (typeof time == 'undefined') time = 400;

	window.buttonsDisabled = false;
	useVideo.removeEventListener("ended", useVideoHandler);
	if ($('.button').eq(0).css('opacity') != 1 && !$('.button').eq(0).is(':animated') && fade) {
		if (videoList[videoIndex] == "01_BookOpen") {
			$('#next').animate({'opacity':1},time, function(){
				$(this).css('cursor','pointer');
			});
			$('#prev').animate({'opacity':0.25},time);
		} else {
			$('.button').animate({'opacity':1},time, function(){
				$(this).css('cursor','pointer');
			});
		}
	}
	
	var index = $.inArray(videoList[videoIndex],caseStudyVideos);
	if (index != -1) {
		overlaymp4.src = caseFolder + videoList[videoIndex] + '.mp4';
		overlayogg.src = caseFolder + videoList[videoIndex] + '.ogg';
		overlayVideo.load();
		$('#clickzone').css('display','block');
		$('#caseOverlays img').filter('[data-id="'+index+'"]').css('display','block').animate({'opacity':1},time);
	}
};

/**
 * disableButtons function.
 * Fades out video and hides and/or disables back and forward buttons
 * 
 * @access public
 * @optional param bool fade
 * @optional param bool hide
 * @optional param int time
 * @return void
 */
var disableButtons = function(fade,hide,time) {
	if (window.buttonsDisabled && !hide) return;

	window.buttonsDisabled = true;

	if (typeof hide == 'undefined') hide = false;
	if (typeof fade == 'undefined') fade = false;
	if (typeof time == 'undefined') time = 400;
	if ($('#next').css('opacity') == 1 && !$('.button').eq(0).is(':animated') || hide) {
		$('#caseOverlays img').animate({'opacity':0},time, function() {
			$(this).css('display','none');
			$('#clickzone').css('display','none');
		});
		if (hide || fade) $('.button').css('cursor','default');
		if (hide) {$('.button').stop(true,true).animate({'opacity':0},time); return;}
		if (fade) $('.button').stop(true,true).animate({'opacity':0.25},time);
	}
};

/**
 * reorderVideos function.
 * Reorders the videos based on current index.
 * 
 * @param int index
 * @return void
 */
function reorderVideos(direct) {
	if (videoList[videoIndex] == "01_BookOpen" && direct == -1 || videoList[videoIndex] == "EndVid" && direct == 1) return;
	
	disableButtons(true,false);

	if (videoLayer === 0) {
		videoLayer = 1;
	} else {
		videoLayer = 0;
	}
	
	useVideo = document.getElementById("layer"+videoLayer+"video");
	usemp4 = document.getElementById("mp4_src"+videoLayer);
	useogg = document.getElementById("ogg_src"+videoLayer);
	
	if (direct > 0) { 
		videoIndex++;	
	}
	
	if (videoIndex < 0) {
		videoIndex = 0;
	}
	if (videoList[videoIndex] == "EndVid") {
		window.ended = true;
		changeVolume(30, 1000);
		disableButtons(false,true);
	} else {
		disableButtons();
		backvideo.load();
	}
	
	if (videoIndex >= 0 && videoIndex < videoList.length) {
		back_mp4.src = backwardFolder + reverseVideoList[videoIndex] + ".mp4";
		back_ogg.src = backwardFolder + reverseVideoList[videoIndex] + ".ogg";
		if (direct > 0) {
			usemp4.src = forwardFolder + videoList[videoIndex] + ".mp4";
			useogg.src = forwardFolder + videoList[videoIndex] + ".ogg";
		} else {
			usemp4.src = backwardFolder + reverseVideoList[videoIndex] + ".mp4";
			useogg.src = backwardFolder + reverseVideoList[videoIndex] + ".ogg";
		}
		front_mp4.src = forwardFolder + videoList[videoIndex] + ".mp4";
		front_ogg.src = forwardFolder + videoList[videoIndex] + ".ogg";
	}
	
	frontvideo.load();
	useVideo.load();
	
	useVideo.addEventListener('loadeddata', playforward);
		
	if (direct < 0) { 
		videoIndex--;
	}
}

/**
 * playforward function.
 * for forward button click video loaded event listener. Fades in and plays video.
 * 
 * @param mixed event (passed by event listener)
 * @return void
 */
var playforward = function(event) {
	if (videoLayer === 0) {
		setTimeout(function() {
			$("#layer1video").fadeOut(500);
		}, 500);
	} else {
		setTimeout(function() {
			$("#layer1video").fadeIn(500);
		}, 500);
	}
	useVideo.play(); 
	useVideo.addEventListener("ended", useVideoHandler);
	useVideo.removeEventListener("loadeddata", playforward);
};


/**
 * forwardClick function.
 * called from next on click in main.js - reorders and loads next video
 * 
 * @param mixed event (passed by event listener)
 * @return void
 */
var forwardClick = function() {
	reorderVideos(1);	
};

/**
 * backwardClick function.
 * called from prev on click in main.js - reorders and loads previous video
 * 
 * @param mixed event (passed by event listener)
 * @return void
 */
var backwardClick = function() {
	reorderVideos(-1);	
};

/**
 * initVideo function.
 * called from on document load in main.js - loads vars and plays first video
 * 
 * @param mixed event (passed by event listener)
 * @return void
 */
var initVideo = function() {
	videosrc = document.getElementById("mp4_src");
	oggsrc = document.getElementById("ogg_src");
	useVideo = document.getElementById("layer1video");
	changeVolume(20, 100);
	
	//var duration = parseInt(basevideo.duration);
	//basevideo.addEventListener('loadeddata', playInit);
	//TweenMax.fromTo(basevideo, duration, {currentTime:0}, {currentTime:duration, ease:Linear.easeNone, onComplete:enablebuttons});
	setTimeout(function() {
		useVideo.play();
		useVideo.addEventListener("ended", useVideoHandler);
		$('#layer0video, #layer1video').attr('poster','');
	}, 700);
};

/**
 * showVideoOverlay function.
 * shows the popup video overlay
 * 
 * @return void
 */
var showVideoOverlay = function() {
	$('#video3').css('display','block').animate({'opacity':1},400);
	changeVolume(0, 1000);
	
	var index = $.inArray(videoList[videoIndex],caseStudyVideos)
	if (index == 0 || index == 2) {
		$({invert: 0}).animate({invert: 100}, {
        	duration: 300,
        	easing: 'linear',
        	step: function() {
            	$('#rl,#close,#logo_backer').css({
                	"-webkit-filter": "invert("+this.invert+"%)",
                	"filter": "blur("+this.invert+"%)"
            	});
            }
        });
    }
        
	$('#rl').animate({'opacity':0},200, function() {
		$('#rl').css('display','none');
		$('#close').delay(100).css('display','block').animate({'opacity':1},400);
		overlayVideo.play();
		overlayVideo.addEventListener('ended', overlayVideoHandler);
	});
};

/**
 * hideVideoOverlay function.
 * hides the popup video overlay
 * 
 * @return void
 */
var hideVideoOverlay = function() {
	$('#video3').animate({'opacity':0},300,function(){
		$(this).css('display','none');
	});
	
	var index = $.inArray(videoList[videoIndex],caseStudyVideos)
	var delay = index == 0 ? 200 : 0;
	if (index == 0 || index == 2) {
		$({invert: 100}).delay(delay).animate({invert: 0}, {
        	duration: 500,
        	easing: 'linear',
        	step: function() {
            	$('#rl,#close,#logo_backer').css({
                	"-webkit-filter": "invert("+this.invert+"%)",
                	"filter": "blur("+this.invert+"%)"
            	});
            }
        });
    }
    
	$('#close').animate({'opacity':0},300, function() {
		$('#close').css('display','none');
		$('#rl').delay(100).css('display','block').animate({'opacity':1},400);
	});
	overlayVideo.pause();
	changeVolume(20, 1000);
};
	
/**
 * overlayVideoHandler function.
 * called on video end, closes the overlay
 * 
 * @return void
 */
var overlayVideoHandler = function() {
	this.removeEventListener('ended', overlayVideoHandler);
	hideVideoOverlay();
};

/**
 * useVideoHandler function.
 * called on video end, referenced to remove it on end
 * 
 * @return void
 */
var useVideoHandler = function(){
	if (!window.ended) {
		if (videoList[videoIndex] == "01_BookOpen") enableButtons(true,false,1);
		else enableButtons(true);
	} else {
		$('#pdf').animate({'opacity':1},400);
	}
};

/**
 * changeVolume function.
 * changes the volume of the music
 * 
 * @param int newVolume
 * @param int time
 * @return void
 */
var changeVolume = function(newVolume, time) {
	if (typeof newVolume == 'undefined') return;
	if (newVolume > 1 && newVolume <= 100) newVolume = newVolume/100;
	if (typeof time == 'undefined') time = 1000;
	$('#bgmusic').animate({volume: newVolume}, time);
};