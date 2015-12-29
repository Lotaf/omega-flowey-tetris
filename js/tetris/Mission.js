// Omega Flowey Mission

function Mission(tetrion) {

	this.tetrion = tetrion;

	this.sectionList = [
		new SurvivalSection(	30.3,	[10, 10, 30, 8], bgm_flowey_section1),
		new LineClearSection(	  10,	[10, 10, 30, 8], bgm_flowey_section1a),
		new HealSection(     	   5,	[10, 10, 30, 8], bgm_flowey_saved, "I"),
		new SurvivalSection(	27.8, 	[10, 10, 24, 6], bgm_flowey_section2),
		new   TetrisSection(	   1, 	[10, 10, 24, 6], bgm_flowey_section2a),
		new HealSection(     	   5,	[10, 10, 30, 8], bgm_flowey_saved, "L"),
		new SurvivalSection(	25.2, 	[ 8,  8, 24, 6], bgm_flowey_section3),
		new LineClearSection(	  25, 	[ 8,  8, 24, 6], bgm_flowey_section3a),
		new HealSection(     	   5,	[10, 10, 30, 8], bgm_flowey_saved, "J"),
		new GarbageSurvivalSection(	30.3, 	[ 4,  4, 18, 6], bgm_flowey_section4, 6),
		new       LineClearSection(	  30, 	[ 4,  4, 24, 6], bgm_flowey_section4a),
		new HealSection(     	   5,	[10, 10, 30, 8], bgm_flowey_saved, "S"),
		new GarbageSurvivalSection(	25.2, 	[ 4,  4, 15, 4], bgm_flowey_section5, 12),
		new       LineClearSection(	  40, 	[ 4,  4, 24, 4], bgm_flowey_section5a),
		new HealSection(     	   5,	[10, 10, 30, 8], bgm_flowey_saved, "Z"),
		new GarbageSurvivalSection(	27.8, 	[ 4,  4, 12, 4], bgm_flowey_section6, 18),
		new          TetrisSection(	   2, 	[ 4,  4, 24, 4], bgm_flowey_section6a),
		new HealSection(     	   5,	[10, 10, 30, 8], bgm_flowey_saved, "T"),
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
	this.current_section.start();
	this.current_section.bgm.play();

}

var mission = new Mission();
