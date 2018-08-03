// imports
import Product from '../models/Product'

// This would normally come from a database or something
const products = [];

const list = (req, res) => {
    res.send(products);
};

const create = (req, res) => {
    const product = new Product();
    product.name = req.params.name;
    product.price = req.params.price;

    res.send(product);
}

export default {
    list,
    create
};