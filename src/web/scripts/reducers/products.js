import update from 'immutability-helper';
import ProductsEnums from '../enums/products';

const products = (state = {}, action) => {
    switch (action.type) {
        case ProductsEnums.actions.addProduct:
            return update(state, {
                list: {
                    $push: {
                        name: action.name,
                        quantity: action.quantity
                    }
                }
            });
        default:
            return state;
    }
};

export default products;