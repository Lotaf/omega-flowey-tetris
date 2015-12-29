ScoreKeeper = function(tetrion){

    this.tetrion = tetrion;
    this.reset();

    this.base_line_scores = [0, 40, 100, 300, 1200];

    this.max_grade_points = 100;
    this.max_grade = 31;

};

ScoreKeeper.prototype.reset = function(){

    this.level = 500;

    this.score = 0;
    this.lines_cleared = 0;

    this.drop_count = 0;
    this.combo = 0;

    this.grade = 0;
    this.grade_points = 0;

    this.grade_point_drain = 200;
    this.grade_point_drain_counter = 0;

    this.time_cs = 0;

};

ScoreKeeper.prototype.placePiece = function(){

    this.score += this.drop_count;
    this.drop_count = 0;

	mission.current_section.sendInput({
		type: "piece_locked"
	});

};

ScoreKeeper.prototype.spawnPiece = function(){

    if(this.level % 100 < 99){
        this.addLevel(1);
    }

};

ScoreKeeper.prototype.clearLines = function(lines){

    this.addLevel(lines);
    this.lines_cleared += lines;

    // score
    var points = this.base_line_scores[lines] * (1 + this.level / 10) * (1 + this.combo);
    this.score += Math.floor(points);

    // update grade points
    var grade_bonus = line_clear_points[this.grade][lines]
                    * combo_multipliers[this.combo][lines]
                    * (1 + Math.floor(this.level / 250));

    this.grade_points += Math.ceil(grade_bonus);
    if(this.grade_points >= this.max_grade_points){
        this.grade_points = 0;
        this.grade += 1;
        this.grade_point_drain = grade_point_decay_rate[this.grade];
    }

    // update combo
    if(lines >= 2) this.combo += 1;

	// update mission
	mission.sendInput({
		type: "line_clear",
		lines: lines
	})

};

ScoreKeeper.prototype.addLevel = function(dLevel){

    this.level += dLevel;
    this.tetrion.gravity = this.getGravity(this.level);

};

// Gravity from 1 to 20 * GRAVITY_DENOM

ScoreKeeper.prototype.getGravity = function(level){

    if (level < 30) return 4;
    if (level < 50) return 8;
    if (level < 60) return 12;
    if (level < 70) return 16;
    if (level < 80) return 32;
    if (level < 90) return 48;
    if (level < 100) return 64;
    if (level < 120) return 80;
    if (level < 140) return 96;
    if (level < 160) return 112;
    if (level < 180) return 128;
    if (level < 200) return 144;
    if (level < 220) return 4;
    if (level < 230) return 32;
    if (level < 235) return 64;
    if (level < 240) return 96;
    if (level < 245) return 128;
    if (level < 250) return 160;
    if (level < 280) return 192;
    if (level < 320) return 224;
    if (level < 360) return 256;
    if (level < 400) return 512;
    if (level < 440) return 768;
    if (level < 470) return 1024;
    if (level < 500) return 768;
    else return 5120;

};

ScoreKeeper.prototype.advanceOneFrame = function(){

    this.time_cs += 100 / 59.94;

    if(this.tetrion.current_piece){
        this.grade_point_drain_counter += 1;
        if(this.grade_point_drain_counter >= this.grade_point_drain){
            this.grade_point_drain_counter = 0;
            this.grade_points = Math.max(0, this.grade_points - 1);
        }
    }

};

ScoreKeeper.prototype.getTimeString = function(){

	var cs = Math.floor(this.time_cs);

    return "" +
        Math.floor(cs / 60000) +
        Math.floor(cs / 6000) % 10 +
        ":" +
        Math.floor(cs / 1000) % 6 +
        Math.floor(cs / 100) % 10 +
        "." +
        Math.floor(cs / 10) % 10 +
        cs % 10
    ;

}
