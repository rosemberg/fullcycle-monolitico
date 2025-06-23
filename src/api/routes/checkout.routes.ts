import express, { Request, Response } from 'express';
import ClientAdmFacadeFactory from '../../modules/client-adm/factory/client-adm.facade.factory';
import ProductAdmFacadeFactory from '../../modules/product-adm/factory/facade.factory';
import StoreCatalogFacadeFactory from '../../modules/store-catalog/factory/facade.factory';
import InvoiceFacadeFactory from '../../modules/invoice/factory/invoice.facade.factory';
import PaymentFacadeFactory from '../../modules/payment/factory/payment.facade.factory';

export const checkoutRoutes = express.Router();

checkoutRoutes.post('/', async (req: Request, res: Response) => {
  try {
    // Get facades
    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();

    // Validate client
    const client = await clientFacade.find({ id: req.body.clientId });
    if (!client) {
      return res.status(400).send({ message: 'Client not found' });
    }

    // Validate products and calculate total
    let total = 0;
    const products = [];

    for (const item of req.body.products) {
      // Check if product exists in catalog
      const product = await catalogFacade.find({ id: item.productId });

      // Check if product has stock
      const stock = await productFacade.checkStock({ productId: item.productId });
      if (stock.stock < item.quantity) {
        return res.status(400).send({ 
          message: `Insufficient stock for product ${product.name}` 
        });
      }

      // Add product to list with correct price from catalog
      products.push({
        id: product.id,
        name: product.name,
        price: product.salesPrice,
      });

      total += product.salesPrice * item.quantity;
    }

    // Process payment
    const payment = await paymentFacade.process({
      orderId: req.body.orderId || new Date().getTime().toString(),
      amount: total
    });

    if (payment.status !== 'approved') {
      return res.status(400).send({ message: 'Payment not approved' });
    }

    // Generate invoice
    const invoice = await invoiceFacade.generate({
      name: client.name,
      document: client.document,
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      items: products
    });

    res.status(200).send({
      id: invoice.id,
      invoiceId: invoice.id,
      status: payment.status,
      total: total,
      products: products
    });
  } catch (error) {
    // Only log errors when not in test environment
    if (process.env.NODE_ENV !== 'test') {
      console.error(error);
    }
    res.status(500).send({ message: 'Error processing checkout' });
  }
});
