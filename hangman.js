// This is the Hangman Object

var Hangman = function(mword){
	// Select the initial word or a new word
	this.secretWord = mword || word;
	// Convert the secretWord to lowerCase
	this.secretWord = this.secretWord.slice(0,-2).toLowerCase();
	// # of trials for the word to be guessed
	this.trials = ko.observable(this.secretWord.length + 3);
	// Create underline string for every letter in  word
	this.guessedWord = ko.observable('_ '.repeat(this.secretWord.length));
	// Create observable array for the guessed letters
	this.lettersGuessed = ko.observableArray();
	this.showLettersGuessed = ko.pureComputed(function(){ 
		return this.lettersGuessed().join(' ');
	},this);
	// Initial message
	this.message = ko.observable("Please insert a letter to guess");
	// Array of messages
	this.msgs = ["Thats not a valid input. Please try again", "You already guessed that one", 
				"You guessed correct", "Oh! Sorry, that one wasnt in the word","You have won!!!","Sorry, you ran out of guesses"];

	this.isWordGuessed = function(){
		// Returns true if the word has been guessed, false otherwise
		// Checks if the word has been guessed
		if(this.guessedWord().replace(/ /g,'') == this.secretWord){
			this.message(this.msgs[4]);
			return true;
		}
		return false;
	};

	this.newGuessedWord = function(){
		//Refresh the underlines, if there are valid guessed words put them in
		newWord = [];
		for(var i = 0; i < this.secretWord.length; i++){
			if(this.lettersGuessed().indexOf(this.secretWord[i]) >=0){
				newWord.push(this.secretWord[i]+' ');
			}else{
				newWord.push('_ ');
			}
		}
		this.guessedWord(newWord.join(''));
	};

	this.guessLetter = function(let){
		//Returns a message indicating if the letter was valid or not 
		var letter = let.toLowerCase();

		if(letter.length != 1 || !(/[a-z]/.test(letter))){
			// If the letter's length is different of 1 or is not in the alphabet set the message[0]
			this.message(this.msgs[0]);
		}else if(this.lettersGuessed.indexOf(letter) >= 0){
			// If the letter is in the list of guessed letters set the message[1]
			this.message(this.msgs[1]);
		}else{
			// Insert the letter in the array
			this.lettersGuessed.push(letter);
			// Decrease the number of trials
			this.trials(this.trials()-1);
			// If the letter is in secretWord reveal the underlines and show message[3], 
			// otherwise show message[3]
			if(this.secretWord.indexOf(letter) >= 0){
				this.newGuessedWord();
				this.message(this.msgs[2]);
			}else{
				this.message(this.msgs[3]);
			}
		}
	};

	this.getHint = function(){
		// Return a letter of the word
		var guesses = this.guessedWord().replace(/ /g,'');
		for(var i in guesses){
			if(guesses[i] === '_'){
				this.guessLetter(this.secretWord[i]);
				this.trials(this.trials()-1);
				break;
			}
		}
	};

	this.stillGuessesLeft = function(){
		// Returns true if there are any guesses left, false otherwise
		if(this.trials() <= 0){
			this.message(this.msgs[5]+". The secret word was "+this.secretWord);
			return false;
		}
		return true;
	};
};