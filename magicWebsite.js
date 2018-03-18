function setDisplayNone(firstId,secondId){

    var transitionTime = 500;

    fade(firstId);
    
    setTimeout(function(){
        document.getElementById(firstId).style.display="none";
        
        if(secondId == "chooseCaracterCanvas")
            document.getElementById(secondId).style.display="inline-block";
        else
            document.getElementById(secondId).style.display="block";

        setTimeout(function(){
            fade(secondId);
        }, transitionTime);
    }, transitionTime);
    

}

function fade(element) {
    var slideSource = document.getElementById(element);
    slideSource.classList.toggle('fade');
}