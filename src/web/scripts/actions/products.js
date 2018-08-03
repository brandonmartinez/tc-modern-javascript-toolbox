import ProductsEnums from '../enums/products';

export const addProduct = (name, quantity, ownProps) => ({
    type: ProductsEnums.actions.addProduct,
    name,
    quantity,
    ownProps
});

export const showProducts = (ownProps) => ({
    type: ProductsEnums.actions.addProduct,
    ownProps
});