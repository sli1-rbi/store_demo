require('dotenv').config()
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.static('public'));


app.get('/products',  async function(_request, response){
  //ask stripe for all of the products
  
  const products = await stripe.products.list({
    limit: 100,
  });
  //ask stripe for all of the prices
  const prices = await stripe.prices.list({
    limit: 100,
  });
  //associate products w/ prices
  prices.data.forEach(price => {
    const theAssociatedProduct = products.data.find(product => product.id === price.product); //reference var, not a duplicate
    theAssociatedProduct.price = price //creating a new key called 'price' and assigning the matched value
  })
  //clean up object
  const cleanedUpProducts = products.data.map(product => {
    return {
      name: product.name,
      description: product.description,
      image: product.images[0],
      category: product.metadata.category,
      currency: product.price.currency,
      price_cents: product.price.unit_amount,
      price_id: product.price.id,
    }
  });

  //send back a list of all the product-prices
  response.json(cleanedUpProducts);
})

app.listen(3000, () => console.log("server is on!"))