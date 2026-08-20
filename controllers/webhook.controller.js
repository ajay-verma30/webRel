const pool = require("../db/conn");

const receiveWebhook = async (req, res) => {
  try {
    const event = req.stripeEvent;

    const result = await pool.query(
      `INSERT INTO webhook_events (
        provider,
        provider_event_id,
        event_type,
        request_id,
        raw_payload
      )
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (provider, provider_event_id)
        DO NOTHING
        RETURNING id`,
        [
          'stripe',
          event.id,
          event.type,
          req.requestId,
          event
        ]
    )

    if(result.rows.length === 0){
      console.log(
        `[${req.requestId}] Duplicate Stripe Event: ${event.id}`
      );
      return res.status(200).json({
        message: 'Webhook already processed',
        requestId: req.requestId,
        eventId: event.id
      });
    }

    console.log(
      `[${req.requestId}] Webhook saved: ${result.rows[0].id}`
    );

    res.status(200).json({
      message: 'Webhook verified and saved',
      requestId: req.requestId,
      webhookId: result.rows[0].id,
      eventId: event.id,
      eventType: event.type
    });

  } catch (error) {
    console.error(
      `[${req.requestId}] Webhook controller error:`,
      error.message
    );

    res.status(500).json({
      message: 'Webhook processing failed'
    });
  }
};

module.exports = {
  receiveWebhook
};
