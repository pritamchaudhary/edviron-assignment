import React from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '../lib/utils';
import Badge from './ui/Badge';
import Button from './ui/Button'; // Make sure Button is imported
import axiosInstance from '../api/axiosInstance'; // Make sure axiosInstance is imported
import toast from 'react-hot-toast'; // Make sure toast is imported

const TableHeader = ({ children }) => (
  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 bg-gray-50 uppercase tracking-wider">
    {children}
  </th>
);

const TransactionTable = ({ transactions, loading, setTransactions }) => {
  // --- THIS FUNCTION IS NOW RESTORED ---
  const handleCheckStatus = async (collectId) => {
    const toastId = toast.loading('Checking status...');
    try {
      const { data } = await axiosInstance.get(`/payments/status/${collectId}`);
      if (data.success) {
        toast.success(`Status updated to: ${data.data.status}`, { id: toastId });
        const updatedTransactions = transactions.map(tx => 
          tx.custom_order_id === collectId ? { ...tx, status: data.data.status } : tx
        );
        setTransactions(updatedTransactions);
      } else {
        throw new Error('Failed to get status');
      }
    } catch (error) {
      toast.error('Could not retrieve status.', { id: toastId });
    }
  };

  if (loading) {
    return <div className="text-center p-8 bg-white rounded-lg shadow-sm">Loading transactions...</div>;
  }
  if (!transactions || transactions.length === 0) {
    return <div className="text-center p-8 text-gray-500 bg-white rounded-lg shadow-sm">No transactions found.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <TableHeader>Sr.No</TableHeader>
              <TableHeader>Institute Name</TableHeader>
              <TableHeader>Date & Time</TableHeader>
              <TableHeader>Edviron Order ID</TableHeader>
              <TableHeader>Order Amt</TableHeader>
              <TableHeader>Transaction Amt</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Student Name</TableHeader>
              <TableHeader>Gateway</TableHeader>
              <TableHeader>Actions</TableHeader> {/* Add Actions header */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((tx, index) => (
              <tr key={tx.custom_order_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{tx.institute_name || tx.school_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.createdAt ? format(new Date(tx.createdAt), 'dd/MM/yyyy, h:mm:ss a') : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono" title={tx.custom_order_id}>
                  {tx.custom_order_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{formatCurrency(tx.order_amount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{formatCurrency(tx.transaction_amount || 0)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Badge status={tx.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tx.student_info?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.gateway || 'N/A'}</td>
                {/* --- THIS CELL RESTORES THE BUTTON --- */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Button 
                    className="w-auto py-1 px-3 text-xs" 
                    onClick={() => handleCheckStatus(tx.custom_order_id)}
                    disabled={tx.status !== 'Pending'}
                  >
                    Check Status
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;