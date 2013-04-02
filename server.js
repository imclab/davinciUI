
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
server.listen(port);


