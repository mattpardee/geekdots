(function() {

var dots = {};
var socket = io.connect();

socket.on("connect", function() {
    document.body.onmousemove = function(e) {
        socket.emit("cursor", {
           x: e.pageX,
           y: e.pageY
        });
    };
    
    document.body.onclick = function() {
        socket.emit("click", "");
    };
});

socket.on("remove", function(id) {
    var el = dots[id];
    if (!el)
        return;
        
    document.body.removeChild(el);
    delete dots[id];
});

socket.on("click", function(id) {
    var el = dots[id];
    if (!el)
        return;
        
    el.className = "ball click";
    setTimeout(function() {
        el.className = "ball";
    }, 150);
});

socket.on("cursor", function(data) {
    var id = data.id;
    var el = dots[id];
    if (!el) {
        el = document.createElement("div");
        el.className = "ball";
        el.style.background = "hsl(" + (id*5 % 360) + ", 70%, 70%)";
        document.body.appendChild(el);
        dots[data.id] = el;
    }
        
    el.style.left = data.x + "px";
    el.style.top = data.y + "px";
});

})();