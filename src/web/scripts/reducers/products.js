import update from 'immutability-helper';
import ProductsEnums from '../enums/products';

const products = (state = {}, action) => {
    switch (action.type) {
        case ProductsEnums.actions.getProductsBegin:
            return {
                ...state,
                loading: true,
                error: null
            };
        case ProductsEnums.actions.getProductsSuccess:
            return {
                ...state,
                loading: false,
                list: action.payload.products
            };
        case ProductsEnums.actions.getProductsFailure:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                list: []
            };
        default:
            return state;
    }
};

export default products;