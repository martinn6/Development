var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3001);

function getRandomNum() {
	var stuff = {};
	stuff.randomNum = Math.floor((Math.random() * 10) + 1);
	return stuff;
}

app.get('/',function(req,res){
  res.render('home')
});


app.get('/todo',function(req,res,next){
  var context = {};
  //If there is no session, go to the main page.
  if(!req.session.name){
    res.render('login', context);
    return;
  }
  context.name = req.session.name;
  context.toDoCount = req.session.toDo.length || 0;
  context.toDo = req.session.toDo || [];
  console.log(context.toDo);
  res.render('todolist',context);
});

/*
app.post('/todo',function(req,res){
  var context = {};
  console.log("todo");

  if(req.body['New List']){
    req.session.name = req.body.name;
    req.session.toDo = [];
    req.session.curId = 0;
  }

  //If there is no session, go to the main page.
  if(!req.session.name){
    res.render('login', context);
    return;
  }

  if(req.body['Add Item']){
    req.session.toDo.push({"name":req.body.name, "id":req.session.curId});
    req.session.curId++;
  }

  if(req.body['Done']){
    req.session.toDo = req.session.toDo.filter(function(e){
      return e.id != req.body.id;
    })
  }

  context.name = req.session.name;
  context.toDoCount = req.session.toDo.length;
  context.toDo = req.session.toDo;
  console.log(context.toDo);
  res.render('todolist',context);
});
*/

app.get('/randomnum',function(req,res){
  res.render('randomnum', getRandomNum());
});

app.get('/sessionsTest',function(req,res){
  var context = {};
  context.count = req.session.count || 0;
  req.session.count = context.count + 1;
  res.render('sessionsTest', context);
});

app.get('/other-page',function(req,res){
  res.render('other-page');
});

app.get('/getpost',function(req,res){
  var pArray = [];
  for (var p in req.query){
    pArray.push({'name':p,'value':req.query[p]});
  }
  var toPass = {};
  toPass.params = pArray;
  res.render('getresponse', toPass);
});

app.post('/getpost', function(req,res){
  var postArray = [];
  for (var p in req.body){
    postArray.push({'name':p,'value':req.body[p]});
  }
  var toPass = {};
  toPass.params = postArray;
  res.render('postresponse', toPass);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});
 
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});