// Dependencies
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// Reducers
import products from './products.js';

const appReducer = combineReducers({
    products,
    router: routerReducer
});

export default appReducer;