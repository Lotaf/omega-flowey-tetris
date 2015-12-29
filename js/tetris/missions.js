/* Survival - sections 1 through 3 */

function SurvivalSection(time_limit, speed_params, bgm) {

	this.cleared = false;
	this.speed_params = speed_params;
	this.time_limit = time_limit;
	this.bgm = bgm;

}

SurvivalSection.prototype.start = function() {
	tetrion.deactivateHealing();
};

SurvivalSection.prototype.advanceOneFrame = function() {

	this.time_limit -= 1 / 60;
	if (this.time_limit <= 0) {
		this.cleared = true;
	}

};

SurvivalSection.prototype.sendInput = function() {};




/* Survival - sections 4 through 6 */

function GarbageSurvivalSection(time_limit, speed_params, bgm, garbage_speed) {

	this.cleared = false;
	this.speed_params = speed_params;
	this.time_limit = time_limit;
	this.bgm = bgm;
	this.garbage_speed = garbage_speed;
	this.garbage_accum = 0;

}

GarbageSurvivalSection.prototype.start = function() {
	tetrion.deactivateHealing();
};

GarbageSurvivalSection.prototype.advanceOneFrame = function() {

	this.time_limit -= 1 / 60;

	if (this.time_limit <= 0) {
		this.cleared = true;
	}

};

GarbageSurvivalSection.prototype.sendInput = function(input) {

	if (input.type == "piece_locked") {
		this.garbage_accum += this.garbage_speed;
		console.log(this.garbage_accum);
		while (this.garbage_accum >= 100) {
			this.garbage_accum -= 100;
			tetrion.sendGarbage();
		}
	}

};


/* Survival - sections 1B through 6B */

function HealSection(time_limit, speed_params, bgm, piece) {

	this.cleared = false;
	this.speed_params = speed_params;
	this.time_limit = time_limit;
	this.bgm = bgm;
	this.piece = piece;

}

HealSection.prototype.start = function() {

	tetrion.blockGravity();
	tetrion.activateHealing(this.piece, "block");
	tetrion.queueNewHealPiece();

};

HealSection.prototype.advanceOneFrame = function() {

	this.time_limit -= 1 / 60;
	if (this.time_limit <= 0) {
		this.cleared = true;
	}

};

HealSection.prototype.sendInput = function() {};




/* Line Clear - sections 1A and 4A */

function LineClearSection(line_goal, speed_params, bgm) {

	this.pre_cleared = false;
	this.cleared = false;
	this.bgm = bgm;
	this.speed_params = speed_params;
	this.line_goal = line_goal;
	this.lines_cleared = 0;

	this.cleared_time = 0;

};


LineClearSection.prototype.start = function() {
	tetrion.deactivateHealing();
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




/* Tetris section - sections 2A and 6A */

function TetrisSection(tetris_goal, speed_params, bgm) {

	this.pre_cleared = false;
	this.cleared = false;
	this.bgm = bgm;
	this.speed_params = speed_params;
	this.tetris_goal = tetris_goal;
	this.tetrises_cleared = 0;

	this.cleared_time = 0;

};

TetrisSection.prototype.start = function() {
	tetrion.deactivateHealing();
};

TetrisSection.prototype.advanceOneFrame = function() {

	if (this.tetrises_cleared >= this.tetris_goal) {
		this.cleared_time += 1 / 60; console.log(this.cleared_time);

		if (this.cleared_time >= 3) {
			this.bgm.rate(Math.max(this.bgm._rate - 1 / 120, 0));
		}

		if (this.cleared_time >= 5) {
			this.cleared = true;
		}
	}

};

TetrisSection.prototype.sendInput = function(input) {

	if (input.type == "line_clear" && input.lines == 4) {
		this.tetrises_cleared += 1;
		if (this.tetrises_cleared >= this.tetris_goal && this.pre_cleared == false) {
			this.pre_cleared = true;
			se_section_clear.play();
		}
	}

};
