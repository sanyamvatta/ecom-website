import express from 'express'
import productsRepo from '../repositories/products.js'
import cartsRepo from '../repositories/carts.js'
import cartShowTemplate from '../views/carts/show.js'


const router = express.Router()

// add to cart button
router.post('/cart/products', async (req, res) => {
  // Figure out the cart!
  let cart;
  if (!req.session.cartId) {
    // We don't have a cart, we need to create one,
    // and store the cart id on the req.session.cartId
    // property
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    // We have a cart! Lets get it from the repository
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  const exsistingItem = cart.items.find(item=> item.id === req.body.productId)
  
  if(exsistingItem){
    //increment quantity
    exsistingItem.quantity++;
  }else{
    //add product  to cart
    cart.items.push({id: req.body.productId, quantity:1})
  }
  await cartsRepo.update(cart.id,{
    items: cart.items
  })
  
  res.redirect('/cart');
});
//Recieve a get request to show cart items

router.get('/cart',async (req,res)=>{
  if(!req.session.cartId){
    return res.redirect('/')
  }

  const cart = await cartsRepo.getOne(req.session.cartId)

  for (let item of cart.items){
    const product = await productsRepo.getOne(item.id)
    
    item.product = product
  }
  res.send(cartShowTemplate({items: cart.items}))
})

router.post('/cart/:id/delete', async (req, res)=>{
  const itemId = req.params.id
  const cart = await cartsRepo.getOne(req.session.cartId)

  const items = cart.items.filter(item=>{
    if(item.id !== itemId){
      return true
    }
    else{
      return false
    }
  })


  await cartsRepo.update(req.session.cartId,{items})

  res.redirect('/cart')
})

//post to delete cart items


export default router