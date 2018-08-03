#!/bin/bash

# Install packages for building the application
###########################################################################

# SASS/CSS Modules
npm install -D autoprefixer node-sass

# ESLint Modules
npm install -D eslint eslint-config-defaults eslint-plugin-json eslint-plugin-react

# Babel modules
npm install -D babel-cli babel-core babel-eslint babel-loader babel-plugin-transform-object-rest-spread babel-preset-env babel-preset-react

# Webpack Modules
npm install -D expose-loader imports-loader uglifyjs-webpack-plugin webpack webpack-merge webpack-stream

# Gulp modules
npm install -D gulp gulp-cache-buster gulp-clean gulp-concat gulp-eslint gulp-hasher gulp-plumber gulp-postcss gulp-rename gulp-sass gulp-sourcemaps gulp-stats gulp-webserver pump run-sequence

# Install packages for the API/Web Server
###########################################################################

npm install express

# Install packages for the React web app:
###########################################################################

# React Modules
npm install react react-dom react-helmet react-router-dom history

# Redux Modules
npm install redux react-redux react-router-redux@next immutability-helper

# AJAX Modules
npm install axios

# Bootstrap and Styling Modules
npm install jquery popper bootstrap reactstrap normalize.css

# Create API app
###########################################################################

# Main app file
mkdir -p src/api && touch src/api/app.js

# Controller
mkdir -p src/api/controllers && touch src/api/controllers/ProductsController.js

# Routes
mkdir -p src/api/routes && touch src/api/routes/ProductRoutes.js

# Model
mkdir -p src/api/models && touch src/api/models/Product.js