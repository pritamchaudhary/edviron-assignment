import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import Button from './ui/Button';
import Input from './ui/Input';
import { X } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const paymentDetails = {
      order_amount: Number(amount),
      student_info: {
        name: studentName,
        id: studentId,
        email: studentEmail,
      },
    };

    const toastId = toast.loading('Initiating payment...');

    try {
      const { data } = await axiosInstance.post('/payments/create-payment', paymentDetails);
      if (data.success && data.paymentUrl) {
        toast.success('Redirecting to payment gateway...', { id: toastId });
        // Redirect the user to the payment page
        window.location.href = data.paymentUrl;
        onPaymentSuccess(); // This will re-fetch data on the dashboard later
      } else {
        // This handles cases where the backend returns success:false
        throw new Error(data.message || 'Failed to get payment URL.');
      }
    } catch (error) {
      // This will show a specific error from the backend or a generic one
      const errorMessage = error.response?.data?.message || error.message || 'Payment initiation failed.';
      toast.error(errorMessage, { id: toastId });
      console.error("Payment Error:", error.response || error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">New Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student Name</label>
            <Input id="studentName" type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} required placeholder="e.g., Rohan Kumar" />
          </div>
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student ID</label>
            <Input id="studentId" type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required placeholder="e.g., S12345" />
          </div>
          <div>
            <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700">Student Email</label>
            <Input id="studentEmail" type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} required placeholder="e.g., rohan@example.com" />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (INR)</label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="e.g., 5000" />
          </div>
          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Processing...' : 'Proceed to Pay'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;