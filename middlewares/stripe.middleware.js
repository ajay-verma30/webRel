const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const verifyStripeWebhook = (req,res,next) => {
    try{
        const signature = req.headers['stripe-signature'];

        if(!signature){
            return res.status(400).json({
                message:"Missing Stripe signature"
            });
        }

        const event =  stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        req.stripeEvent = event;
        next();
    }
    catch(err){
        console.error('Stripe webhook verification failed:', err.message);

    return res.status(400).json({
      message: 'Invalid Stripe webhook signature'
    });
    }
}


module.exports = {
  verifyStripeWebhook
};