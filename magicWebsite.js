function sceneTransition(firstId, secondId) {
  if(secondId == 'gameCanvas') {
  	document.getElementById("leftDiv").classList.add('leftCurtain');
	  document.getElementById("rightDiv").classList.add('rightCurtain');
	  document.getElementById(firstId).classList.remove('visible');
	  document.getElementById(firstId).classList.add('invisible');
	  document.getElementById(secondId).classList.remove('invisible');
	  document.getElementById(secondId).classList.add('visible');
	} else {
		document.getElementById(firstId).classList.remove('toTopTransition');
	  document.getElementById(firstId).classList.add('toBotTransition');
	  document.getElementById(secondId).classList.remove('toBotTransition');
	  document.getElementById(secondId).classList.add('toTopTransition');
	}
}
