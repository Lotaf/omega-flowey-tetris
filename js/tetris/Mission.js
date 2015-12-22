// Omega Flowey Mission

function Mission(tetrion) {

	this.tetrion = tetrion;

	this.sectionList = [
		new SurvivalSection(18),

	];

	this.current_section = null;

}

Mission.prototype.advanceOneFrame = function() {

}

Mission.prototype.sendInput = function(action) {
	this.current_section.sendInput(action);
	if (this.current_section.cleared) {
		// do the next thing
	}
}
