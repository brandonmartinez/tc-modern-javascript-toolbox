// imports
////////////////////////////////////////////////////////////////////////////////////////
import Product from '../models/Product';

// data
////////////////////////////////////////////////////////////////////////////////////////

// This would normally come from a database or something
const products = [];

for (let p = 1; p < 6; p++) {
    const product = new Product();
    product.name = 'Sample Product 00' + p;
    product.price = p + 0.99;
    products.push(product);
}

// actions
////////////////////////////////////////////////////////////////////////////////////////

const list = (req, res) => {
    res.send(products);
};

const create = (req, res) => {
    // TODO: this could move into a ProductService
    const product = new Product();
    product.name = req.params.name;
    product.price = req.params.price;

    res.send(product);
};

export default {
    list,
    create
};