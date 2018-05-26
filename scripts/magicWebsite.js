
function sceneTransition(firstId, secondId) {
	if(secondId == 'gameCanvas' || firstId == 'gameCanvas') {
		document.getElementById("leftDiv").classList.add('leftCurtain');
		document.getElementById("rightDiv").classList.add('rightCurtain');
		document.getElementById(firstId).classList.remove('visible');
		document.getElementById(firstId).classList.remove('toTopTransition');
		document.getElementById(firstId).classList.add('invisible');
		document.getElementById(secondId).classList.remove('invisible');
		document.getElementById(secondId).classList.remove('toBotTransition');
		document.getElementById(secondId).classList.add('visible');
	} else {
		document.getElementById(firstId).classList.remove('visible');
		document.getElementById(firstId).classList.remove('toTopTransition');
		document.getElementById(firstId).classList.add('toBotTransition');
		document.getElementById(secondId).classList.remove('invisible');
		document.getElementById(secondId).classList.remove('toBotTransition');
		document.getElementById(secondId).classList.add('toTopTransition');
	}
}

function addSlider(elementId) {
	document.getElementById(elementId).classList.add('sliderAnimation');
}

function removeSlider(elementId) {
	document.getElementById(elementId).classList.remove('sliderAnimation');
}

function addCharacter(container, name) {
	var url = "https://gateway.marvel.com/v1/public/characters?apikey=15b0df9dd78ed4c3d58e10b0c3d36a57&hash=758e48b905e396fca02324d24f1f7b06&ts=432&name=" + name;
	var xmlRequest = new XMLHttpRequest();

	xmlRequest.onreadystatechange = function () {

		// if (this.readyState == 4 && this.status == 200) {
			// var thumbnail = JSON.parse(this.responseText).data.results[0].thumbnail;
			// var imgUrl = thumbnail.path + '/portrait_xlarge.' + thumbnail.extension;
			var imgUrl = "../icons/1.jpg";

			var anchor = document.createElement("a");
			anchor.setAttribute("id",name);
			anchor.setAttribute("class", "buttonGame characterIcon");
			var goOnClick = "buildStoryPage('" + name + "')";
			anchor.setAttribute("onclick",goOnClick);

			var image = document.createElement("img");
			image.setAttribute("src", imgUrl);
			image.setAttribute("class", "icon");
			image.setAttribute("alt", name);

			anchor.appendChild(image);
			container.appendChild(anchor);
		// }
	};
	xmlRequest.open("GET", url, true);
	xmlRequest.send();
}

function buildStoryPage(characterName) {

	var container = document.getElementById("chooseCharacterCanvas");

	var titles = document.getElementById("charactersTitle");
	var charactersTables = document.getElementsByClassName("charactersTable");

	var imgUrl = "../icons/1.jpg";

	titles.setAttribute("style","display: none;");
	charactersTables[0].setAttribute("style","display: none;");
	charactersTables[1].setAttribute("style","display: none;");

	var anchor = document.createElement("a");
	anchor.setAttribute("id",characterName + "StoryIcon");
	anchor.setAttribute("class", "buttonGame storyIcon");
	anchor.setAttribute("href", "#gameCanvas");
	anchor.setAttribute("onclick", "sceneTransition('chooseCharacterCanvas','gameCanvas')");
	
	anchor.addEventListener('click', function() {
		// alert('start');
		startGame();
	});

	var image = document.createElement("img");
	image.setAttribute("src", imgUrl);
	image.setAttribute("class", "icon");
	image.setAttribute("alt", characterName);

	anchor.appendChild(image);
	container.appendChild(anchor);

	// Create back button.
	var backButton = document.createElement("a");
	backButton.setAttribute("id","storyBackButton");
	backButton.setAttribute("class","creditsBackButton");
	backButton.setAttribute("href","#chooseCharacterCanvas");
	backButton.setAttribute("onclick","removeStoryPage('" + characterName + "')");

	var backImg = document.createElement("img");
	backImg.setAttribute("src","../textures/backButton.png");

	backButton.appendChild(backImg);
	container.appendChild(backButton);
}

function removeStoryPage(characterName) {
	var characterStoryIcon = document.getElementById(characterName + "StoryIcon");
	var storyBackButton = document.getElementById("storyBackButton");
	var chooseCharacterCanvas = document.getElementById("chooseCharacterCanvas");

	chooseCharacterCanvas.removeChild(storyBackButton);
	chooseCharacterCanvas.removeChild(characterStoryIcon);

	var titles = document.getElementById("charactersTitle");
	var charactersTables = document.getElementsByClassName("charactersTable");

	titles.removeAttribute("style","display: none;");
	charactersTables[0].removeAttribute("style","display: none;");
	charactersTables[1].removeAttribute("style","display: none;");
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

function changeVolume(elementId) {
	var inputVolume = elementId.value;
	if(elementId == "musicVolume"){
		background_sound.volume = inputVolume;
	} else {
		jump_land.volume = inputVolume;
		jump_sound.volume = inputVolume;
	}
}

function changeKey(elementId) { 
	var keybordFunction = function (event) {
		var pressed = false;
	
		if(pressed == false){
			const key = event.key;
			const keyCode = event.keyCode;
	
			if(key == ' ') {
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

function updateKeyCodes(elementId,keyCode) {
	var xmlRequest = new XMLHttpRequest();
	var serverURL = "http://localhost:3000/options?";
	serverURL = serverURL + "key=" + elementId + "&code=" + keyCode + "&player=" + uuid;
	//console.log(serverURL);
	xmlRequest.open("POST", serverURL, true);
	xmlRequest.send();
	return xmlRequest.response;
}
  
function buildSignUpMenu() {
	var loginButton = document.getElementById('loginButton');
	document.getElementById('loginForm').removeChild(loginButton);

	var repasswordRow = document.createElement("li");
	repasswordRow.setAttribute("id","repasswordRow");
	var repasswordInput = document.createElement("input");
	repasswordInput.setAttribute("id","repasswordInput");
	repasswordInput.setAttribute("class","themeText");
	repasswordInput.setAttribute("type","password");
	repasswordInput.setAttribute("name","repassword");
	repasswordInput.setAttribute("placeholder","Re-password");
	var keyIcon = document.createElement("img");
	keyIcon.setAttribute("class","menuIcon");
	keyIcon.setAttribute("src","../textures/Locker.png");

	repasswordRow.appendChild(keyIcon);
	repasswordRow.appendChild(repasswordInput);
	document.getElementById('loginBoxList').appendChild(repasswordRow);


	var signUpButton = document.getElementById("signUpButton");
	signUpButton.removeAttribute("onclick","buildSignUpMenu()");
	signUpButton.setAttribute("onclick","signUpRequest();");
}

function buildLoginMenu() {

		var repasswordRow = document.getElementById("repasswordRow");
		var loginBoxList = document.getElementById("loginBoxList");
		loginBoxList.removeChild(repasswordRow);

		var loginButton = document.createElement("a");
		loginButton.setAttribute("id","loginButton");
		loginButton.setAttribute("class","menuButtonLink themeBox");
		loginButton.setAttribute("onclick","loginRequest()");
		loginButton.setAttribute("href","#menuCanvas");
		loginButton.setAttribute("type","submit");
		loginButton.innerHTML = "Login";

		var signUpButton = document.getElementById("signUpButton");
		signUpButton.removeAttribute("onclick","signUpRequest()");
		signUpButton.setAttribute("onclick","buildSignUpMenu()");

		var loginForm = document.getElementById("loginForm");
		loginForm.insertBefore(loginButton,signUpButton);
}

function signUpRequest() {
	var username = document.getElementById("usernameInput");
	var password = document.getElementById("passwordInput");
	var repassword = document.getElementById("repasswordInput");

	if(username != null && password != null && repassword != null) {
		if(password.value == repassword.value) {
			var xmlRequest = new XMLHttpRequest();
			var serverURL = "http://localhost:3000/signup?";
			serverURL = serverURL + "username=" + username.value + "&password=" + password.value;
			xmlRequest.open("POST", serverURL, true);
			xmlRequest.send();

			setTimeout(function() {
				if(xmlRequest.status == 200) {
					buildLoginMenu();
				}
			}, 500);
		} else {
			alert("Passwords are not identical! Try again!");
		}
	}
}

//Utilitary function for server requests
function makeSynchronousRequest(url) {
    if (uuid === undefined) {
        console.log("uuid undefined");
        return;
    }
    socket.emit('game', url + "&player=" + uuid);
}

function loginRequest() {
	var username = document.getElementById("usernameInput");
	var password = document.getElementById("passwordInput");

	if(username != null && password != null) {
		var xmlRequest = new XMLHttpRequest();
		var serverURL = "http://localhost:3000/login?";
		serverURL = serverURL + "username=" + username.value + "&password=" + password.value;
		
		xmlRequest.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				uuid = this.responseText;
				
				if(uuid === "") {
					alert('uuid not generated');
				} else {
					setTimeout(function() {
						if(xmlRequest.status == 200) {
							sceneTransition('loginCanvas','menuCanvas');
						}
					}, 500);
					
					// console.log(uuid);
				}
			}
		}
		
		xmlRequest.open("GET", serverURL, true);
		xmlRequest.send();
	}
}
