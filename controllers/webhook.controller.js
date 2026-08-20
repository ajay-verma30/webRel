const webhookQueue = require('../queues/webhook.queue');

const receiveWebhook = async (req, res) => {
  try {
    const event = req.stripeEvent;

    console.log(
      `[${req.requestId}] Stripe Event verified`
    );

    console.log(
      `[${req.requestId}] Event ID: ${event.id}`
    );

    console.log(
      `[${req.requestId}] Event Type: ${event.type}`
    );

    const job = await webhookQueue.add(
      'process-webhook',
      {
        provider: 'stripe',
        eventId: event.id,
        eventType: event.type,
        requestId: req.requestId,
        payload: event
      },
      {
        jobId: `stripe-${event.id}`
      }
    );

    console.log(
      `[${req.requestId}] Webhook queued. Job ID: ${job.id}`
    );

    return res.status(200).json({
      message: 'Webhook accepted',
      requestId: req.requestId,
      jobId: job.id,
      eventId: event.id,
      eventType: event.type
    });

  } catch (error) {
    console.error(
      `[${req.requestId}] Webhook controller error:`,
      error.message
    );

    return res.status(500).json({
      message: 'Webhook processing failed'
    });
  }
};

module.exports = {
  receiveWebhook
};