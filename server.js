console.log("hello node");

var path = require('path');
var express = require('express');
var app = express();

for (var i=0;i<6;i++){
	console.log(i);
}

//app.use(express.static('/public'));
// http://expressjs.com/en/starter/basic-routing.html


app.get("/", function (request, res) {
	//response.send('ohmg');

//	response.sendFile(__dirname + '/index.html');
		//response.send(__dirname + '/index.html');
//	response.sendFile('public/index.html');
//	response.sendFile('/index.html');
//	response.sendFile('./index.html');
//	response.sendFile('/index.html');
	//res.set('Content-Type', 'text/html');
	res.sendFile(__dirname +'/index.html');
	
});


var listener = app.listen(process.env.PORT, function () {
  console.log('Your H app is listening on port ' + listener.address().port);
});
