require('dotenv').config();

const express = require('express');      //coming from our dependencies where we installed it
const app = express();                  //type of fx. middleware
const pies = require('./controllers/piecontrollers');
const user = require('./controllers/usercontroller');
const sequelize = require('./db');

sequelize.sync();
app.use(express.json());

app.use(require('./middleware/headers'));

app.use('/pies', pies);
app.use('/auth', user);

//app.get('/pies', (req, res) => res.send('I love pie'));
//app.use(express.static(__dirname + '/public'));
//console.log('dirname', __dirname);

//app.get('/', (req, res) => res.render('index'));

app.listen(3000, () => console.log(`app is listening on ${process.env.PORT}.`))

