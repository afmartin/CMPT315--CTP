//just display some content in the main area based on what is
//selected in the side panel.
function print_str(str) {
    if(document.getElementById("signUp"))
        return;
    var v = document.getElementById("main");

    var d = document.createElement("div");
    d.innerHTML+=str;
    d.className="dropdown";

    var content = document.createElement("div");
    content.className="dropdown-content";

    var small_i = document.createElement("img");
    small_i.src="../images/sticky.png";
    small_i.width=100;
    small_i.height=50;

    var big_i = document.createElement("img");
    big_i.src="../images/sticky.png";
    big_i.width=300;
    big_i.height=150;

    v.appendChild(d);
    d.appendChild(small_i);
    content.appendChild(big_i);
    d.appendChild(content);
    v.innerHTML+="<br><br>";
}

//change the main content area to allow a user to sign up
function signUp(){
    if(document.getElementById("signUp"))
        return;
    document.getElementById("main").innerHTML= "";

    var su = document.createElement("div");
    su.id = "signUp";
    su.innerHTML = '<h1>User Creation</h1> <form>First name:<br> <input type="text" name="firstname"><br>' +
        '<br>Last name:<br> <input type="text" name="lastname"><br><br>Email address:<br> '
        + '<input type="text" name="email"><br><br>Password:<br> <input type="password" name="password"><br>'
        + '<br>Reconfirm password:<br> <input type="password" name="rePassword"><br><br> </form> <button '
        + 'type="button" onclick = "cancelSignUp()">Cancel</button> <button onclick = "addNewTeacher()" type="button">Submit</button>';
    document.getElementById("main").appendChild(su);
}

//if the user cancels their sign up just reload the home page
function cancelSignUp(){
    window.location.href = 'frontPage.html';
}

//constructor for teacher object
//will need to add additional properties..
function Teacher(fname, lname, email, psswd){
    this.firstName = fname;
    this.lastName = lname;
    this.email = email;
    this.password =  psswd;
}

//at some point this could actually send the data to server..
Teacher.prototype.send = function(){
    alert("Send this info to server: \n" + JSON.stringify(this));
}

//just get the info from text, create a teacher and send the info
function addNewTeacher(){
    var newT = new Teacher(document.getElementById("signUp").getElementsByTagName("input")[0].value,
        document.getElementById("signUp").getElementsByTagName("input")[1].value,
        document.getElementById("signUp").getElementsByTagName("input")[2].value,
        document.getElementById("signUp").getElementsByTagName("input")[3].value);
    newT.send();
}

function myDocuments(){
    if(document.getElementById("myDocuments"))
        return;
    document.getElementById("main").innerHTML= "";

    var doc = document.createElement("div");
    doc.id = "myDocuments";
    doc.innerHTML ='<div id="docNav">'
        + '<ul>'
        + ' <li><a onclick = "viewHistory()" hrefs="#">History</a></li> '
        + ' <li><a onclick = "uploadDocuments()" hrefs="#">Upload</a></li> '
        + ' <li><a onclick = "downloadedDocuments()" hrefs="#">Downloaded</a></li> '
        + ' </ul></div>';
    document.getElementById("main").appendChild(doc);
}

function viewHistory(){
    if(document.getElementById("viewHistory"))
        return;
    document.getElementById("main").innerHTML= "";

    var doc = document.createElement("div");
    doc.id = "viewHistory";
    doc.innerHTML = '<div id="docNav">'
        + ' <ul>'
        + ' <li><a onclick = "viewHistory()" hrefs="#">History</a></li> '
        + ' <li><a onclick = "uploadDocuments()" hrefs="#">Upload</a></li> '
        + ' <li><a onclick = "downloadedDocuments()" hrefs="#">Downloaded</a></li> '
        + ' </ul>'
        + '</div><br>'
        + '<p>documents go here</p>';
    document.getElementById("main").appendChild(doc);
}

function uploadDocuments(){
    if(document.getElementById("uploadDocuments"))
        return;
    document.getElementById("main").innerHTML= "";

    var doc = document.createElement("div");
    var serverDocumentFolder = "./documents/"

    doc.id = "uploadDocuments";
    doc.innerHTML = '<div id="docNav">'
        + '<ul>'
        + ' <li><a onclick = "viewHistory()" hrefs="#">History</a></li> '
        + ' <li><a onclick = "uploadDocuments()" hrefs="#">Upload</a></li> '
        + ' <li><a onclick = "downloadedDocuments()" hrefs="#">Downloaded</a></li> '
        + ' </ul>'
        + '</div><br>'
        + '<form action="uploadDoc" method="POST"><br>'
        + 'File Description:  '
        + '<input type="text" name="fileDescription" id="fileSelectorInput"> <br>'
        + '<p> <input type="file" name="file"></p>'
        + '<input type="submit">'
        + '</form>';
    document.getElementById("main").appendChild(doc);

}

function downloadedDocuments(){
    if(document.getElementById("uploadDocuments"))
        return;
    document.getElementById("main").innerHTML= "";

    var doc = document.createElement("div");
    doc.id = "uploadDocuments";
    doc.innerHTML = '<div id="docNav">'
        + '<ul>'
        + ' <li><a onclick = "viewHistory()" hrefs="#">History</a></li> '
        + ' <li><a onclick = "uploadDocuments()" hrefs="#">Upload</a></li> '
        + ' <li><a onclick = "downloadedDocuments()" hrefs="#">Downloaded</a></li> '
        + ' </ul>'
        + '</div><br>'
        + '<p>list of docs downloaded go here</p>'
    document.getElementById("main").appendChild(doc);

}

