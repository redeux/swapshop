const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const models = require('./models');

const app = express();
const PORT = process.env.PORT || 8080;

// For BodyParser
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

// For Passport
app.use(session({
  secret: 'abc123',
  resave: true,
  saveUninitialized: true,
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
  extname: '.hbs',
}));
app.set('view engine', '.hbs');

// Routes
const authRoute = require('./routes/auth')(app);

app.get('/', (req, res) => {
  res.send('Welcome to Passport with Sequelize');
});

// Sync  database and start server
models.sequelize.sync().then(() => {
  console.log('Database connection successful');
  app.listen(PORT, (err) => {
    if (!err) console.log(`Started Express Server on port: ${PORT}`);
    else console.log(`Failed to start server due to an error: ${err}`);
  });
}).catch((err) => {
  console.log(`Something went wrong with the Database: ${err}`);
});
