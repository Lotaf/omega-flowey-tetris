var last_update_times = Array();
var fps_display = "0 fps";
var stutter_log = "";
var accum_delta = 0;

function update(){

	requestAnimationFrame(update);

    var current_update_time = new Date().getTime();

    while(last_update_times[0] < current_update_time - 1000){
        last_update_times.shift();
    }

    fps_display = (last_update_times.length /
        (current_update_time - last_update_times[0]) * 1000).toFixed(1)
    + " fps";

    var delta = current_update_time - last_update_times[last_update_times.length - 1];
    if (delta) accum_delta += delta;

    if (delta > 40 && false) {
        stutter_log += current_update_time + ": " + delta + " ms stutter" + "\n";
    }

    last_update_times.push(current_update_time);

    while(accum_delta >= 1000/60){
        accum_delta -= 1000/60;
        tetrion.advanceOneFrame();
    }

}

window.onload = function(){

    setup_graphics();
    setup_input();

    update();

}
