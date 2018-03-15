function setDisplayNone(firstId,secondId){
    fade(firstId);
    
    setTimeout(function(){
        document.getElementById(firstId).style.display="none";
        document.getElementById(secondId).style.display="block";
        setTimeout(function(){
            fade(secondId);
        }, 1000);
    }, 1000);
    

}

function fade(element) {
    var slideSource = document.getElementById(element);
    slideSource.classList.toggle('fade');
}