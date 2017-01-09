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
		}, 600);

		// after both the off-screen and on-screen animations complete, show the skip intro button
		setTimeout(function() {
			$("#intro-skip").removeClass("no-show");
		}, 1200);
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

		// find the parent race-slide div and slide it off screen, then pause that slide's video
		thisObj.closest(".race-slide").addClass("off-screen");
		thisObj.closest(".race-slide").find("video")[0].pause();


		// show the questions after the above's animation finishes
		setTimeout(function() {
			$("#race-questions").removeClass("off-screen");
		}, 600);

	}


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


	////////////////////////////////////////////////////////////////////////////
	////// FUNCTIONS THAT RUN ON READY /////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	setQuestionHeight();

	var touch = Modernizr.touchevents;
	var browser = bowser.name;



	////////////////////////////////////////////////////////////////////////////
	////// WINDOW RESIZES //////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////

	// we check to see if the width has changed on window resize events because
	// some versions of chrome on touch devices consider scrolling a resize event. bad chrome

	var w = $(window).width();

	// if we resize and the width is now different, rerun setQuestionHeight
	$(window).resize(function() {
		var newW = $(window).width();

		if (w !== newW) {
			setTimeout(function() {
				setQuestionHeight();
			}, 250);
		}

		w = newW;
	});

});
