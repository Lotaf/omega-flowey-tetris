// Omega Flowey Mission

function Mission(tetrion) {

	this.tetrion = tetrion;

	this.sectionList = [
		new SurvivalSection(	30.3,	[8, 4, 16, 8], bgm_flowey_section1),
		new LineClearSection(	  10,	[8, 4, 30, 8], bgm_flowey_section1a),

		new SurvivalSection(	27.8, 	[6, 4, 16, 8], bgm_flowey_section2),
		new LineClearSection(	  20, 	[8, 4, 30, 8], bgm_flowey_section2a),

		new SurvivalSection(	25.2, 	[6, 4, 16, 8], bgm_flowey_section3),
		new LineClearSection(	  25, 	[6, 4, 30, 8], bgm_flowey_section3a),

		new SurvivalSection(	30.3, 	[4, 4, 10, 7], bgm_flowey_section4),
		new LineClearSection(	  30, 	[4, 4, 24, 7], bgm_flowey_section4a),

		new SurvivalSection(	25.2, 	[4, 4, 10, 7], bgm_flowey_section5),
		new LineClearSection(	  40, 	[4, 4, 20, 6], bgm_flowey_section5a),

		new SurvivalSection(	27.8, 	[4, 2,  8, 6], bgm_flowey_section6),
		new LineClearSection(	  50, 	[4, 2, 15, 6], bgm_flowey_section6a),
	];

	this.currentSectionID = 0;
	this.current_section = null;

}

Mission.prototype.advanceOneFrame = function() {

	this.current_section.advanceOneFrame();
	if (this.current_section.cleared) {
		this.selectNextSection();
	}

}

Mission.prototype.sendInput = function(action) {

	this.current_section.sendInput(action);
	if (this.current_section.cleared) {
		this.selectNextSection();
	}

}

Mission.prototype.selectNextSection = function() {

	this.current_section.bgm.stop();
	this.currentSectionID += 1;
	this.current_section = this.sectionList[this.currentSectionID];
	tetrion.setDelayParams(this.current_section.speed_params);
	this.current_section.bgm.play();

}

var mission = new Mission();
