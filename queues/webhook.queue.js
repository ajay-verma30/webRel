const {Queue} = require('bullmq');

const redisConnection = require('../config/redis');

const webhookQueue = new Queue('webhook-events', {
    connection: redisConnection
});

module.exports = webhookQueue;