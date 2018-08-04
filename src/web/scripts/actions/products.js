import ProductsEnums from '../enums/products';

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export function getProducts() {
    return dispatch => {
        dispatch(getProductsBegin());
        return fetch('/api/products')
            .then(handleErrors)
            .then(res => res.json())
            .then(json => {
                dispatch(getProductsSuccess(json));
                return json;
            })
            .catch(error => dispatch(getProductsFailure(error)));
    };
}

export const getProductsBegin = (ownProps) => ({
    type: ProductsEnums.actions.getProductsBegin,
    ownProps
});

export const getProductsSuccess = (products, ownProps) => ({
    type: ProductsEnums.actions.getProductsSuccess,
    payload: {
        products
    },
    ownProps
});

export const getProductsFailure = (error, ownProps) => ({
    type: ProductsEnums.actions.getProductsFailure,
    payload: {
        error
    },
    ownProps
});

export function addProduct(product) {
    return dispatch => {
        return fetch('/api/products',
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                redirect: 'follow',
                referrer: 'no-referrer',
                body: JSON.stringify(product)
            })
            .then(handleErrors)
            .then(() => {
                dispatch(getProducts());
                return product;
            })
            .catch(error => dispatch(addProductFailure(error)));
    };
}

export const addProductFailure = (error, ownProps) => ({
    type: ProductsEnums.actions.addProductFailure,
    payload: {
        error
    },
    ownProps
});