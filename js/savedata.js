function initSaveData() {
	if (!localStorage.hasOwnProperty("oft.plays")) localStorage["oft.plays"] = 0;
	if (!localStorage.hasOwnProperty("oft.escapes")) localStorage["oft.escapes"] = 0;
	if (!localStorage.hasOwnProperty("oft.deaths")) localStorage["oft.deaths"] = 0;
}
