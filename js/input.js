function setup_input(){

    window.onkeydown = function(e){
        if(e.keyCode == 83 || e.keyCode == 82 /* R/S */)
			scene.handleInput({ input: "rotate_left", dir: "down" });
	    if(e.keyCode == 87 /* W */)
			scene.handleInput({ input: "rotate_left2", dir: "down" });
        if(e.keyCode == 68 /* D */)
			scene.handleInput({ input: "rotate_180", dir: "down" });
        if(e.keyCode == 65 /* A */)
			scene.handleInput({ input: "rotate_right", dir: "down" });
        if(e.keyCode == 69 /* E */)
			scene.handleInput({ input: "rotate_right2", dir: "down" });
        if(e.keyCode == 67 || e.keyCode == 70 /* C/F */)
			scene.handleInput({ input: "hold", dir: "down" });

        if(e.keyCode == 73 /* I */)
			scene.handleInput({ input: "up", dir: "down" });
        if(e.keyCode == 74 /* J */)
			scene.handleInput({ input: "left", dir: "down" });
        if(e.keyCode == 75 /* K */)
			scene.handleInput({ input: "down", dir: "down" });
        if(e.keyCode == 76 /* L */)
			scene.handleInput({ input: "right", dir: "down" });

		if(e.keyCode == 90 /* Z */)
			scene.handleInput({ input: "A", dir: "down" });
		if(e.keyCode == 88 /* X */)
			scene.handleInput({ input: "B", dir: "down" });

    };

    window.onkeyup = function(e){
		if(e.keyCode == 83 || e.keyCode == 82 /* R/S */)
			scene.handleInput({ input: "rotate_left", dir: "up" });
	    if(e.keyCode == 87 /* W */)
			scene.handleInput({ input: "rotate_left2", dir: "up" });
        if(e.keyCode == 68 /* D */)
			scene.handleInput({ input: "rotate_180", dir: "up" });
        if(e.keyCode == 65 /* A */)
			scene.handleInput({ input: "rotate_right", dir: "up" });
        if(e.keyCode == 69 /* E */)
			scene.handleInput({ input: "rotate_right2", dir: "up" });
        if(e.keyCode == 67 || e.keyCode == 70 /* C/F */)
			scene.handleInput({ input: "hold", dir: "up" });

        if(e.keyCode == 73 /* I */)
			scene.handleInput({ input: "up", dir: "up" });
        if(e.keyCode == 74 /* J */)
			scene.handleInput({ input: "left", dir: "up" });
        if(e.keyCode == 75 /* K */)
			scene.handleInput({ input: "down", dir: "up" });
        if(e.keyCode == 76 /* L */)
			scene.handleInput({ input: "right", dir: "up" });

		if(e.keyCode == 90 /* Z */)
			scene.handleInput({ input: "A", dir: "up" });
		if(e.keyCode == 88 /* X */)
			scene.handleInput({ input: "B", dir: "up" });
    };

}
