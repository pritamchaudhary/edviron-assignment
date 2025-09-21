import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>
        <Link to="/" className="w-full">
          <Button className="max-w-xs mx-auto">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;