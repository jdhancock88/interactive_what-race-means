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



	var people = ["hart", "hartman", "hood", "romero", "aguirre", "simmons", "awaida", "maharaj", "macken", "phillips", "harse", "shinoda", "mcelrath", "holbert"];
	var containers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];


	$(people).each(function(k, v) {
		$("<img/>")[0].src = "images/_" + v + ".jpg";

		if (k === (people.length - 1)) {
			displayImages();
		}
	});

	function displayImages() {

		for (i=0; i<containers.length; i++) {

				setTimeout(function(x) {
					return function() {

						var x = Math.floor(Math.random() * people.length);
						var person = people[x];

						people.splice(x, 1);

						var y = Math.floor(Math.random() * containers.length);
						var container = "#race-image" + containers[y];

						containers.splice(y, 1);

						$(container).css("background-image", "url('/images/_" + person + ".jpg')").addClass("visible");

					};
				}(i), 500*i);
			}
	}


});
