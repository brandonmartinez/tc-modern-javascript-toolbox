// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import { CardDeck } from 'reactstrap';
import Product from './product.jsx';

// Containers and Components

const ProductCardDeck = ({ group }) => (
    <CardDeck className="card-deck mb-3 text-center">
        {
            group.map(
                (product) => (
                    <Product key={'product-' + product.id} product={product} />
                )
            )
        }
    </CardDeck>
);

// Todo: fill in proper shape
Product.propTypes = {
    group: PropTypes.object
};

export default ProductCardDeck;