import {
  Alert,
  Box,
  CircularProgress,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { startOfDay, subDays } from 'date-fns';
import { CSSProperties, useMemo } from 'react';
import { useGetList } from 'react-admin';

import OrderPendingList from './OrderPendingList';
import SellRevenueChart from './SellRevenueChart';
import StatusCountCards from './StatusCountCards';
import { useDashboardData } from './useDashboardData';

import { Order } from '../types';

interface OrderStats {
  revenue: number;
  nbNewOrders: number;
  pendingOrders: Order[];
}

interface State {
  nbNewOrders?: number;
  pendingOrders?: Order[];
  recentOrders?: Order[];
  revenue?: string;
}

const styles = {
  flex: { display: 'flex' },
  flexColumn: { display: 'flex', flexDirection: 'column' },
  leftCol: { flex: 1, marginRight: '0.5em' },
  rightCol: { flex: 1, marginLeft: '0.5em' },
  singleCol: { marginTop: '1em', marginBottom: '1em' },
};

const Spacer = () => <span style={{ width: '1em' }} />;
const VerticalSpacer = () => <span style={{ height: '1em' }} />;

const Dashboard = () => {
  const isXSmall = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const aMonthAgo = useMemo(() => subDays(startOfDay(new Date()), 30), []);

  // Use new dashboard data hook
  const { sellRevenue, statusCount, orderList, loading, error } =
    useDashboardData();

  // Keep existing orders API for backward compatibility
  const { data: orders } = useGetList<Order>('orders', {
    filter: { date_gte: aMonthAgo.toISOString() },
    sort: { field: 'date', order: 'DESC' },
    pagination: { page: 1, perPage: 50 },
  });

  const aggregation = useMemo<State>(() => {
    if (!orders) return {};
    const aggregations = orders
      .filter((order) => order.status !== 'cancelled')
      .reduce(
        (stats: OrderStats, order) => {
          if (order.status !== 'cancelled') {
            stats.revenue += order.total;
            stats.nbNewOrders++;
          }
          if (order.status === 'ordered') {
            stats.pendingOrders.push(order);
          }
          return stats;
        },
        {
          revenue: 0,
          nbNewOrders: 0,
          pendingOrders: [],
        }
      );
    return {
      recentOrders: orders,
      revenue: aggregations.revenue.toLocaleString(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      nbNewOrders: aggregations.nbNewOrders,
      pendingOrders: aggregations.pendingOrders,
    };
  }, [orders]);

  const { nbNewOrders, pendingOrders, revenue, recentOrders } = aggregation;

  // Show loading state
  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='200px'
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box p={2}>
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }
  return isXSmall ? (
    <div>
      <div style={styles.flexColumn as CSSProperties}>
        <VerticalSpacer />
        {/* Status Section */}
        {statusCount && (
          <>
            <StatusCountCards
              orderStatusCount={statusCount.orderStatusCount}
              customerCount={statusCount.customerCount}
              sellAmount={statusCount.sellAmount}
            />
            <VerticalSpacer />
          </>
        )}
        {/* Sell Revenue Section */}
        {sellRevenue && (
          <>
            <SellRevenueChart data={sellRevenue} />
            <VerticalSpacer />
          </>
        )}
        {/* Order Pending List Section */}
        {orderList && <OrderPendingList data={orderList} />}
      </div>
    </div>
  ) : isSmall ? (
    <div style={styles.flexColumn as CSSProperties}>
      {/* Status Section */}
      {statusCount && (
        <div style={styles.singleCol}>
          <StatusCountCards
            orderStatusCount={statusCount.orderStatusCount}
            customerCount={statusCount.customerCount}
            sellAmount={statusCount.sellAmount}
          />
        </div>
      )}
      {/* Sell Revenue Section */}
      {sellRevenue && (
        <div style={styles.singleCol}>
          <SellRevenueChart data={sellRevenue} />
        </div>
      )}
      {/* Order Pending List Section */}
      {orderList && (
        <div style={styles.singleCol}>
          <OrderPendingList data={orderList} />
        </div>
      )}
    </div>
  ) : (
    <>
      <div style={styles.singleCol}>
        {/* Status Section */}
        {statusCount && (
          <StatusCountCards
            orderStatusCount={statusCount.orderStatusCount}
            customerCount={statusCount.customerCount}
            sellAmount={statusCount.sellAmount}
          />
        )}
      </div>
      <div style={styles.flex}>
        <div style={styles.leftCol}>
          {/* Sell Revenue Section */}
          {sellRevenue && (
            <div style={styles.singleCol}>
              <SellRevenueChart data={sellRevenue} />
            </div>
          )}
        </div>
        <div style={styles.rightCol}>
          {/* Order Pending List Section */}
          {orderList && (
            <div style={styles.singleCol}>
              <OrderPendingList data={orderList} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
