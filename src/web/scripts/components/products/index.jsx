// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import MetaContainer from '../../shared/meta.jsx';
import { CardDeck } from 'reactstrap';
import ProductCardDeck from './productCardDeck.jsx';
import ProductForm from './productForm.jsx';

class Products extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getProducts();
    }

    render() {
        const sortedProductList = _.orderBy(this.props.products.list, ['name'], ['asc']);
        const groupedProducts = _.chunk(sortedProductList, 3);

        return (
            <React.Fragment>
                <MetaContainer title={'Products'} />
                {
                    groupedProducts.map((group) =>
                        <ProductCardDeck key={'product-group-' + group[0].id} group={group} />
                    )
                }
                <ProductForm addProduct={this.props.addProduct} />
            </React.Fragment>
        );
    }
}

Products.propTypes = {
    products: PropTypes.object,
    addProduct: PropTypes.func,
    getProducts: PropTypes.func
};

export default Products;