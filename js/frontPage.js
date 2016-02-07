function print_str(str) {
    var v = document.getElementById("main").getElementsByTagName("p")[1];
    v.innerHTML+= str;
    var d = document.createElement("div");
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