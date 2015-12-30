var intro_scene = {
	garbled_text_length: 0
};

function Scene() {

	this.scene_state = "";
	this.scene_frames = 0;

	/*
		Possible scene states:
		"intro"
		"flowey"
		"flowey2"
		"tetris"
	*/

};

Scene.prototype.selectScene = function(name) {

	this.scene_state = name;
	this.scene_frames = 0;

	switch(name) {
		case "intro":
			bgm_intro.play();
			break;
		case "flowey":
			document.getElementById("textbox").style.letterSpacing = "1px";
			flowey.init();
			break;
		case "gameover":
			document.getElementById("textbox").style.letterSpacing = "2px";
			bgm_gameover.play();
			break;
		default:
			break;
	}

}

Scene.prototype.advanceOneFrame = function() {

	this.scene_frames += 1;

	if (this.scene_state == "flowey") {
		flowey.advanceOneFrame();
	} else if (this.scene_state == "tetris") {
		tetrion.advanceOneFrame();
	}

};

Scene.prototype.handleInput = function(input) {

	if (this.scene_state == "intro" && this.scene_frames >= 600) {
		if (input.dir == "down" && input.input == "A"){
			document.getElementById("controlbox").style.display = "none";
			this.selectScene("flowey");
		}
	} else if (this.scene_state == "flowey") {
		if (input.dir == "down" && input.input == "A"){
			flowey.advanceTextA();
		} else if (input.dir == "down" && input.input == "B"){
			flowey.advanceTextB();
		}
	} else if (this.scene_state == "tetris") {
		if (input.dir == "down")
			tetrion.activateInput(input.input);
		else if (input.dir == "up")
			tetrion.releaseInput(input.input);
	}

};

var scene = new Scene();
