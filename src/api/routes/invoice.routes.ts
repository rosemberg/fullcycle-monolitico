import express, { Request, Response } from 'express';
import InvoiceFacadeFactory from '../../modules/invoice/factory/invoice.facade.factory';

export const invoiceRoutes = express.Router();

invoiceRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const invoiceFacade = InvoiceFacadeFactory.create();

    const invoice = await invoiceFacade.find({
      id: req.params.id
    });

    res.status(200).send(invoice);
  } catch (error) {
    // Only log errors when not in test environment
    if (process.env.NODE_ENV !== 'test') {
      console.error(error);
    }
    res.status(500).send({ message: 'Error finding invoice' });
  }
});
