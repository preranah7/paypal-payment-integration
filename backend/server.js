import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import paypal from '@paypal/checkout-server-sdk';

// Configure environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',  // Vite frontend port
  credentials: true
}));
app.use(express.json()); // Parse JSON request bodies

// ========== PayPal Configuration ==========
// Create PayPal environment (Sandbox for testing, Live for production)
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  // SandboxEnvironment = Test mode with fake money
  // LiveEnvironment = Real money transactions (for production)
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

// Create PayPal HTTP client to make API requests
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

// ========== API Endpoints ==========

/**
 * CREATE ORDER
 * Purpose: Initialize payment and get an Order ID
 * Called when: User clicks "Pay with PayPal" button
 * Returns: Order ID that PayPal uses to track this transaction
 */
app.post('/create-paypal-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    console.log('Request received:', { amount, currency }); // Debug log

    // Create request object for PayPal's Create Order API
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation"); // Get full response details
    
    // Define order details
    request.requestBody({
      intent: 'CAPTURE', // Capture payment immediately (not authorize only)
      purchase_units: [{
        amount: {
          currency_code: currency || 'USD',
          value: amount.toString() // Must be string
        },
        description: 'Test Payment Product'
      }]
    });

    // Execute request to PayPal
    const order = await client().execute(request);
    
    console.log('Order created:', order.result.id); // Success log
    
    // Send Order ID back to frontend
    res.json({ 
      id: order.result.id,
      status: order.result.status
    });
    
  } catch (error) {
    console.error('Create Order Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * CAPTURE PAYMENT
 * Purpose: Finalize payment after user approves in PayPal popup
 * Called when: User completes payment in PayPal interface
 * Returns: Payment details and confirmation
 */
app.post('/capture-paypal-order', async (req, res) => {
  try {
    const { orderID } = req.body;

    console.log('Capture request:', orderID); // Debug log

    // Create request to capture the order
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    // Execute capture
    const capture = await client().execute(request);
    
    console.log('Payment captured:', capture.result.id); // Success log
    
    // Extract important details
    const captureData = {
      success: true,
      orderID: capture.result.id,
      status: capture.result.status, // COMPLETED if successful
      payer: {
        email: capture.result.payer.email_address,
        name: capture.result.payer.name.given_name + ' ' + capture.result.payer.name.surname
      },
      amount: capture.result.purchase_units[0].payments.captures[0].amount
    };
    
    // At this point, save to database:
    // - Order ID
    // - Payment ID
    // - Customer details
    // - Amount paid
    // - Timestamp
    
    res.json(captureData);
    
  } catch (error) {
    console.error('Capture Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PayPal Payment Server Running',
    sdk: '@paypal/checkout-server-sdk',
    environment: 'Sandbox',
    envVars: {
      clientId: !!process.env.PAYPAL_CLIENT_ID,
      clientSecret: !!process.env.PAYPAL_CLIENT_SECRET
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nBackend server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`PayPal Environment: Sandbox`);
  console.log(`Module Type: ES Modules\n`);
});
