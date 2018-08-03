import ProductsEnums from '../enums/products';

export const addProduct = (name, quantity, ownProps) => ({
    type: ProductsEnums.actions.addProduct,
    name,
    quantity,
    ownProps
});

export function getProducts() {
    return dispatch => {
        dispatch(getProductsBegin());
        return fetch("/api/products")
            .then(handleErrors)
            .then(res => res.json())
            .then(json => {
                dispatch(getProductsSuccess(json));
                return json;
            })
            .catch(error => dispatch(getProductsFailure(error)));
    };
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
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