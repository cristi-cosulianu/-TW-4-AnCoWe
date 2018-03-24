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

function addCharacter(container, name) {
	var url = "https://gateway.marvel.com/v1/public/characters?apikey=15b0df9dd78ed4c3d58e10b0c3d36a57&hash=758e48b905e396fca02324d24f1f7b06&ts=432&name=" + name;
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
					var thumbnail = JSON.parse(this.responseText).data.results[0].thumbnail;
					var imgUrl = thumbnail.path + '/portrait_xlarge.' + thumbnail.extension;

					var anchor = document.createElement("a");
					anchor.setAttribute("class", "buttonGame");
					anchor.setAttribute("href", "#gameCanvas");
					anchor.setAttribute("onclick", "sceneTransition(\'chooseCaracterCanvas\',\'gameCanvas\')");

					var image = document.createElement("img");
					image.setAttribute("src", imgUrl);
					image.setAttribute("class", "icon");
					image.setAttribute("alt", name);

					anchor.appendChild(image);
					container.appendChild(anchor);
			}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function startSlider(elementId){
	document.getElementById(elementId).classList.remove('animationPaused');
	document.getElementById(elementId).classList.remove('animationInitial');
}

window.onload = () => {
	document.getElementById("leftDiv").addEventListener("animationend", function () {
		document.getElementById("leftDiv").classList.remove('leftCurtain');
	});

	document.getElementById("rightDiv").addEventListener("animationend", function () {
			document.getElementById("rightDiv").classList.remove('rightCurtain');
	});

	var heroes = ["Spider-Man", "Wolverine", "Daredevil", "Captain America", "Iron Man", "Thor", "Black Widow", "Hulk"];
	var villains = ["Loki", "Red Skull", "Ultron", "Magneto", "Thanos", "Black Cat", "Galactus", "Apocalypse"];
	var heroesDiv = document.getElementById("heroes");
	var villainsDiv = document.getElementById("villains");

	for (var i = 0; i < heroes.length; ++i) {
			addCharacter(heroesDiv, heroes[i]);
	}

	for (var i = 0; i < villains.length; ++i) {
			addCharacter(villainsDiv, villains[i]);
	}
}
