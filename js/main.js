window.buttonsDisabled = true;
window.ended = false;

$('#prev').on('click', function() {
	if (!window.buttonsDisabled) {
		backwardClick();
	}
});

$('#next').on('click', function() {
	if (!window.buttonsDisabled) {
		forwardClick();
	}
});

$('#close').on('click', function() {
	hideVideoOverlay();
});

$('#video3').on('click', function() {
	hideVideoOverlay();
});

$('#clickzone').on('click', function() {
	showVideoOverlay();
});

$(document).ready(function() {
	initVideo();
	resize(true);
});
$(window).on('resize', function(){
	resize();
});

//setTimeout(function(){showVideoOverlay();},2000);

function resize(init) {
	if (typeof init == 'undefined') init = false;
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	var videoWidth = $('#layer0video').width();
	var bookWidth = videoWidth * .5113356459918;
	var deadZoneLeft = videoWidth * .24267995016545;
	var deadZoneRight = videoWidth * .24167995016545;
	var videoHeight = windowWidth / (16/9);
	var deadZoneTop = videoHeight * .13;
	var deadZoneBottom = videoHeight * .13;
	var videoLeft = $('#layer0video').offset().left;
	var videoTop = ((windowHeight-videoHeight)/2);
	var bookHeight = videoHeight-deadZoneTop-deadZoneBottom;

	$('#clickzone').css({
		width: (videoWidth-deadZoneLeft-deadZoneRight)+"px",
		height: bookHeight+"px",
		left: videoLeft+deadZoneLeft+"px",
		top: videoTop+deadZoneTop+"px"
	});
	
	$('#video1,#video2,#video3,#placeholder').css({
		top: videoTop+"px"
	});
	
	$('#blackbar.bottom').css({
		top: windowHeight-videoTop + "px",
		height: videoTop+"px",
	});
	
	$('#blackbar.top').css({
		height: videoTop+"px"
	});
	
	$('#buttons>.button').css({
		top: (windowHeight/2-$('#buttons>.button').height()/2)+"px"
	});
	
	var pdfTop = $('#blackbar.bottom').offset().top > windowHeight ? windowHeight : $('#blackbar.bottom').offset().top;
	$('#pdf').css({
		top: (pdfTop - $('#pdf').height() - 50) + "px"
	});
	
	$('#logo').css({
		top: ($('#blackbar.top').height() + $('#logo').height() + 53) + "px"
	});
	
	if (!init && !$('#logo').is(':animated')) {
		if (windowWidth < 750 || windowHeight < 350) {
			$('#logo').animate({'opacity':0},200)
		} else {	
			$('#logo,#pdf').animate({'opacity':1},200)
		}
	}
};