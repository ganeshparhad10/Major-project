const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const connectDB = require('./conn');
const app = express();
const hbs=require('hbs')
const path =require ('path')

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
const static_path = path.join(__dirname, './public');
const template_path = path.join(__dirname, './templates/views');
const partial_path = path.join(__dirname, './templates/partials');

app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partial_path);

// Routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/services')); // Add services routes

// Add root route
app.get('/', (req, res) => {
  res.redirect('/services'); // Redirect to services page or any other default page
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
