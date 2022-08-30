function buildInfal() {
    var holder = $("<div>").addClass("infalHolder"),
        header = $("<div>").addClass("infalHeader").appendTo(holder),
        headerText = $("<span>").addClass("infalHeaderText").html("Infal TimeClock").appendTo(header),
        body = $("<div>").addClass("infalBody").appendTo(holder),
        dropdown = $("<span>").appendTo(body),
        button = $("<span>").addClass("infalBodyButton").html("&nbsp;").appendTo(body);

    $("#actioncenter").append(holder);

    InfalGetJobsAjax();
}

function getInfalUsernameDataSetter() {
    empId = readCookie("id");
    infalAjax.getInfalUserNameAjax(empId, setInfalUserNameToScreen);//Still need to add and implement callback
}

function setInfalUserNameToScreen(res) {
    var name = '';
    $('result', res).each(function () {
        //$.session.Name = $('name', this).text();
        name = $('name', this).text();
    });
    var t = name.split(',');
    name = t[1] + ' ' + t[0];
    $("#firstName").text(name);
}