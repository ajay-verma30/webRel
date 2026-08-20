const express  = require('express');
const morgan = require('morgan');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();
const pool = require('./db/conn');
const app = express();
const webhookRoutes = require('./routes/webhook.route');



app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || crypto.randomUUID();

  res.setHeader('X-Request-ID', req.requestId);

  next();
});

morgan.token('request-id', (req) => {
  return req.requestId;
});


app.use(
  morgan(
    ':request-id :remote-addr :method :url :status :response-time ms :user-agent'
  )
);

app.get('/', (req,res)=>{
    res.status(200).json({message:"Working"})
})


// sample api to test
app.post('/api/payments', (req,res)=>{
    res.status(201).json({
        message: "payment created"
    });
});

app.get('/api/payments-try', (req,res)=>{
    res.status(500).json({
        message: "Failed Payments"
    });
});



//actual apis
app.use('/api/webhooks/', webhookRoutes);
app.use(express.json());


const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
})