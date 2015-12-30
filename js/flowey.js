function Flower(){

	this.queued_text = [];
	this.currentLine = 0;
	this.currentLineChars = 0;
	this.printedChars = 0;
	this.displayText = "";

}

Flower.prototype.init = function() {

	bgm_flowey_intro1.play();

}

Flower.prototype.advanceOneFrame = function() {

	if (this.queued_text[this.currentLine].substr(this.printedChars, 2) == "%1"){
		this.currentLineChars += 0.05;
	} else if (this.queued_text[this.currentLine].substr(this.printedChars, 2) == "%2"){
		this.currentLineChars += 0.02;
	} else {
		this.currentLineChars += 0.4;
	}

	var sound = false;

	while (this.currentLineChars > 1){
		if (this.printedChars >= this.queued_text[this.currentLine].length) {
			break;
		}
		this.currentLineChars -= 1;

		if (this.queued_text[this.currentLine][this.printedChars] == "%"){
			this.printedChars += 2;
		} else {
			this.displayText += this.queued_text[this.currentLine][this.printedChars];
			this.printedChars += 1;
			if (this.queued_text[this.currentLine][this.printedChars] != " ") {
				sound = true;
			}
		}
	}

	if (sound) se_flowey.play();

}

Flower.prototype.advanceTextA = function() {

	if (this.printedChars >= this.queued_text[this.currentLine].length) {
		this.currentLine += 1;
		this.currentLineChars = 0;
		this.printedChars = 0;
		this.displayText = "";
		if (this.currentLine >= this.queued_text.length) {
			// go to next scene
			document.getElementById("textbox").innerHTML = "";
			bgm_flowey_intro1.stop();
			scene.scene_state = "tetris";
			tetrion.resetBoard();
		}
	}

}

Flower.prototype.advanceTextB = function() {

	if (this.printedChars < this.queued_text[this.currentLine].length) {
		this.printedChars = this.queued_text[this.currentLine].length;
		this.displayText = this.queued_text[this.currentLine].replace(/%./g, "");
		se_flowey.play();
	}

}

var flowey = new Flower();

flowey.queued_text = [
	// 4567890123456789012 <- 22 character limit
	"Howdy!%1\nIt's me, FLOWEY!%1\nFLOWEY the FLOWER!",
	"Boy, you're really\nsomething, aren't you?",
	"You couldn't get enough\nof that old fool Sans,\nso you came back for more.",
	"Well I for one hate to\ndisappoint my admirers.",
	"But I've got a different\ngame in store for you.",
	"No more dodging those\nstupid bullets.",
	"I'm going to give you a\ngame that requires\nactual SKILL.",
	"How do you feel about%1.%1.%1.%2 Tetris?"
]
