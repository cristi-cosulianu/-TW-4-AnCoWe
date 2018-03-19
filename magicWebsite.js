function sceneTransition(firstId, secondId) {
  document.getElementById("leftDiv").classList.add('leftCurtain');
  document.getElementById("rightDiv").classList.add('rightCurtain');
  document.getElementById(firstId).classList.remove('visible');
  document.getElementById(firstId).classList.add('invisible');
  document.getElementById(secondId).classList.remove('invisible');
  document.getElementById(secondId).classList.add('visible');
}
