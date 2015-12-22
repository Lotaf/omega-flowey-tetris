function SurvivalSection(time_limit, speed_params) {
	this.cleared = false;
	this.time_limit = time_limit;
}

SurvivalSection.prototype.advanceOneFrame = function() {
	this.time_limit -= 1 / 60;
	if (this.time_limit <= 0) {
		this.cleared = true;
	}
};

SurvivalSection.prototype.sendInput = function() {};



function LineClearSection(time_limit, speed_params) {

};
