import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import TransactionTable from '../components/TransactionTable';
import PaymentModal from '../components/PaymentModal';
import Button from '../components/ui/Button';
import { Plus, Search, SlidersHorizontal, Download } from 'lucide-react';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for pagination, filtering, and sorting
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(''); // '' means all
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
        status: statusFilter,
        sort: sort.field,
        order: sort.order,
        search: searchTerm, // We'll need to add search logic to the backend
      });

      const { data } = await axiosInstance.get(`/transactions?${params.toString()}`);
      setTransactions(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to fetch transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, sort, searchTerm]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-800 text-2xl font-bold">History</h3>
        <div className="flex items-center gap-4">
          {/* We'll make the button functional later if needed */}
          <Button variant="outline" className="w-auto flex items-center gap-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
            <Download size={16} />
            Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="w-auto flex items-center gap-2">
            <Plus size={18} />
            New Payment
          </Button>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative col-span-1">
            <input
              type="text"
              placeholder="Search (Order ID...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          {/* Filter Dropdowns */}
          <div className="col-span-2 flex justify-end items-center gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white">
              <option>Date</option>
              {/* Add date options here */}
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="">Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
              <SlidersHorizontal size={20} className="text-gray-600"/>
            </button>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <TransactionTable 
        transactions={transactions} 
        loading={loading}
        setTransactions={setTransactions}
        sort={sort}
        setSort={setSort}
      />

      {/* Pagination - You can keep your existing pagination controls */}

      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onPaymentSuccess={fetchTransactions}
      />
    </div>
  );
};

export default Dashboard;