var intro_scene = {
	garbled_text_length: 0
};

function Scene() {

	this.scene_state = "intro";
	this.scene_frames = 0;

	/*
		Possible scene states:
		"intro"
		"flowey"
		"flowey2"
		"tetris"
	*/

};

Scene.prototype.advanceOneFrame = function() {

	this.scene_frames += 1;

	if (this.scene_state == "tetris") {
		tetrion.advanceOneFrame();
	}

};

Scene.prototype.handleInput = function(input) {

	if (this.scene_state == "intro" && this.scene_frames >= 600) {
		if (input.dir == "down" && input.input == "A"){
			document.getElementById("controlbox").style.display = "none";
			this.scene_state = "tetris";
		}
	} if (this.scene_state == "tetris") {
		if (input.dir == "down")
			tetrion.activateInput(input.input);
		else if (input.dir == "up")
			tetrion.releaseInput(input.input);
	}

};

var scene = new Scene();
