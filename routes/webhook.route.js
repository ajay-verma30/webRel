const express = require('express');
const router = express.Router();

const {
  receiveWebhook
} = require('../controllers/webhook.controller');

const {
  verifyStripeWebhook
} = require('../middlewares/stripe.middleware');


router.post(
  '/:provider',
  express.raw({ type: 'application/json' }),
  verifyStripeWebhook,
  receiveWebhook
);

module.exports = router;