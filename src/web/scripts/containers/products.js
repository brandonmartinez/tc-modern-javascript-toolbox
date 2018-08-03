// Dependencies
import { connect } from 'react-redux';

// Components
import ProductsComponent from '../components/products/index.jsx';

// Actions
import * as ProductActions from '../actions/products.js';

// Mapping (industries would be changed after one is selected)
const mapStateToProps = (state, ownProps) => {
    return ({
        history: ownProps.history,
        products: state.products
    });
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    addProduct: (name, quantity) => {
        dispatch(ProductActions.addProduct(name, quantity, ownProps));
    }
});

const ProductsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductsComponent);

export default ProductsContainer;