//Random word
var word;

function AppViewModel(){
	//Create the first instance of the game
	this.hangman = ko.observable(new Hangman());
	// Set input value to '' and the focus 
	this.letter = ko.observable('');
	$('#letter').focus();

	this.NewWord = function(hangman){
		// Generates a random word and create a new Hangman
		var requestStr = "http://randomword.setgetgo.com/get.php";  // Random word generator API
		// Ajax request for the word, on success set the word
		$.ajax({
		    type: "GET",
		    url: requestStr,
		    dataType: "jsonp",
		    success: function(data){
				word = data.Word;
				hangman(new Hangman(word));
			}
		});
	};

	this.newGame = function(){
		// Create a new instance of the game
		this.NewWord(this.hangman);
		this.letter('');
		// Remove the 'disable' attributes of the buttons
		$('#guess').removeAttr('disabled');
		$('#hint').removeAttr('disabled');
		// Set the background to white
		$('#back').css('fill','white');
	};

	this.stillPlaying = function(){
		// Check if the game continues or is over
		if(this.hangman().isWordGuessed()){
			// If the word is guessed
			// Set the background to green and disable the buttons
			$('#back').css('fill','green');
			$('#guess').attr('disabled','disabled');
			$('#hint').attr('disabled','disabled');
		}

		if(!this.hangman().stillGuessesLeft()){
			// If there are no more guesses left then its over
			// Set the background to red and disable the buttons
			$('#back').css('fill','red');
			$('#guess').attr('disabled','disabled');
			$('#hint').attr('disabled','disabled');
		}
	};

	this.guess = function(){
		// Guess the letter 
		if(this.hangman().trials() > 0){
			this.hangman().guessLetter(this.letter());
			this.letter('');

			var s = this.stillPlaying();
			$('#letter').focus();
		}
	};

	this.hint = function(){
		// Get a hint of the word
		this.hangman().getHint();	
		this.stillPlaying();
		$('#letter').focus();
	};

	this.keyPressed = function(data, event){
		// If the pressed key is 'Enter' then guess the letter
		if(event.which == 13){
			this.guess();
		}
	};
};

// On enter key pressed call guess()
ko.bindingHandlers.enterKey = {
	init: function (element, valueAccessor, allBindings, data, context) {
    var wrapper = function (data, event) {
      if (event.keyCode === 13) {
        valueAccessor().call(this, data, event);
      }
    };
    ko.applyBindingsToNode(element, { event: { keyup: wrapper } }, context);
  }
};

// Generates a random word
var requestStr = "http://randomword.setgetgo.com/get.php";  // Random word generator API
// Ajax request for the word, on success set the word
$.ajax({
    type: "GET",
    url: requestStr,
    dataType: "jsonp",
    success: function(data){
		word = data.Word;
		ko.applyBindings(new AppViewModel());
	}
});
