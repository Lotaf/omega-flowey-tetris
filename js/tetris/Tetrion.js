function Tetrion(){

	this.score_keeper = new ScoreKeeper(this);

	this.input_flags = {
	    left: false,
	    right: false,
	    up: false,
	    down: false,
	    rotate_left: false,
	    rotate_right: false,
	    rotate_left2: false,
	    rotate_right2: false,
	    rotate_180: false,
	    hold: false,
	};

	this.new_input_flags = {
		left: false,
		right: false,
		up: false,
		down: false,
		rotate_left: false,
		rotate_right: false,
		rotate_left2: false,
		rotate_right2: false,
		rotate_180: false,
		hold: false,
	};

	this.gameover = false;
	this.move_reset = true;

	this.fps = 60; 	// actual FPS value;
					// all values in internal code are normalized to 60 FPS

	// 10 by 24 block grid
	this._stategrid = Array(10); // x coord
	for(var a = 0; a < 10; ++a){
		this._stategrid[a] = Array(24); // y coord
		for(var b = 0; b < 24; ++b){
			this._stategrid[a][b] = " ";
		}
	}
	this.hold_piece = null;
	this.held_piece = false;

};

Tetrion.prototype.advanceOneFrame = function(){

	if (this.gameover) {
		this.animateGameOver();
		return;
	}

	//////////////////////////////
	// step 1. check for inputs //
	//////////////////////////////

	var rotation = "none";
	var movement_v = "none";
	var movement_h = "none";

	// 1.1 left

	if(this.new_input_flags.left && !this.input_flags.left){
		movement_h = "left";
		if(this.das.direction == "right") this.das.charge = 1;
		this.das.direction = "left";
	}else if(this.new_input_flags.left && this.input_flags.left){
		if(this.das.direction == "left" && this.das.charge == this.max_das){
			movement_h = "left";
		}else if(this.das.direction == "left"){
			this.das.charge += 1;
		}
	}else if(!this.new_input_flags.left && this.input_flags.left){
		this.das.charge = 0;
	}

	// 1.2 right

	if(this.new_input_flags.right && !this.input_flags.right){
		movement_h = "right";
		if(this.das.direction == "left") this.das.charge = 1;
		this.das.direction = "right";
	}else if(this.new_input_flags.right && this.input_flags.right){
		if(this.das.direction == "right" && this.das.charge == this.max_das){
			movement_h = "right";
		}else if(this.das.direction == "right"){
			this.das.charge += 1;
		}
	}else if(!this.new_input_flags.right && this.input_flags.right){
		this.das.charge = 0;
	}

	// 1.3 down always activates

	if(this.new_input_flags.down){
		movement_v = "down";
	}

	// 1.4 but up activates with higher priority

	if(this.new_input_flags.up){
		movement_v = "up";
	}

	// also check for hold
	if(this.new_input_flags.hold){
		this.holdPiece();
	}

	// 1.11 rotations

	if ((this.new_input_flags.rotate_left && !this.input_flags.rotate_left) ||
		(this.new_input_flags.rotate_left2 && !this.input_flags.rotate_left2)){
		rotation = "left";
	}

	if ((this.new_input_flags.rotate_right && !this.input_flags.rotate_right) ||
		(this.new_input_flags.rotate_right2 && !this.input_flags.rotate_right2)){
		rotation = "right";
	}

	if (this.new_input_flags.rotate_180 && !this.input_flags.rotate_180){
		rotation = "180";
	}


	// reset inputs
	for(flag in this.input_flags){
		this.input_flags[flag] = this.new_input_flags[flag];
	}


	// TESTING: random input override
	// rotation = (["left", "right", "180", "none"])[Math.floor(Math.random() * 4)];
	// movement_h = (["left", "right", "none"])[Math.floor(Math.random() * 3)];


    ////////////////////////////////////////////
	// step 2. advance piece of current frame //
	////////////////////////////////////////////

	if (this.current_piece){
		this.current_piece.advanceOneFrame(this.gravity, rotation, movement_h, movement_v);
	} else {
		this.entry_delay -= 1;
		if(this.entry_delay <= 0){
			this.queueNewPiece();
		}
	}

	////////////////////////
	// step 3. keep score //
	////////////////////////

	this.score_keeper.advanceOneFrame();

	mission.advanceOneFrame();

};

Tetrion.prototype.checkForLines = function(){

	var lines_cleared = 0;

	for(var b = 0; b < 20; ++b){
		var line_complete = true;
		for(var a = 0; a < 10; ++a){
			if(this.getBlockAt(a, b) == " ") line_complete = false;
		}
		if(line_complete){
			++lines_cleared;
			for(var c = b; c > -3; --c){
				for(var a = 0; a < 10; ++a){
					this.setBlockAt(a, c, this.getBlockAt(a, c - 1));
				}
			}
		}
	}

	if (lines_cleared == 0) {
		this.score_keeper.combo = 0; // reset the combo
	}

	this.score_keeper.clearLines(lines_cleared);

}

Tetrion.prototype.activateInput = function(input_type){
	this.new_input_flags[input_type] = true;
}

Tetrion.prototype.releaseInput = function(input_type){
	this.new_input_flags[input_type] = false;
}

Tetrion.prototype.waitForNewPiece = function(){
	this.entry_delay = this.are;
}

Tetrion.prototype.holdPiece = function(){
	if (this.held_piece) return;
	if (!this.current_piece) return;

	var piece_to_release = this.hold_piece;
	this.held_piece = true;

	this.hold_piece = this.current_piece.shape;

	if (piece_to_release) {
		this.current_piece = new Piece(
			piece_to_release,
			{
				x: spawn_positions[piece_to_release].x,
				y: spawn_positions[piece_to_release].y
			},
			this
		);
	} else {
		piece_to_release = piece_shapes[this.next_queue[0]];
		this.current_piece = new Piece(
			piece_to_release,
			{
				x: spawn_positions[piece_to_release].x,
				y: spawn_positions[piece_to_release].y
			},
			this
		);
		this.genRandomPiece();
	}
}

Tetrion.prototype.queueNewPiece = function(){

	this.held_piece = false;

	// check for initial hold
	if (this.new_input_flags.hold) {
		this.holdPiece();
	}

	var next_shape = piece_shapes[this.next_queue[0]];

	var spawn_row = spawn_positions[next_shape].y;
	var spawn_column = spawn_positions[next_shape].x;

	this.current_piece = new Piece(
		next_shape,
		{x: spawn_column, y: spawn_row},
		this
	);

	// check for initial rotation
	if(this.new_input_flags.rotate_left) this.current_piece.rotate("left");
	if(this.new_input_flags.rotate_right) this.current_piece.rotate("right");
	if(this.new_input_flags.rotate_180) this.current_piece.rotate("180");

	// check for initial hold

	if(this.current_piece.isSpawnBlocked()){
		this.gameOver();
	}

	this.genRandomPiece();
	this.score_keeper.spawnPiece();

}

Tetrion.prototype.gameOver = function() {

	mission.current_section.bgm.stop();

	this.gameover = true;
	this.gameover_frames = 0;

	this.particles = Array(10); // x coord
	for(var a = 0; a < 10; ++a){
		this.particles[a] = Array(24); // y coord
		for(var b = 0; b < 24; ++b){
			this.particles[a][b] = {
				color: this.current_piece.occupies(a, b-4) ? this.current_piece.shape : this._stategrid[a][b],
				brightness: this.current_piece.occupies(a, b-4) ? 255 : (this._stategrid[a][b] != " " ? 127 : 0),
				position: {
					x: a * 16,
					y: (b - 4) * 16,
				},
				velocity: {
					x: 0,
					y: 0
				},
				rotation: 0,
			};
		}
	}

};

Tetrion.prototype.animateGameOver = function(){

	this.gameover_frames += 1;

	// split the board in half like a broken heart
	if (this.gameover_frames == 30) {
		se_tetrion_break.play();
		for (var a = 0; a < 10; ++a){
			for (var b = 0; b < 24; ++b){
				if (a < 5) this.particles[a][b].position.x -= 8;
				else       this.particles[a][b].position.x += 8;
			}
		}
	}

	if (this.gameover_frames == 90) {
		se_tetrion_shatter.play();
		for (var a = 0; a < 10; ++a){
			for (var b = 0; b < 24; ++b){
				var angle = Math.random() * Math.PI;
				this.particles[a][b].velocity.x = Math.cos(angle) * 8;
				this.particles[a][b].velocity.y = -Math.sin(angle) * 8;
				this.particles[a][b].velocity.rotation = angle * 2 - Math.PI;
			}
		}
	} else if (this.gameover_frames > 90) {
		for (var a = 0; a < 10; ++a){
			for (var b = 0; b < 24; ++b){
				this.particles[a][b].position.x += this.particles[a][b].velocity.x;
				this.particles[a][b].position.y += this.particles[a][b].velocity.y;
				this.particles[a][b].velocity.y += 0.5;
				this.particles[a][b].rotation += this.particles[a][b].velocity.rotation / 60;
			}
		}
	}

	if (this.gameover_frames == 180) {
		scene.selectScene("gameover");
	}

};

Tetrion.prototype.getBlockAt = function(x, y){
	return this._stategrid[x][y+4]; // x from 0 to 9, y from -4 to 19
};

Tetrion.prototype.getParticleAt = function(x, y){
	return this.particles[x][y+4]; // x from 0 to 9, y from -4 to 19
};

Tetrion.prototype.setBlockAt = function(x, y, val){
	this._stategrid[x][y+4] = val; // x from 0 to 9, y from -4 to 19
};

Tetrion.prototype.setCurrentPiece = function(piece){
	this.current_piece = piece;
};

Tetrion.prototype.getCurrentPiece = function(piece){
	return this.current_piece;
};


Tetrion.prototype.genRandomPiece = function(){
	// random6 from nullpomino, 4 tries
	var shape = null;
	for(var tries = 0; tries < 4; ++tries){
		shape = Math.floor(Math.random() * 7);
		var match = false;
		// looks at last 4 generated pieces and tries for a match
		for(var a = 2; a < 6; ++a){
			if(this.next_queue[a] == shape) match = true;
		}
		if(match == false) break;
	}
	for(var a = 0; a < 5; ++a){
		this.next_queue[a] = this.next_queue[a+1];
	}
	this.next_queue[5] = shape;
};


Tetrion.prototype.resetBoard = function(){

	this.gameover = false;

	this.next_queue = [4, 6, 4, 6, 4, 6];
	this.hold = null;

	for(var a = 0; a < 7; ++a){
		this.queueNewPiece();
	}

	for(var a = 0; a < 10; ++a){
		for(var b = 0; b < 24; ++b){
			this._stategrid[a][b] = " ";
		}
	}

	this.score_keeper.reset();

	this.gravity = this.score_keeper.getGravity() * this.fps / 60;
	this.drop_speed = 256 * this.fps / 60;

	this.das = {
		"direction": "", // left or right
		"charge": 0,
	};

	this.entry_delay = this.are;

	mission.current_section = mission.sectionList[0];
	this.setDelayParams(mission.current_section.speed_params);
	mission.current_section.bgm.play();

}


Tetrion.prototype.setDelayParams = function(params){

	this.are = params[0] * this.fps / 60;
	this.line_are = params[1] * this.fps / 60;
	this.lock_delay = params[2] * this.fps / 60;
	this.max_das = params[3] * this.fps / 60;

}


var tetrion = new Tetrion();
