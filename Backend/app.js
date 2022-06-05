
// Imports
const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());

// Routes
const indexRouter = require('./routes/indexRouter');
const teamRouter = require('./routes/teamRouter');
const calcRouter = require('./routes/calculatorRouter');
app.use('/', indexRouter);
app.use('/team', teamRouter);
app.use('/calculator', calcRouter);


// Static Files
app.use(express.static('public'));
//app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));


// Views
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// Listen on port 3000
app.listen(app.get('port'), () => {
  console.info('App listening on port ' + app.get('port'));
});