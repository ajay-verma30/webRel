const IORedis = require('ioredis')

const redisConnection = new IORedis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null
});

redisConnection.on('connect', ()=>{
    console.log('REDIS connected')
});

redisConnection.on('error', (error)=>{
    console.log('Redis connection Error:', error.message);
})

module.exports = redisConnection;