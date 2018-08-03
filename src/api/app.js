// Importing modules needed by the application
////////////////////////////////////////////////////////////////////////////////////////
import express from 'express';
import { urlencoded, json } from 'body-parser';
import { join } from 'path';

// Routes
import ProductRoutes from './routes/ProductRoutes';

// Configuration
////////////////////////////////////////////////////////////////////////////////////////

// Allow the webDirectory to be specified, otherwise we assume that it's going to be in the "tmp" directory for local dev purposes
var webDirectory = process.env.WEB_DIRECTORY || join(__dirname, '../../.tmp/web/');

// Allow a port to be set, otherwise assume 3000 for local dev purposes
var portNumber = process.env.PORT || 3000;

// Create the Web App
////////////////////////////////////////////////////////////////////////////////////////
var app = module.exports = express();

// Configure body parsing
app.use(urlencoded({
  extended: false
}));

app.use(json());

app.use('/products', ProductRoutes);

app.use(express.static(webDirectory));

app.listen(portNumber, function () {
  console.log('App started listening on port ' + portNumber + ' serving from ' + webDirectory + '!');
});