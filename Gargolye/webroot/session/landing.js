infalOnly = false
    ;
function gotoInfalLogin() {
    if (infalOnly) {
        //location.href = "./infal.html";
    } else {
        // $("#loginInfal").hide();
        //document.getElementById("loginInfal").style.display = "none";
    }
}

function gotoAnywhereLogin() {
    if (!infalOnly) location.href = "./login.html";
}