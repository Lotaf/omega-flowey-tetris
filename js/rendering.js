function setup_graphics(){

    var p = new Processing(document.getElementById("blockbox"));

    var piece_colours = {
		" ": p.color(  0,   0,   0),
    	"I": p.color(255,  40,   0),
    	"J": p.color(  0,  40, 255),
    	"L": p.color(255, 135,   0),
    	"O": p.color(255, 255,   0),
    	"S": p.color( 40, 216,  40),
    	"T": p.color(105,   0, 210),
    	"Z": p.color(255,   0, 255),
    };

	var opening_banner = p.loadImage("img/undertale_f_open.png");
	var glitched_banners = [
		p.loadImage("img/undertale_f_open_big-glitched1.png"),
		p.loadImage("img/undertale_f_open_big-glitched2.png"),
		p.loadImage("img/undertale_f_open_big-glitched3.png"),
		p.loadImage("img/undertale_f_open_big-glitched4.png"),
		p.loadImage("img/undertale_f_open_big-glitched5.png"),
		p.loadImage("img/undertale_f_open_big-glitched6.png"),
	];
	var controls = p.loadImage("img/controls.png");

    p.setup = function() {
        p.size(640, 480);
        p.frameRate(60);
    };

	p.drawTetrion = function(t_pos) {

		p.background(0);
		p.fill(0);
        p.stroke(16);

		// Draw the tetrion

/*
        for(var a = 0; a <= 10; ++a){
            p.line(a * 16 + t_pos.x, 0 + t_pos.y, a * 16 + t_pos.x, 321 + t_pos.y);
        }

        for(var b = 0; b <= 20; ++b){
            p.line(0 + t_pos.x, b * 16 + t_pos.y, 161 + t_pos.x, b * 16 + t_pos.y);
        }
*/

		p.rect(t_pos.x, t_pos.y, 160, 320);

        for(var a = 0; a < 10; ++a){
            for(var b = 0; b < 20; ++b){
                var block = tetrion.getBlockAt(a, b);
                p.fill(piece_colours[block], 127);
                p.rect(a * 16 + t_pos.x, b * 16 + t_pos.y, 16, 16);
            }
        }

        var piece = tetrion.getCurrentPiece();
        if (piece != null){
            if (piece.lock_flash) {
                p.fill(255);
				p.stroke(255);
                piece.lock();
            } else {
                p.fill(piece_colours[piece.shape], 55 + 200 * (piece.lock_delay / tetrion.lock_delay));
				p.stroke(piece_colours[piece.shape], 0 * (piece.lock_delay / tetrion.lock_delay));
            }
            for(var a = 0; a < 4; ++a){
                var x = piece.position.x + piece.kick_offset.x + piece.block_offsets[piece.rotation_state][a].x;
                var y = piece.position.y + piece.kick_offset.y + piece.block_offsets[piece.rotation_state][a].y;
                p.rect(x * 16 + t_pos.x, y * 16 + t_pos.y, 16, 16);
            }
        }
	};

	p.drawNextQueue = function(t_pos) {

		// next queue

		var piece = tetrion.next_queue[0];
        var shape = piece_shapes[piece];

        p.fill(piece_colours[shape]);
		p.stroke(16);

        for(var a = 0; a < 4; ++a){
            var x = block_offsets[shape][0][a].x + spawn_positions[shape].x;
            var y = block_offsets[shape][0][a].y + 1;
            p.rect(x * 16 + t_pos.x, y * 16 + t_pos.y - 40, 16, 16);
        }

        for(var n = 1; n < 5; ++n){
            var piece = tetrion.next_queue[n];
            var shape = piece_shapes[piece];

            var location = 90 + n * 48;
            if(shape == "I" || shape == "O") location = 101 + n * 48;

            p.fill(piece_colours[shape]);

            for(var a = 0; a < 4; ++a){
                var x = block_offsets[shape][0][a].x;
                var y = block_offsets[shape][0][a].y + 1;
                p.rect(x * 11 + location + t_pos.x, y * 11 + t_pos.y - 30, 11, 11);
            }
        }
	};

	p.drawHoldPiece = function(t_pos) {
		var piece = tetrion.hold_piece;
		if (!piece) return;

		var shape = piece;

		var location = 0;
		if(shape == "I" || shape == "O") location = 11;

		p.fill(piece_colours[shape]);

		for (var a = 0; a < 4; ++a) {
			var x = block_offsets[shape][0][a].x;
			var y = block_offsets[shape][0][a].y + 1;
			p.rect(x * 11 + location + t_pos.x, y * 11 + t_pos.y - 30, 11, 11);
		}
	}

	p.drawBrokenTetrion = function(t_pos) {

		p.background(0);

		for(var a = 0; a < 10; ++a){
			for(var b = 0; b < 20; ++b){
				var block = tetrion.getParticleAt(a, b);

				p.pushMatrix();
				p.translate(block.position.x + t_pos.x + 8, block.position.y + t_pos.y + 8);
				p.rotate(block.rotation);

				p.fill(piece_colours[block.color], block.brightness);
                p.rect(-8, -8, 16, 16);

				p.popMatrix();
			}
		}

	};

	p.drawIntroScene = function() {

		var queued_text = [
			"Long ago, two races\nruled over Earth:\nHUMANS and MONSTERS.",
			"One day, the",
			"One day, they all\nturned into Tetris\npieces and died."
		];

		p.background(0);

		if (scene.scene_frames < 300) {
			p.image(opening_banner, 120, 40);
			document.getElementById("textbox").innerHTML = queued_text[0].substr(0, scene.scene_frames / 4);
		} else if (scene.scene_frames < 375) {
			p.image(opening_banner, 120, 40);
			document.getElementById("textbox").innerHTML = queued_text[1].substr(0, (scene.scene_frames - 300) / 4);
		} else if (scene.scene_frames < 600) {
			if (scene.scene_frames < 425) p.image(glitched_banners[0], 0, 0);
			else if (scene.scene_frames < 445) p.image(glitched_banners[1], 0, 0);
			else if (scene.scene_frames < 470) p.image(glitched_banners[2], 0, 0);
			else if (scene.scene_frames < 508) p.image(glitched_banners[3], 0, 0);
			else if (scene.scene_frames < 568) p.image(glitched_banners[4], 0, 0);
			else if (scene.scene_frames < 575) p.image(glitched_banners[3], 0, 0);
			else p.image(glitched_banners[5], 0, 0);

			if (scene.scene_frames == 375) {
				intro_scene.garbled_text_length = queued_text[2].length;
				document.getElementById("textbox").innerHTML = queued_text[2];
			} else if (scene.scene_frames > 470 && Math.random() < 0.15) {
				intro_scene.garbled_text_length = Math.floor((0.6 + Math.random() * 0.2) * intro_scene.garbled_text_length);
				document.getElementById("textbox").innerHTML = queued_text[2].substr(0, intro_scene.garbled_text_length) + generateGarbledString();
			}
		} else {

			document.title = "Floweytris";
			document.getElementById("textbox").innerHTML = "";
			document.getElementById("controlbox").style.display = "block";
		}

	}

    p.draw = function() {

		var t_pos = { x: 240, y: 120 };

		if (scene.scene_state == "intro") {
			p.drawIntroScene();
		} else if (scene.scene_state == "tetris") {
			if (!tetrion.gameover) {
				p.drawTetrion(t_pos);
				p.drawNextQueue(t_pos);
				p.drawHoldPiece(t_pos);
			} else {
				p.drawBrokenTetrion(t_pos);
			}
		} else {
			p.background(0); // blank
		}

    };

    p.setup();


};
