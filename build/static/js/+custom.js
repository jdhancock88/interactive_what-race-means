$(document).ready(function() {

	//custom scripting goes here

	// injecting current year into footer
	// DO NOT DELETE

	var d = new Date();
	var year = d.getFullYear();

	$('.copyright').text(year);


	// some code blocks require javascript to function, like slideshows, synopsis blocks, etc
	// you can find that code here: https://github.com/DallasMorningNews/generator-dmninteractives/wiki/Cookbook

	// closes any header dropdown menus and resets the up/down chevron
	function closeList() {
		$(".open-list").removeClass("open-list");
		$(".open-button").removeClass("open-button");
	}

	var $hedButton = $(".header-group button");

	// clicking any of the header dropdown menu buttons (i.e. "topics", or "my account")
	$hedButton.click(function(e) {

		// if the button that is clicked is already open, close the menu, else, close the
		// menu then open the selected menu
		if ($hedButton.hasClass("open-button") === true && $(this).hasClass("open-button") === true) {
			closeList();
		} else {
			closeList();
			$(this).addClass("open-button");
			$(this).siblings("ul").addClass("open-list");
		}
		e.stopPropagation();
	});

	// clicking anywhere in the body should close any open menus
	$("body").click(function() {
		closeList();
	});

	// if the user is signed in, add the subscribed class to the body, which will reveal
	// the proper my account menu items.
	if (document.cookie.indexOf("DMN-P") >= 0) {
		$("body").addClass("subscribed");
	} else {
		$("body").removeClass("subscribed");
	}



	// the array of our participants used to set background images and image preloading
	var people = ["hart", "hartman", "hood", "romero", "aguirre", "simmons", "awaida", "maharaj", "macken", "phillips", "harse", "shinoda", "mcelrath", "holbert"];


	// preloading our images from the people array
	$(people).each(function(k, v) {

		$("<img/>")[0].src = "images/_" + v + ".jpg";

		if (k === (people.length - 1)) {
			displayImages();
		}

	});



	var interval = 600;

	////////////////////////////////////////////////////////////////////////////
	////// INITIAL DISPLAY ANIMATION ///////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////


	// displays the images and the intro text on initial load.
	function displayImages() {

		// our numbers for our different portrait containers
		var containers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

		// for each container, randomly select a container and one of our portraits and set that
		// container's background image to that person's corresponding portrait.
		for (i=0; i<containers.length; i++) {

			displayTimeout = setTimeout(function(x) {
				return function() {

					// randomly select a person
					var x = Math.floor(Math.random() * people.length);
					var person = people[x];

					// remove that person from the array so we don't select them again
					people.splice(x, 1);

					// randomly select a container
					var y = Math.floor(Math.random() * containers.length);
					var container = "#race-image" + containers[y];

					// remove that container from the array so we don't select it again
					containers.splice(y, 1);

					// set the container's background image
					$(container).css("background-image", "url('images/_" + person + ".jpg')").addClass("visible");

				};
			}(i), 500*i);
		}

		// clicking the intro button will clear the container array (stopping the animation) and enter the project
		$("#intro-text button").click(function() {
			containers = [];
			enterProject();
		});
	}


	// display the intro text 1.5 seconds after the image displaying begins.
	setTimeout(function() {
		$("#intro-text").addClass("visible-text");
	}, 1500);


	////////////////////////////////////////////////////////////////////////////
	////// ENTERING THE PROJECT ////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////


	// clicking the begin button from the title screen runs this function. hides the portraits
	// then the title card, then displays the project explainer
	function enterProject() {

		// hides the title card
		setTimeout(function() {
			$("#intro-text").removeClass("visible-text");
		}, 500);

		var containers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
		var l = containers.length;


		// randomly select a container and turn it's opacity to 0;
		for (i=0; i<containers.length; i++) {

			setTimeout(function(x) {
				return function() {


					var y = Math.floor(Math.random() * containers.length);
					var container = "#race-image" + containers[y];

					$(container).removeClass("visible");

					containers.splice(y, 1);

				};
			}(i), 100*i);
		}

		// display the explainer text
		setTimeout(function() {
			$("#race-explainer").removeClass("off-screen");
			$("#race-intro").addClass("no-show");
		}, (l * 100));

	}


	////////////////////////////////////////////////////////////////////////////
	////// VIEWING THE INTRO VIDEO /////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// when the button on the intro blurb is clicked, the blurb gets hidden and the
	// intro video is loaded and starts playing

	var introVideo = $("#race-intro-video video");

	$("#race-explainer button").click(function() {

		// find the parent race-slide class and move it offscreen
		$(this).closest(".race-slide").addClass("off-screen");

		// wait for the animation to finish, then animate the race intro video onto the screen
		// load it and play it
		setTimeout(function() {
			$("#race-intro-video").removeClass("off-screen");
			introVideo[0].load();
			introVideo[0].play();

			$("#intro-video")[0].removeEventListener("timeupdate", updateProgress);
			$("#race-intro-video").find(".progress").css("width", "0");
			$("#intro-video")[0].addEventListener("timeupdate", function() {
				updateProgress("#intro-video");
			}, false);
		}, interval);

		// after both the off-screen and on-screen animations complete, show the skip intro button
		setTimeout(function() {
			$("#intro-skip").removeClass("no-show");
		}, (interval * 2));
	});


	// skipping the intro
	$("#intro-skip").click(function() {
		$(this).addClass("no-show");
		showQuestions($(this));
	});

	// listening for the intro video to end. when it does, hide it then display the questions
	introVideo[0].addEventListener("ended", function() {
		$(this).closest(".race-slide").find("#intro-skip").addClass("no-show");
		showQuestions($(this));
	});


	////////////////////////////////////////////////////////////////////////////
	////// VIEWING THE QUESIONS ////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// the show questions function is passed the object that was used to call the function

	function showQuestions(thisObj) {

		// show the footer
		$("#race-footer").removeClass("no-show");

		// find the parent race-slide div and slide it off screen, then pause that slide's video
		thisObj.closest(".race-slide").addClass("off-screen");
		thisObj.closest(".race-slide").find("video")[0].pause();


		// show the questions after the above's animation finishes
		setTimeout(function() {
			$("#race-questions").removeClass("off-screen");
		}, interval);

	}

	////////////////////////////////////////////////////////////////////////////
	////// SELECTING A QUESION /////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	var qVideo = $("#q-video");

	function loadQuestion(video) {

		var w = $(window).width();
		var small;

		if (w < 700) {
			small = true;
		}

		// hide the questions slide
		$("#race-questions").addClass("off-screen");

		// fill out the src attribute with the proper video path depending on screen width
		if (small) {
			$("#q-mp4-tag").attr("src", "assets/" + video + "-small.mp4");
			$("#q-ogg-tag").attr("src", "assets/" + video + "-small.ogg");
		} else {
			$("#q-mp4-tag").attr("src", "assets/" + video + ".mp4");
			$("#q-ogg-tag").attr("src", "assets/" + video + ".ogg");
		}

		// animate in the slide that holds the individual video questions
		setTimeout(function() {
			$("#question-video").removeClass("off-screen");
		}, interval);

		// show the button that allows the user to get back to the questions
		setTimeout(function() {
			$("#view-questions").removeClass("no-show");
		}, (interval * 2));

		// load and play the selected video
		qVideo[0].load();
		qVideo[0].play();

		// remove any current eventListener and then add the event listener to update
		// the progress bar
		$("#q-video")[0].removeEventListener("timeupdate", updateProgress);
		$("#questin-video").find(".progress").css("width", "0");
		$("#q-video")[0].addEventListener("timeupdate", function() {
			updateProgress("#q-video");
		}, false);


	}

	// clicking a question card grabs the name of the video and passes it off to the loadQuestion
	// function above. also, displays the watched icon on the question card
	$(".question-card").click(function() {
		var video = $(this).attr("data-video");
		loadQuestion(video);
		var self = $(this);
		setTimeout(function() {
			self.addClass("viewed");
		}, interval);
	});

	// ending a video and going back to the questions
	$("#view-questions").click(function() {
		$(this).addClass("no-show");
		showQuestions($(this));
	});

	// listening for the questions video to end. when it does, hide it then display the questions
	qVideo[0].addEventListener("ended", function() {
		$(this).closest(".race-slide").find("#intro-skip").addClass("no-show");
		showQuestions($(this));
	});


	////////////////////////////////////////////////////////////////////////////
	////// SETTING THE HEIGHT OF QUESTIONS /////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// we're going to make all the question cards a uniform height by finding the tallest
	// question, then setting all question cards to that height
	function setQuestionHeight() {

		var qHeight = 0;
		$.each($(".question-card"), function() {
			var thisHeight = $(this).outerHeight();

			if (thisHeight > qHeight) {
				qHeight = thisHeight;
			}
		});

		$(".question-card").css("height", qHeight + "px");

	}





	function updateProgress(target) {
		var progress, video;
		if (target === "#intro-video") {
			progress = $("#race-intro-video .progress");
			video = introVideo;
		} else {
			progress = $("#question-video .progress");
			video = qVideo;
		}
		var value = 0;
		if (video[0].currentTime > 0) {
			value = Math.floor(( 100 / video[0].duration) * video[0].currentTime);
		}
		progress.css("width", value + "%");
	}


	////////////////////////////////////////////////////////////////////////////
	////// FUNCTIONS THAT RUN ON READY /////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	setQuestionHeight();

	var touch = Modernizr.touchevents;
	var browser = bowser.name;

	$("#view-intro").on("click", function() {
		qVideo[0].pause();
		introVideo[0].pause();

		$(".race-slide").addClass("off-screen");
		$(".btn-minimal").addClass("no-show");

		setTimeout(function() {
			$("#race-explainer").removeClass("off-screen");
		}, interval);
	});

	var currentSlide;

	$("#race-comment").on("click", function() {
		introVideo[0].pause();
		qVideo[0].pause();

		$.each($(".race-slide"), function() {
			if ($(this).hasClass("off-screen") === false) {
				currentSlide = $(this).attr("id");
			}
		});

		$(".race-slide").addClass("off-screen");

		setTimeout(function() {
			$("#share-comments").removeClass("off-screen");
		}, interval);
	});

	$("#view-about").on("click", function() {
		introVideo[0].pause();
		qVideo[0].pause();

		$.each($(".race-slide"), function() {
			if ($(this).hasClass("off-screen") === false) {
				currentSlide = $(this).attr("id");
			}
		});

		$(".race-slide").addClass("off-screen");

		setTimeout(function() {
			$("#about").removeClass("off-screen");
		}, interval);
	});

	$(".fa-times-circle").click(function() {
		var parent = $(this).closest(".race-slide").attr("id");
		closeSlide(parent);
	});

	function closeSlide(parent) {
		$("#" + parent).addClass("off-screen");

		setTimeout(function() {
			$("#" + currentSlide).removeClass("off-screen");
		}, interval);
	}


	$.each($(".race-slide-content"), function() {

		if ($(this).outerHeight() > ($(window).height() - 51)) {
			$(this).closest(".race-slide").addClass("race-overflow");
		} else {
			$(this).closest(".race-slide").removeClass("race-overflow");
		}

		var w = $(window).width();
		var h = $(window).height() - 82;

		if (h / w < 0.5625) {
			$(".race-video").addClass("race-overflow");
		} else {
			$(".race-video").removeClass("race-overflow");
		}
	});


	$(".fa-play").click(function() {
		$(this).parent(".controls").siblings("video")[0].play();
	});

	$(".fa-pause").click(function() {
		$(this).parent(".controls").siblings("video")[0].pause();
	});

	$(".fa-step-backward").click(function() {
		$(this).parent(".controls").siblings("video")[0].load();
	});


	////////////////////////////////////////////////////////////////////////////
	////// WINDOW RESIZES //////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// we check to see if the width has changed on window resize events because
	// some versions of chrome on touch devices consider scrolling a resize event. bad chrome

	var w = $(window).width();
	var h = $(window).height();

	// if we resize and the width is now different, rerun setQuestionHeight
	// along with checking the height of the race-divs again to see if they need overflow
	$(window).resize(function() {
		var newW = $(window).width();
		var newH = $(window).height();

		if (w !== newW || h !== newH) {
			setTimeout(function() {
				setQuestionHeight();

				$.each($(".race-slide-content"), function() {
					if ($(this).height() > $(window).height()) {
						$(this).closest(".race-slide").addClass("race-overflow");
					} else {
						$(this).closest(".race-slide").removeClass("race-overflow");
					}
					if ((newH -82)  / newW < 0.5625) {
						$(".race-video").addClass("race-overflow");
					} else {
						$(".race-video").removeClass("race-overflow");
					}

				});

			}, 250);
		}

		w = newW;
		h = newH;
	});

});
