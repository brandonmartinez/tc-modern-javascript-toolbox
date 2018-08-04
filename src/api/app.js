// Importing modules needed by the application
////////////////////////////////////////////////////////////////////////////////////////
import express from 'express';
import { urlencoded, json } from 'body-parser';
import { join } from 'path';

// Routes
import ProductRoutes from './routes/ProductRoutes';

// Configuration
////////////////////////////////////////////////////////////////////////////////////////

// Set the web directory (allow override for dev) or use local public
var webDirectory = process.env.WEB_DIRECTORY || join(__dirname, './public/');

// Allow a port to be set, otherwise assume 80 for production purposes
var portNumber = process.env.PORT || 80;

// Create the Web App
////////////////////////////////////////////////////////////////////////////////////////
var app = module.exports = express();

// Middleware
//////////////////////////////////

// Configure body parsing
app.use(urlencoded({
  extended: false
}));

app.use(json());

// Static Site
//////////////////////////////////
app.use('/', express.static(webDirectory));

// API Routes
//////////////////////////////////
app.use('/api/products', ProductRoutes);

app.listen(portNumber, function () {
  // log statement for debugging
  // console.log('App started listening on port ' + portNumber + ' serving static files from ' + webDirectory + '!');
});