import { useState, useEffect } from 'react';
import pb from '../api/pocketbase';

interface SellRevenueData {
  year: number;
  month: number;
  amountLAK: string;
  amountTHB: string;
  amountUSD: string;
}

interface OrderItem {
  id: string;
  referenceID: string;
  customerID: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  status: string;
  quantity: number;
  amountLAK: string;
  amountTHB: string;
  amountUSD: string;
  created: string;
  updated: string;
}

interface OrderStatusCount {
  pending: number;
  accepted: number;
  delivering: number;
  completed: number;
  cancel: number;
}

interface SellAmount {
  amountLAK: string;
  amountUSD: string;
  amountTHB: string;
}

interface StatusCountData {
  orderStatusCount: OrderStatusCount;
  customerCount: number;
  sellAmount: SellAmount;
}

interface OrderListData {
  items: OrderItem[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface DashboardData {
  sellRevenue: SellRevenueData[] | null;
  statusCount: StatusCountData | null;
  orderList: OrderListData | null;
  loading: boolean;
  error: string | null;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    sellRevenue: null,
    statusCount: null,
    orderList: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        const [sellRevenueResponse, statusCountResponse, orderListResponse] = await Promise.all([
          pb.send('/dashboard/sell-revenue', { method: 'GET' }),
          pb.send('/dashboard/status-count', { method: 'GET' }),
          pb.send('/order-list?page=1&perPage=10&status=pending', { method: 'GET' }),
        ]);

        setData({
          sellRevenue: sellRevenueResponse.sell,
          statusCount: statusCountResponse,
          orderList: orderListResponse,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
        }));
      }
    };

    fetchDashboardData();
  }, []);

  return data;
};