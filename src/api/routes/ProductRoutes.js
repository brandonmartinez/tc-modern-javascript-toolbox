// imports
import express from 'express';
import ProductsController from '../controllers/ProductsController'

// setup router
const router = express.Router();

router.get('/', ProductsController.list);
router.post('/', ProductsController.create);

export default router;