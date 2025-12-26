import { Link } from 'react-router-dom';

const Cancel = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconCancel}>✗</div>
        <h1 style={styles.title}>Payment Cancelled</h1>
        <p style={styles.message}>
          You cancelled the payment process. No charges have been made to your account.
        </p>
        <p style={styles.details}>
          If this was a mistake, you can try again.
        </p>
        <Link to="/" style={styles.button}>
          Try Again
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '60px 40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    textAlign: 'center',
    maxWidth: '500px'
  },
  iconCancel: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#dc3545',
    color: 'white',
    fontSize: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 30px',
    fontWeight: 'bold'
  },
  title: {
    color: '#dc3545',
    fontSize: '28px',
    marginBottom: '20px'
  },
  message: {
    color: '#666',
    fontSize: '16px',
    lineHeight: '1.6',
    marginBottom: '15px'
  },
  details: {
    color: '#999',
    fontSize: '14px',
    marginBottom: '30px'
  },
  button: {
    display: 'inline-block',
    padding: '14px 30px',
    backgroundColor: '#0070ba',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s'
  }
};

export default Cancel;
