import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import authRouter from './routes/admin/auth.js'
import userProductsRouter from './routes/products.js';
import adminProductsRouter from './routes/admin/products.js'
import cartsRouter from './routes/carts.js';


const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['lkasld235j']
  })
);

app.use(authRouter)
app.use(adminProductsRouter)
app.use(userProductsRouter)
app.use(cartsRouter)


app.listen(3000, () => {
  console.log('Listening');
});
