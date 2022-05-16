const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const teamRouter = require('./routes/team');
const calcRouter = require('./routes/calculator');


const app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/', indexRouter);
app.use('/team', teamRouter);
app.use('/calculator', calcRouter);

app.listen(app.get('port'), () => {
  console.log('App listening on port ' + app.get('port'));
});