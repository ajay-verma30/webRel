require('dotenv').config();
const {Worker} = require('bullmq');
const redisConnection = require('../config/redis');
const pool = require('../db/conn');

const webhookWorker = new Worker(
    'webhook-events',
    async(job) =>{
        const {
            provider,
            eventId,
            eventType,
            requestId,
            payload
        } = job.data;
        console.log(
  `[${requestId}] Processing webhook job: ${job.id}`
);

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
        provider,
        eventId,
        eventType,
        requestId,
        payload
      ]
    );

      if (result.rows.length === 0) {
      console.log(
        `[${requestId}] Duplicate webhook event: ${eventId}`
      );

      return;
    }

    const webhookId = result.rows[0].id;

     console.log(
      `[${requestId}] Webhook saved to DB: ${webhookId}`
    );

    return {
        webhookId,
        eventId
    };
    },
    {
        connection: redisConnection
    }
);

webhookWorker.on('completed', (job) => {
  console.log(
    `Webhook job completed: ${job.id}`
  );
});

webhookWorker.on('failed', (job, error) => {
  console.error(
    `Webhook job failed: ${job?.id}`,
    error.message
  );
});

console.log('Webhook worker started');