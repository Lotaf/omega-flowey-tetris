function generateRandomUnicodeCharacter() {
	var distrib = Math.random();

	if ((distrib -= 0.3) < 0)
		return String.fromCharCode(65 + Math.random() * 26);
	else if ((distrib -= 0.3) < 0)
		return String.fromCharCode(97 + Math.random() * 26);
	else if ((distrib -= 0.2) < 0)
		return String.fromCharCode(48 + Math.random() * 10);
	else
		return String.fromCharCode(1000 + Math.random() * 9000);
}


function generateGarbledString(length) {

	var str = "";

	str += generateRandomUnicodeCharacter();
	while (Math.random() < 1 - (str.length * 0.01))
		str += generateRandomUnicodeCharacter();

	return str;

}
