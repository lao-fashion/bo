import {
  Alert,
  Box,
  CircularProgress,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { CSSProperties } from 'react';

import OrderPendingList from './OrderPendingList';
import SellRevenueChart from './SellRevenueChart';
import StatusCountCards from './StatusCountCards';
import { useDashboardData } from './useDashboardData';

import { SellRevenue } from '../model/dashboard';
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

const VerticalSpacer = () => <span style={{ height: '1em' }} />;

const Dashboard = () => {
  const isXSmall = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  // Use new dashboard data hook
  const { sellRevenue, statusCount, orderList, loading, error } =
    useDashboardData();

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
              sellRevenue={sellRevenue?.[0] as SellRevenue}
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
            sellRevenue={sellRevenue?.[0] as SellRevenue}
            orderStatusCount={statusCount.orderStatusCount}
            customerCount={statusCount.customerCount}
            sellAmount={statusCount.sellAmount}
          />
        </div>
      )}
      {/* Sell Revenue Section */}
      {sellRevenue && (
        <div style={styles.singleCol}>
          <div className='min-h-screen bg-gray-100 p-4'>
            <div className='max-w-4xl mx-auto'>
              <SellRevenueChart data={sellRevenue} />
            </div>
          </div>
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
            sellRevenue={sellRevenue?.[0] as SellRevenue}
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
