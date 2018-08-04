// imports
////////////////////////////////////////////////////////////////////////////////////////
import Product from '../models/Product';

// data
////////////////////////////////////////////////////////////////////////////////////////

// This would normally come from a database or something
const products = [];

for (let p = 1; p < 6; p++) {
    const product = new Product();
    product.id = p;
    product.name = 'Sample Product ' + p;
    product.price = p + 0.99;
    product.quantity = Math.floor(2.5 * p * 10);
    product.description = 'This is a sample product to load an initial list.';
    products.push(product);
}

// actions
////////////////////////////////////////////////////////////////////////////////////////

const list = (req, res) => {
    res.send(products);
};

const create = (req, res) => {
    if (req.body && req.body.name) {
        // TODO: this could move into a ProductService
        const product = new Product();
        product.id = products.length + 1;
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        product.quantity = req.body.quantity;
        products.push(product);

        res.send(product);
    }
};

export default {
    list,
    create
};