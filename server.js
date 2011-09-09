var fs = require("fs");
var http = require("http");

var server = http.createServer(function(req, res) {
    
    if (req.url.match(/^\/(index.html)?$/)) {
        return serve(res, "/www/index.html");
    }
    else if (req.url.match(/^\/styles.css$/)) {
        return serve(res, "/www/styles.css", "text/css");
    }
    else if (req.url.match(/^\/client.js$/)) {
        return serve(res, "/www/client.js", "text/javascript");
    }
    
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end("Not found");
    
});

server.listen(process.env.C9_PORT);
var io = require("socket.io").listen(server);
io.set("log level", 2);

io.sockets.on("connection", function(socket) {
    var id = socket.id;
    
    socket.on("cursor", function(data) {
        data.id = id;
        io.sockets.emit("cursor", data);
    });
    
    socket.on("click", function() {
        io.sockets.emit("click", id);
    });
    
    socket.on("disconnect", function() {
        io.sockets.emit("remove", id);
    });
});


// UTILS

function serve(res, path, mime) {
    fs.readFile(__dirname + path, function(err, data) {
        if (err)
            return error(res, err);

        res.writeHead(200, {"Content-Type": mime || "text/html"});
        res.end(data);
    });    
}

function error(res, err) {
    res.writeHead(500, {"Content-Type": "text/plain"});
    res.end("Internal server error: " + err);
    console.log(err);
}