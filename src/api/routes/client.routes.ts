import express, { Request, Response } from 'express';
import ClientAdmFacadeFactory from '../../modules/client-adm/factory/client-adm.facade.factory';
import Address from '../../modules/@shared/domain/value-object/address';

export const clientRoutes = express.Router();

clientRoutes.post('/', async (req: Request, res: Response) => {
  try {
    const clientFacade = ClientAdmFacadeFactory.create();
    
    const address = new Address(
      req.body.street,
      req.body.number,
      req.body.complement,
      req.body.city,
      req.body.state,
      req.body.zipCode
    );

    await clientFacade.add({
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: address
    });

    res.status(201).send({ message: 'Client created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating client' });
  }
});