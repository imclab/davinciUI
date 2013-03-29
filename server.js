
/**
 * Init server on port 4567, set to use static file handeling, set errorhandling
 */
var express = require("express"),
    server = express(),
    port = parseInt(process.env.PORT, 10) || 4567;
server.configure(function(){
  server.use(express.methodOverride());
  server.use(express.bodyParser());
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
    response.send({url: "images/ml.jpg"});


});
server.listen(port);


