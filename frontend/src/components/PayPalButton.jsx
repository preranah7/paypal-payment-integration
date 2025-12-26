import { useState, useEffect } from 'react';

const PayPalButton = () => {
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  // ========== STEP 1: Load PayPal SDK ==========
  useEffect(() => {
    const loadPayPalScript = () => {
      // Check if script already exists
      if (document.querySelector('script[src*="paypal.com/sdk/js"]')) {
        setSdkReady(true);
        return;
      }

      const script = document.createElement('script');
      
      //  REPLACE WITH YOUR CLIENT ID FROM PAYPAL DASHBOARD
      const CLIENT_ID = 'ASzqtwvuEznS9M9x-66Czcm9aGtMG6kLvR0syAjPMOdrDKbq3zn7FMfLs0STBeu0arf1LPTEA20D_VHf';
      script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD`;
      
      script.addEventListener('load', () => {
        console.log('PayPal SDK loaded successfully');
        setSdkReady(true);
      });
      
      script.addEventListener('error', () => {
        console.error('Failed to load PayPal SDK');
        alert('Failed to load PayPal. Please check your internet connection.');
      });
      
      document.body.appendChild(script);
    };

    loadPayPalScript();
  }, []); // Empty dependency - runs once on mount

  // ========== STEP 2: Render PayPal Button ==========
  useEffect(() => {
    if (!sdkReady || !window.paypal) return;

    // Clear previous button instance
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML = '';
    }

    // Render PayPal button
    window.paypal.Buttons({
      
      // Button styling
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
        height: 45
      },

      // ========== CREATE ORDER ==========
      createOrder: async (data, actions) => {
        try {
          console.log('Creating PayPal order...');
          
          const response = await fetch('http://localhost:5000/create-paypal-order', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
              amount: parseFloat(amount).toFixed(2),
              currency: 'USD'
            })
          });

          if (!response.ok) {
            throw new Error('Failed to create order');
          }

          const orderData = await response.json();
          
          if (orderData.error) {
            throw new Error(orderData.error);
          }

          console.log('Order created:', orderData.id);
          return orderData.id;
          
        } catch (error) {
          console.error('Create order error:', error);
          alert(`Failed to create order: ${error.message}`);
          throw error;
        }
      },

      // ========== PAYMENT APPROVED ==========
      onApprove: async (data, actions) => {
        setLoading(true);
        console.log('Capturing payment...');
        
        try {
          const response = await fetch('http://localhost:5000/capture-paypal-order', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
              orderID: data.orderID 
            })
          });

          if (!response.ok) {
            throw new Error('Failed to capture payment');
          }

          const details = await response.json();
          
          if (details.success) {
            console.log('Payment successful:', details);
            
            // Show success message
            alert(
              `Payment Successful!\n\n` +
              `Order ID: ${details.orderID}\n` +
              `Payer: ${details.payer.name}\n` +
              `Email: ${details.payer.email}\n` +
              `Amount: $${details.amount.value} ${details.amount.currency}\n` +
              `Status: ${details.status}`
            );
            
            // Optional: Redirect to success page
            // window.location.href = '/success';
          } else {
            throw new Error(details.error || 'Payment verification failed');
          }
          
        } catch (error) {
          console.error('Payment capture error:', error);
          alert(`Payment failed: ${error.message}`);
        } finally {
          setLoading(false);
        }
      },

      // ========== PAYMENT CANCELLED ==========
      onCancel: (data) => {
        console.log('Payment cancelled by user:', data);
        alert('You cancelled the payment. No charges were made.');
        setLoading(false);
      },

      // ========== ERROR HANDLING ==========
      onError: (err) => {
        console.error('PayPal error:', err);
        alert(`An error occurred: ${err.message || 'Unknown error'}`);
        setLoading(false);
      }

    }).render('#paypal-button-container');

  }, [sdkReady, amount]); // Re-render when SDK loads or amount changes

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>PayPal Payment Integration</h1>
        <p style={styles.subtitle}>Secure checkout powered by PayPal</p>
      </div>
      
      <div style={styles.card}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Payment Amount (USD):
          </label>
          <div style={styles.inputWrapper}>
            <span style={styles.currencySymbol}>$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 1)}
              min="1"
              max="10000"
              step="0.01"
              style={styles.input}
              disabled={loading}
            />
          </div>
        </div>
        
        <div style={styles.buttonContainer}>
          {!sdkReady ? (
            <div style={styles.loader}>
              <p>Loading PayPal...</p>
            </div>
          ) : (
            <div id="paypal-button-container"></div>
          )}
        </div>
        
        {loading && (
          <div style={styles.processing}>
            <div style={styles.spinner}></div>
            <p>Processing your payment...</p>
          </div>
        )}
      </div>
      
      <div style={styles.testInfo}>
        <strong>Test Mode Active</strong>
        <p>Using PayPal Sandbox - No real money will be charged</p>
        <p style={styles.testCard}>
          Test Card: 4032 0334 3460 9217 | Expiry: 12/28 | CVV: 123
        </p>
      </div>
    </div>
  );
};

// ========== STYLES ==========
const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    color: '#0070ba',
    fontSize: '32px',
    marginBottom: '10px',
    fontWeight: '700'
  },
  subtitle: {
    color: '#666',
    fontSize: '16px',
    margin: 0
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '20px'
  },
  inputGroup: {
    marginBottom: '30px'
  },
  label: {
    display: 'block',
    marginBottom: '12px',
    fontWeight: '600',
    color: '#333',
    fontSize: '16px'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  currencySymbol: {
    position: 'absolute',
    left: '15px',
    fontSize: '24px',
    color: '#0070ba',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '16px 16px 16px 45px',
    fontSize: '24px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s',
    fontWeight: '600'
  },
  buttonContainer: {
    marginTop: '20px',
    minHeight: '45px'
  },
  loader: {
    textAlign: 'center',
    padding: '20px',
    color: '#666'
  },
  processing: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#0070ba',
    fontWeight: '500'
  },
  spinner: {
    width: '30px',
    height: '30px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #0070ba',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 10px'
  },
  testInfo: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#856404',
    textAlign: 'center'
  },
  testCard: {
    marginTop: '10px',
    fontSize: '12px',
    fontFamily: 'monospace'
  }
};

export default PayPalButton;
