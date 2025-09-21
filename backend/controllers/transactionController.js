const Order = require('../models/Order');
const OrderStatus = require('../models/OrderStatus');
const mongoose = require('mongoose');

exports.getAllTransactions = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;
  const status = req.query.status;
  const searchTerm = req.query.search;

  const skip = (page - 1) * limit;

  try {
    const matchQuery = {};
    if (status) {
      matchQuery.status = status;
    }
    if (searchTerm) {
      matchQuery.custom_order_id = { $regex: searchTerm, $options: 'i' };
    }

    const aggregationPipeline = [
      { $match: matchQuery },
      {
        $lookup: {
          from: 'orders',
          localField: 'collect_id',
          foreignField: '_id',
          as: 'order_details'
        }
      },
      { $unwind: '$order_details' },
      {
        $lookup: {
          from: 'schools',
          localField: 'order_details.school_id',
          foreignField: '_id',
          as: 'school_info'
        }
      },
      { $unwind: { path: '$school_info', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          institute_name: '$school_info.name',
          school_id: '$order_details.school_id',
          gateway: '$order_details.gateway_name',
          order_amount: '$order_amount',
          transaction_amount: '$transaction_amount',
          status: '$status',
          custom_order_id: '$custom_order_id',
          payment_time: '$payment_time',
          createdAt: '$createdAt',
          student_info: '$order_details.student_info',
          payment_method: '$payment_mode',
        }
      },
      { $sort: { [sort]: order } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: limit }]
        }
      }
    ];

    const results = await OrderStatus.aggregate(aggregationPipeline);

    const data = results[0].data;
    const total = results[0].metadata[0] ? results[0].metadata[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      count: data.length,
      pagination: {
        total,
        totalPages,
        currentPage: page,
      },
      data,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getTransactionsBySchool = async (req, res) => {
  const { schoolId } = req.params;
  
  if (!schoolId) {
    return res.status(400).json({ success: false, message: 'School ID is required' });
  }

  try {
    const aggregationPipeline = [
      {
        $lookup: {
          from: 'orders',
          localField: 'collect_id',
          foreignField: '_id',
          as: 'order_details'
        }
      },
      { $unwind: '$order_details' },
      {
        $match: { 'order_details.school_id': schoolId }
      },
      {
        $project: {
          _id: 0,
          collect_id: '$collect_id',
          school_id: '$order_details.school_id',
          gateway: '$order_details.gateway_name',
          order_amount: '$order_amount',
          transaction_amount: '$transaction_amount',
          status: '$status',
          custom_order_id: '$custom_order_id',
          payment_time: '$payment_time'
        }
      },
      { $sort: { payment_time: -1 } }
    ];

    const transactions = await OrderStatus.aggregate(aggregationPipeline);
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });

  } catch (error) {
    console.error('Error fetching school transactions:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};