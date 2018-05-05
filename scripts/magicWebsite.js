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
  
  function addSlider(elementId){
	  document.getElementById(elementId).classList.add('sliderAnimation');
  }
  
  function removeSlider(elementId){
	  document.getElementById(elementId).classList.remove('sliderAnimation');
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
					  anchor.setAttribute("onclick", "sceneTransition(\'chooseCharacterCanvas\',\'gameCanvas\')");
  
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
  
  window.addEventListener("load", () => {
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
  });
  
  function changeVolume(elementId)
  {
	  var inputVolume = document.querySelector(elementId).value;
	  if(elementId == "musicVolume"){
		  background_sound.volume = inputVolume;
	  } else {
		  jump_land.volume = inputVolume;
		  jump_sound.volume = inputVolume;
	  }
  }
  
  function changeKey(elementId){ 
  
	  var keybordFunction = function (event){
		  var pressed = false;
	  
		  if(pressed == false){
			  const key = event.key;
			  const keyCode = event.keyCode;
	  
			  console.log(event);
	  
			  if(key == ' '){
				  document.getElementById(elementId).textContent = "Space";
			  } else {
				  document.getElementById(elementId).textContent = key;
			  }
	  
			  switch (elementId) {
				  case "leftKey": leftKeyCode = keyCode; break;
				  case "rightKey": rightKeyCode = keyCode; break;
				  case "downKey": downKeyCode = keyCode; break;
				  case "jumpKey": jumpKeyCode = keyCode; break;
				  case "dashKey": dashKeyCode = keyCode; break;
				  default: break;
			  }
			  try {
			  updateKeyCodes(elementId,keyCode); 
		  }
		  catch(err) {
			  console.log(err.message);
		  }
	  
			  pressed = true;
		  }
		  document.removeEventListener('keydown', keybordFunction, false);
	  }
  
	  document.addEventListener('keydown', keybordFunction, false);
  
	  // document.removeEventListener('keydown', updateKeys, true);
  }
  
  function updateKeyCodes(elementId,keyCode){
	  
		  var serverURL = "http://localhost:3000/options?";
		  serverURL = serverURL + "key=" + elementId + "&code=" + keyCode;
		  console.log(serverURL);
		  XMLHttpRequest.open("GET", serverURL, true);
		  XMLHttpRequest.send();
		  return XMLHttpRequest.response;
  
  }
  