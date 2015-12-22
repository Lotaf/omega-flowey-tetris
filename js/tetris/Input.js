function setup_input(){

    window.onkeydown = function(e){
        if(e.keyCode == 83) tetrion.activateInput("rotate_left");
        if(e.keyCode == 68) tetrion.activateInput("rotate_180");
        if(e.keyCode == 65) tetrion.activateInput("rotate_right");
        if(e.keyCode == 67) tetrion.activateInput("hold");

        if(e.keyCode == 73) tetrion.activateInput("up");
        if(e.keyCode == 74) tetrion.activateInput("left");
        if(e.keyCode == 75) tetrion.activateInput("down");
        if(e.keyCode == 76) tetrion.activateInput("right");
    };

    window.onkeyup = function(e){
        if(e.keyCode == 83) tetrion.releaseInput("rotate_left");
        if(e.keyCode == 68) tetrion.releaseInput("rotate_180");
        if(e.keyCode == 65) tetrion.releaseInput("rotate_right");
        if(e.keyCode == 67) tetrion.releaseInput("hold");

        if(e.keyCode == 73) tetrion.releaseInput("up");
        if(e.keyCode == 74) tetrion.releaseInput("left");
        if(e.keyCode == 75) tetrion.releaseInput("down");
        if(e.keyCode == 76) tetrion.releaseInput("right");
    };

}
