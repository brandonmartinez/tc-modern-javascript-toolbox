// Dependencies
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createHashHistory';
const history = createHistory();

// Reducers
import reducer from './reducers';

// Routing helpers
import routing from './routing';

// Containers and Components
import ProductsContainer from './containers/products.js';

// This comes from Webpack.Define
// eslint-disable-next-line no-undef
const isDevelopment = IS_DEVELOPMENT;

// Middleware setup
const createMiddleware = () => {
    const middleware = [
        routerMiddleware(history),
        thunk
    ];
    const appliedMiddleware = applyMiddleware(...middleware);
    return appliedMiddleware;
};

const mergePersistedState = (initialState) => {
    const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : {};
    if (persistedState.my) {
        initialState.my = persistedState.my;
    }

    return initialState;
};

const subscribeStoreToPersistedLocalStorage = (store) => {
    store.subscribe(() => {
        // TODO: this should probably be reduced (hey, that's a redux joke!) to just store what matters
        localStorage.setItem('reduxState', JSON.stringify(store.getState()));
    });

    return store;
};

// Application Entry Point
class App extends React.Component {
    render() {
        let initialState = {
            // fill in any initial data
            products: {
                list: []
            }
        };

        initialState = mergePersistedState(initialState);

        const composer = (isDevelopment && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
        const composedStore = composer(createMiddleware())(createStore);
        const store = subscribeStoreToPersistedLocalStorage(composedStore(reducer, initialState));

        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Switch>
                        <Route exact path="/" component={ProductsContainer} />
                        <Route exact path={routing.products.default} component={ProductsContainer} />
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
    }
}

// Render to Dom
render(<App />, document.getElementById('modern-javascript-toolbox'));