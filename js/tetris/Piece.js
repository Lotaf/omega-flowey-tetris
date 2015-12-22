//////////////////
// The Tetrion uses coordinates
// with x being right, y being down.
//////////////////

var GRAVITY_DENOM = 256;

function Piece(shape, position, tetrion){

	this.shape = shape;
	this.position = position;

	this.gravity = 0; // a number from 0 to GRAVITY_DENOM signifying how close the piece is to dropping one square.
	this.lock_delay = 30;
	this.lock_flash = false;

	this.tetrion = tetrion;
	tetrion.setCurrentPiece(this);

	this.kick_offset = {'x': 0, 'y': 0};

	this.rotation_state = 0;
	this.block_offsets = block_offsets[this.shape];

};

Piece.prototype.rotate = function(direction){

	if (this.tetrion.gameover) return false;

	// reject rotation on the O piece, always
	if (this.shape == "O") return false;

	// first, set the new block offsets
	this.new_block_offsets = Array();
	this.new_rotation_state = null;

	if(direction == "left"){
		this.new_rotation_state = (this.rotation_state + 3) % 4;
	}else if(direction == "right"){
		this.new_rotation_state = (this.rotation_state + 1) % 4;
	}else if(direction == "180"){
		this.new_rotation_state = (this.rotation_state + 2) % 4;
	} else return; // invalid input

	for(var a = 0; a < 4; ++a){
		this.new_block_offsets[a] = {
			'x': this.block_offsets[this.new_rotation_state][a].x,
			'y': this.block_offsets[this.new_rotation_state][a].y,
		};
	}

	// now, check if the current position is blocked
	// if that fails, check all of the kick positions
	for(var a = 0; a < kick_positions[this.shape]["" + this.rotation_state + this.new_rotation_state].length; ++a){

		this.new_kick_offset = {
            x: kick_positions[this.shape]["" + this.rotation_state + this.new_rotation_state][a].x,
            y: kick_positions[this.shape]["" + this.rotation_state + this.new_rotation_state][a].y,
        };

		if(!this.isRotationBlocked()){

			this.kick_offset = this.new_kick_offset;
			this.rotation_state = this.new_rotation_state;

			if(this.bottomed && (!this.isDropBlocked() || this.tetrion.move_reset)){
				this.bottomed = false;
				this.lock_delay = this.tetrion.lock_delay;
			}

			return true;
		}
	}

	return false;

};

Piece.prototype.move = function(direction){

	if (this.tetrion.gameover) return false;

	if(direction == "left"){
		this.new_position = {
			'x': this.position.x - 1,
			'y': this.position.y
		};
	} else if(direction == "right"){
		this.new_position = {
			'x': this.position.x + 1,
			'y': this.position.y
		};
	} else return; // invalid input

	if (!this.isMoveBlocked()){
		this.position = {
			'x': this.new_position.x + this.kick_offset.x,
			'y': this.new_position.y
		};
		// reset the rotation kick offset, but horizontal only
		this.kick_offset.x = 0;
		if(this.bottomed && (!this.isDropBlocked() || this.tetrion.move_reset)){
			this.bottomed = false;
			this.lock_delay = this.tetrion.lock_delay;
		}
		return true;
	}

	return false;

};


Piece.prototype.hardDrop = function(x, y){

	if (this.isDropBlocked()) return false;

	while(!this.isDropBlocked()){
		this.position = {
			'x': this.position.x,
			'y': this.position.y + 1
		};
		++this.tetrion.score_keeper.drop_count;
        this.gravity = 0;
		this.bottomed = true;
	}
	return true;

};


Piece.prototype.drop = function(x, y){

	if(this.bottomed){
		return false;
	}else if(this.isDropBlocked()){
		this.bottomed = true;
		return false;
	}else{
		this.position = {
			'x': this.position.x,
			'y': this.position.y + 1
		};
		// only increment score when drop is being held
		if(this.tetrion.input_flags.down) ++this.tetrion.score_keeper.drop_count;

		this.gravity -= GRAVITY_DENOM;
		return true;
	}

};

Piece.prototype.isRotationBlocked = function(){

	for(var a = 0; a < 4; ++a){
		var block_x = this.position.x + this.new_kick_offset.x + this.new_block_offsets[a].x;
		var block_y = this.position.y + this.new_kick_offset.y + this.new_block_offsets[a].y;

		if(block_x < 0 || block_x > 9) return true;
		if(block_y < -4 || block_y > 19) return true;

		if(this.tetrion.getBlockAt(block_x, block_y) != " "){
			return true;
		}
	}

	return false;

};

Piece.prototype.isMoveBlocked = function(){

	for(var a = 0; a < 4; ++a){

		var block_x = this.new_position.x + this.kick_offset.x + this.block_offsets[this.rotation_state][a].x;
		var block_y = this.new_position.y + this.kick_offset.y + this.block_offsets[this.rotation_state][a].y;

		if(block_x < 0 || block_x > 9) return true;
		if(block_y < -4 || block_y > 19) return true;

		if(this.tetrion.getBlockAt(block_x, block_y) != " "){
			return true;
		}
	}
	return false;

};

Piece.prototype.isDropBlocked = function(){

	for(var a = 0; a < 4; ++a){

		var block_x = this.position.x + this.kick_offset.x + this.block_offsets[this.rotation_state][a].x;
		var block_y = this.position.y + this.kick_offset.y + this.block_offsets[this.rotation_state][a].y + 1;

		if(block_x < 0 || block_x > 9) return true;
		if(block_y < -4 || block_y > 19) return true;

		if(this.tetrion.getBlockAt(block_x, block_y) != " "){
			return true;
		}

	}
	return false;

};

Piece.prototype.isSpawnBlocked = function(){

	for(var a = 0; a < 4; ++a){

		var block_x = this.position.x + this.kick_offset.x + this.block_offsets[0][a].x;
		var block_y = this.position.y + this.kick_offset.y + this.block_offsets[0][a].y;

		if(block_x < 0 || block_x > 9) return true;
		if(block_y < -4 || block_y > 19) return true;

		if(this.tetrion.getBlockAt(block_x, block_y) != " "){
			return true;
		}

	}
	return false;

};

Piece.prototype.lock = function(){

	this.lock_flash = false;

	for(var a = 0; a < 4; ++a){

		var block_x = this.position.x + this.kick_offset.x + this.block_offsets[this.rotation_state][a].x;
		var block_y = this.position.y + this.kick_offset.y + this.block_offsets[this.rotation_state][a].y;

		this.tetrion.setBlockAt(block_x, block_y, this.shape);

	}

	this.tetrion.setCurrentPiece(null);
	this.tetrion.checkForLines();

	this.tetrion.score_keeper.placePiece();

};

Piece.prototype.occupies = function(x, y){

	for(var a = 0; a < 4; ++a){

		var block_x = this.position.x + this.kick_offset.x + this.block_offsets[this.rotation_state][a].x;
		var block_y = this.position.y + this.kick_offset.y + this.block_offsets[this.rotation_state][a].y;

		if (x == block_x && y == block_y) {
			return true;
		}

	}

	return false;

};

Piece.prototype.advanceOneFrame = function(gravity, rotate_input, horiz_move_input, vert_move_input){

	// console.log(gravity, rotate_input, move_input);

	if (this.lock_flash) {
		return;
		// on a lock flash, nothing can affect the piece anymore.
	}

	if (!this.bottomed) {
		this.gravity += gravity;
	} else {
		this.lock_delay -= 1;
		if (this.lock_delay <= 0) {
			this.lock_flash = true;
			this.tetrion.waitForNewPiece();
			return;
		}
	}

	// 1. account for rotate input
	this.rotate(rotate_input);

	// 2. account for move input
	if(vert_move_input == "down"){
		if(this.bottomed){
			this.lock_flash = true;
			this.tetrion.waitForNewPiece();
			return;
		}else{
			this.gravity += this.tetrion.drop_speed;
		}
    }else if(vert_move_input == "up"){
        this.hardDrop();
	}

    // 2.2 horizontal move input
    this.move(horiz_move_input);

	// 3. gravity
	while(!this.bottomed && this.gravity >= GRAVITY_DENOM){
		if(this.drop()){
			if(this.isDropBlocked()){
				this.bottomed = true;
			}
			this.lock_delay = this.tetrion.lock_delay;
		}
	}

}
