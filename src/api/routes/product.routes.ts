import express, { Request, Response } from 'express';
import ProductAdmFacadeFactory from '../../modules/product-adm/factory/facade.factory';

export const productRoutes = express.Router();

productRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const productFacade = ProductAdmFacadeFactory.create();
    
    await productFacade.addProduct({
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock
    });

    res.status(201).send({ message: 'Product created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating product' });
  }
});