console.log("hello node");

var express = require('express');
var app = express();

for (var i=0;i<6;i++){
	console.log(i);
}

app.use(express.static('/public'));
// http://expressjs.com/en/starter/basic-routing.html


app.get("/", function (request, response) {
	//response.send('ohmg');

	response.sendFile(__dirname + '/public/index.html');
	response.end();
});


var listener = app.listen(process.env.PORT, function () {
  console.log('Your H app is listening on port ' + listener.address().port);
});
