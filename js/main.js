var last_update_times = Array();
var fps_display = "0 fps";
var stutter_log = "";
var accum_delta = 0;

function update(){

	requestAnimationFrame(update);
	logFPS();
    scene.advanceOneFrame();

}

window.onload = function(){

    setup_graphics();
    setup_input();

	// load save data
	initSaveData();

	if (!localStorage.hasOwnProperty("oft.intro") || localStorage["oft.intro"] == "false") {
		scene.selectScene("intro");
	} else {
		var escapes = parseInt(localStorage["oft.escapes"]);
		var deaths = parseInt(localStorage["oft.deaths"]);

		var plays = parseInt(localStorage["oft.plays"]);
		var runaway = false;

		if (plays > escapes + deaths) {
			escapes += 1;
			localStorage["oft.escapes"] = escapes;
			localStorage["oft.plays"] = escapes + deaths;
			runaway = true;
		}

		scene.selectScene("flowey_alt", {runaway: runaway, escapes: escapes, deaths: deaths});
	}

    update();

};


function logFPS() {
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
}
