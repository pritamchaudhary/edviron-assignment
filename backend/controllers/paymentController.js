const axios = require('axios');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');
const WebhookLog = require('../models/WebhookLog');

// @desc    Create a payment request using the dev-vanilla API
// @route   POST /api/payments/create-payment
exports.createPayment = async (req, res) => {
  const { order_amount, student_info } = req.body;

  if (!order_amount || !student_info) {
    return res.status(400).json({ success: false, message: 'Missing required payment details' });
  }

  const school_id = process.env.SCHOOL_ID;
  const amount = String(order_amount); // Amount must be a string
  const callback_url = process.env.CALLBACK_URL;

  if (!school_id || !process.env.PG_KEY || !process.env.API_KEY || !callback_url) {
      console.error('Missing critical environment variables for payment creation.');
      return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }

  try {
    // 1. Create the JWT payload for the 'sign' field
    const signPayload = { school_id, amount, callback_url };
    const sign = jwt.sign(signPayload, process.env.PG_KEY);

    // 2. Prepare the request body for the external API
    const requestBody = { school_id, amount, callback_url, sign };

    // 3. Make the API call to the correct endpoint with a Bearer token
    const apiResponse = await axios.post(
      'https://dev-vanilla.edviron.com/erp/create-collect-request',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_KEY}`,
        },
      }
    );

    const { collect_request_id, collect_request_url } = apiResponse.data;

    // 4. Save the order details in our database for tracking
    const newOrder = await Order.create({
      school_id,
      trustee_id: 'NA',
      student_info,
      order_amount: Number(amount),
      custom_order_id: collect_request_id,
    });

    await OrderStatus.create({
      collect_id: newOrder._id,
      custom_order_id: collect_request_id,
      order_amount: Number(amount),
      status: 'Pending',
    });

    // 5. Send the payment URL back to the frontend
    res.status(200).json({
      success: true,
      paymentUrl: collect_request_url,
    });

  } catch (error) {
    console.error('Payment creation failed:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: 'Failed to create payment' });
  }
};

// @desc    Check Payment Status AND update the database
// @route   GET /api/payments/status/:collectId
exports.checkPaymentStatus = async (req, res) => {
    const { collectId } = req.params;
    const school_id = process.env.SCHOOL_ID;

    try {
        const signPayload = { school_id, collect_request_id: collectId };
        const sign = jwt.sign(signPayload, process.env.PG_KEY);
        const url = `https://dev-vanilla.edviron.com/erp/collect-request/${collectId}?school_id=${school_id}&sign=${sign}`;

        const apiResponse = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${process.env.API_KEY}` },
        });

        const latestStatus = apiResponse.data.status === 'SUCCESS' ? 'Success' : 'Failed';

        const orderStatus = await OrderStatus.findOne({ custom_order_id: collectId });
        if (!orderStatus) {
            return res.status(404).json({ success: false, message: 'Transaction not found in our database.' });
        }
        
        orderStatus.status = latestStatus;
        await orderStatus.save();

        res.status(200).json({ success: true, data: orderStatus });

    } catch (error) {
        console.error('Failed to check payment status:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Failed to check payment status' });
    }
};

// @desc    Handle incoming webhook
// @route   POST /api/payments/webhook
exports.handleWebhook = async (req, res) => {
    const payload = req.body;
    
    try {
        await WebhookLog.create({ payload });
        
        const order_info = payload.order_info;
        if (!order_info) {
            return res.status(400).json({ success: false, message: 'Invalid webhook: missing order_info' });
        }

        const custom_order_id = order_info.order_id;
        if (!custom_order_id) {
            return res.status(400).json({ success: false, message: 'Invalid webhook: missing order_id' });
        }

        const order = await Order.findOne({ custom_order_id: custom_order_id });
        if (order && order_info.gateway) {
            order.gateway_name = order_info.gateway;
            await order.save();
        }

        const orderStatus = await OrderStatus.findOne({ custom_order_id: custom_order_id });
        if (!orderStatus) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        orderStatus.status = order_info.status === 'SUCCESS' ? 'Success' : 'Failed';
        orderStatus.transaction_amount = order_info.transaction_amount;
        orderStatus.payment_mode = order_info.payment_mode;
        orderStatus.payment_message = order_info.Payment_message;
        orderStatus.bank_reference = order_info.bank_reference;
        orderStatus.payment_time = new Date(order_info.payment_time);
        
        await orderStatus.save();
        
        res.status(200).json({ success: true, message: 'Webhook received' });
    } catch (error) {
        console.error('Error handling webhook:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};