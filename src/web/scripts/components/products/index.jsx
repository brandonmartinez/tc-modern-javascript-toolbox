// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import MetaContainer from '../../shared/meta.jsx';
import { Container, Row, Col } from 'reactstrap';
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
            <Container>
                <MetaContainer title={'Products'} />
                <Row>
                    <Col md="4">
                        <h1>Add New Product</h1>
                        <ProductForm addProduct={this.props.addProduct} />
                    </Col>
                    <Col md="8">
                        <h1>Current Products</h1>
                        {
                            groupedProducts.map((group) =>
                                <ProductCardDeck key={'product-group-' + group[0].id} group={group} />
                            )
                        }
                    </Col>
                </Row>
            </Container>
        );
    }
}

Products.propTypes = {
    products: PropTypes.object,
    addProduct: PropTypes.func,
    getProducts: PropTypes.func
};

export default Products;