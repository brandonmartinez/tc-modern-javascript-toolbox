# The Modern JavaScript Toolbox: 20 Years in the Making!

## Part 3: Building the Application

### Summary

Now that our project has a place to exist, it's time to start building it! We'll utilize some of the latest-and-greatest tools available in the JavaScript world, as well as work through some practical tips on how to plan for scaling to medium-and-larger-sized applications.

### Steps

1. Install packages for building the application:
    1. SASS/CSS Modules: `npm install -D autoprefixer node-sass`
    2. ESLint Modules: `npm install -D eslint eslint-config-defaults eslint-plugin-json eslint-plugin-react`
    3. Babel modules: `npm install -D babel-cli babel-core babel-eslint babel-loader babel-plugin-transform-object-rest-spread babel-preset-env babel-preset-react`
    4. Webpack Modules: `npm install -D expose-loader imports-loader uglifyjs-webpack-plugin webpack webpack-merge webpack-stream`
    5. Gulp modules: `npm install -D gulp gulp-cache-buster gulp-clean gulp-concat gulp-eslint gulp-hasher gulp-plumber gulp-postcss gulp-rename gulp-sass gulp-sourcemaps gulp-stats gulp-webserver pump run-sequence`
2. Install packages for the API/Web Server: `npm install express`
3. Install packages for the React web app:
    1. React Modules: `npm install react react-dom react-helmet react-router-dom history`
    2. Redux Modules: `npm install redux react-redux react-router-redux`
    3. AJAX Modules: `npm install axios`
    4. Bootstrap and Styling Modules: `npm install bootstrap`
4. Create API app:
    * Main app file: `mkdir -p src/api && touch src/api/app.js`
    * Controller: `mkdir -p src/api/controllers && touch src/api/controllers/ProductsController.js`
    * Routes: `mkdir -p src/api/routes && touch src/api/routes/ProductRoutes.js`
    * Model: `mkdir -p src/api/models && touch src/api/models/Product.js`
5. Create React shell: `mkdir -p src/web/html && touch src/web/html/index.html && mkdir -p src/web/scripts && touch src/web/scripts/app.jsx`
6. Create Gulpfile.js: `touch Gulpfile.js`
7. Create webpack.js: `touch webpack.js`
8. Create local configurations for tooling: `touch .babelrc && touch .eslintrc`
9. Fill in application

### Notes and References

JavaScript Task Runners:
* Gulp
* Grunt
* Webpack

Modern Frontend Frameworks:
* React
* Angular
* Vue.js