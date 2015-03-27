var Hangman = function(){
	this.secretWord = 'hola';
	this.trials = ko.observable(8);
	this.guessedWord = ko.observable('_ '.repeat(this.secretWord.length));

	this.lettersGuessed = [];
	this.showLettersGuessed = ko.computed(function(){ 
		return this.lettersGuessed.join(' ');
	},this);

	this.message = ko.observable("Please insert a letter to guess");
	this.msgs = ["Thats not a valid input. Please try again", "You already guessed that one", 
				"You guessed correct", "Oh! Sorry, that one wasnt in the word","You have won!!!","Sorry, you ran out of guesses"];

	this.isWordGuessed = function(){
		// Returns true if the word has been guessed, false otherwise
		// Checks if the word has been guessed
		c = 0;
		for(var i in this.lettersGuessed){
			for(var e in this.secretWord){
				if(this.lettersGuessed[i] === this.secretWord[e]){
					c += 1;
				}
			}
		}
		if(c == this.secretWord.length){
			this.message(this.msgs[4]);
			return true;
		}
		return false;
	};

	this.newGuessedWord = function(){
		//Refresh the underlines, if there are valid guessed words put them in
		newWord = [];
		for(var i = 0; i < this.secretWord.length; i++){
			if(this.lettersGuessed.indexOf(this.secretWord[i]) >=0){
				newWord.push(this.secretWord[i]+' ');
			}else{
				newWord.push('_ ');
			}
		}
		this.guessedWord(newWord.join(''));
	};

	this.guessLetter = function(let){
		//Returns a message indicating if the letter was valid or not 
		var letter = let().toLowerCase();

		if(letter.length != 1 || !(/[a-z]/.test(letter))){
			this.message(this.msgs[0]);
		}else if(this.lettersGuessed.indexOf(letter) >= 0){
			this.message(this.msgs[1]);
		}else{
			this.lettersGuessed.push(letter);
			this.trials(this.trials()-1);
			if(this.secretWord.indexOf(letter) >= 0){
				this.newGuessedWord();
				this.message(this.msgs[2]);
			}else{
				this.message(this.msgs[3]);
			}
		}
	};

	this.getHint = function(){
		for(var i in this.guessedWord()){
			if(this.guessedWord()[i].includes('_')){
				console.log(this.guessedWord()[i]);
				this.lettersGuessed.push(this.secretWord[i]);
				this.trials(this.trials()-1);
				this.newGuessedWord();
				break;
			}
		}
	};

	this.stillGuessesLeft = function(){
		// Show if there are any guesses left 
		if(this.trials() <= 0){
			this.message(this.msgs[5]);
			return false;
		}
		return true;
	};
};

function AppViewModel(){
	//Create the first instance of the game
	this.hangman = ko.observable(new Hangman());
	this.letter = ko.observable('');
	$('#letter').focus();


	this.newGame = function(){
		// Create a new instance of the game
		this.hangman(new Hangman());
		this.letter('');	
		$('#guess').removeAttr('disabled');
		$('#hint').removeAttr('disabled');
	};

	this.stillPlaying = function(){
		if(this.hangman().isWordGuessed()){
			// What happens when the word is guessed
			$('#back').css('fill','green');
			$('#guess').attr('disabled','disabled');
			$('#hint').attr('disabled','disabled');
		}

		if(!this.hangman().stillGuessesLeft()){
			// What happens when there are no more guesses left
			// Disable guess button
			$('#back').css('fill','red');
			$('#guess').attr('disabled','disabled');
			$('#hint').attr('disabled','disabled');
		}
	};

	this.guess = function(){
		// Guess the letter 
		this.hangman().guessLetter(this.letter);
		this.letter('');

		this.stillPlaying();
		$('#letter').focus();
	};

	this.hint = function(){
		this.hangman().getHint();	
		this.stillPlaying();
		$('#letter').focus();
	};

	this.keyPressed = function(data, event){
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
ko.applyBindings(new AppViewModel());