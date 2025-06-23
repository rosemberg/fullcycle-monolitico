import express, { Express } from 'express';
import { productRoutes } from './routes/product.routes';
import { clientRoutes } from './routes/client.routes';
import { checkoutRoutes } from './routes/checkout.routes';
import { invoiceRoutes } from './routes/invoice.routes';

export const app: Express = express();

app.use(express.json());

// Routes
app.use('/products', productRoutes);
app.use('/clients', clientRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/invoice', invoiceRoutes);

export default app;