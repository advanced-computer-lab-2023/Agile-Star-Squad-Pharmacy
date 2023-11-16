const stripe = require('stripe')('sk_test_51O9YaUIM4ONA4Exm7TJdbad0dX5MROUOQMOHOzBf4t7wWoCiC5zrfgIxdAphSnEoVirAACoGLU4MOos1b4qnPQgV001zaZC11m');
const express = require('express');

const YOUR_DOMAIN = 'https://www.youtube.com';

const addPayment = async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 'price_1OBJOeIM4ONA4ExmUdFcnKOT',
            quantity: 1,
          },{
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: 'price_1OBJOeIM4ONA4ExmUdFcnKOT',
            quantity: 2,
          }
        ],
        mode: 'payment',
        
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      });
    
      res.redirect(303, session.url);
}
// const customer = await stripe.customers.create({
//   email: '{{CUSTOMER_EMAIL}}',
//   name: '{{CUSTOMER_NAME}}',
//   shipping: {
//     address: {
//       city: 'Brothers',
//       country: 'US',
//       line1: '27 Fredrick Ave',
//       postal_code: '97712',
//       state: 'CA',
//     },
//     name: '{{CUSTOMER_NAME}}',
//   },
//   address: {
//     city: 'Brothers',
//     country: 'US',
//     line1: '27 Fredrick Ave',
//     postal_code: '97712',
//     state: 'CA',
//   },
// });
module.exports = {
  addPayment,
};
// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys



// This is your test secret API key.