/* Survival - sections 1 through 6 */

function SurvivalSection(time_limit, speed_params, bgm) {

	this.pre_cleared = false;
	this.cleared = false;
	this.speed_params = speed_params;
	this.time_limit = time_limit;
	this.bgm = bgm;

}

SurvivalSection.prototype.advanceOneFrame = function() {

	this.time_limit -= 1 / 60;
	if (this.time_limit <= 0) {
		this.cleared = true;
	}

};

SurvivalSection.prototype.sendInput = function() {};



/* Line Clear - sections 1A and 4A */

function LineClearSection(line_goal, speed_params, bgm) {

	this.cleared = false;
	this.bgm = bgm;
	this.speed_params = speed_params;
	this.line_goal = line_goal;
	this.lines_cleared = 0;

	this.cleared_time = 0;

};

LineClearSection.prototype.advanceOneFrame = function() {

	if (this.lines_cleared >= this.line_goal) {
		this.cleared_time += 1 / 60; console.log(this.cleared_time);

		if (this.cleared_time >= 3) {
			this.bgm.rate(Math.max(this.bgm._rate - 1 / 120, 0));
		}

		if (this.cleared_time >= 5) {
			this.cleared = true;
		}
	}

};

LineClearSection.prototype.sendInput = function(input) {

	if (input.type == "line_clear") {
		this.lines_cleared += input.lines;
		if (this.lines_cleared >= this.line_goal && this.pre_cleared == false) {
			this.pre_cleared = true;
			se_section_clear.play();
		}
	}

};
