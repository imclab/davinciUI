
/**
 * Init server on port 4567, set to use static file handeling, set errorhandling
 */
var express = require("express"),
    server = express(),
    fs = require('fs');
    port = parseInt(process.env.PORT, 10) || 4567;
server.configure(function(){
  server.use(express.methodOverride());
  server.use(express.bodyParser({uploadDir: 'public/uploads'}));
  server.use(express.static(__dirname + '/public'));
  server.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  server.use(server.router);
});
/*
 * redirects to Index.html
 */
server.get("/", function(request, response) {
  response.redirect("/example.html");
});
/*
 * POST from Client
 */
server.post('/file', function(request, response) {
    console.log(JSON.stringify(request.files));
    console.log(JSON.stringify(request.body));

    var uploadedFile = request.files.file;
    var tmpPath = uploadedFile.path;
    var name = uploadedFile.name;
    var targetPath = 'public/uploads/' + name;

    fs.rename(tmpPath, targetPath, function (err){
        if(err) {throw err;}
        fs.unlink(tmpPath, function (){
            console.log("file uploaded");
            response.send({url: 'uploads/' + name, tooltip: request.body.desc});
        });

    });

});
//TODO
server.post('/login', function (request, response) {


});
//TODO
server.get('/logout', function (requst, response) {
    req.session.destroy(function (){
        res.direct('/example.html');
    });

});

server.listen(port);
//TODO
function restrict(req, res, next) {
    if(req.session.user) {
        next();
    }
    else {
        req.session.error = 'Access Denied';
        res.redirect('/example.html'); //TODO
    }

}
//TODO
function auth(userName, pass, callback) {
    //TODO query to tb
    hash(pass, salt function (err, hash){
        if(err){return callback(new Error("user not found"));}
        if(hash === user.hash) {return callback(null, user);}
        callback(new Error("invalid password"));
    });
}

