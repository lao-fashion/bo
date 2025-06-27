import {
  Alert,
  Box,
  CircularProgress,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { CSSProperties, useState } from 'react';

import OrderPendingList from './OrderPendingList';
import SellRevenueChart from './SellRevenueChart';
import StatusCountCards from './StatusCountCards';
import { useRevenueData, useStaticDashboardData } from './useDashboardData';

import { SellRevenue } from '../model/dashboard';

const styles = {
  flex: { display: 'flex' },
  flexColumn: { display: 'flex', flexDirection: 'column' },
  leftCol: { flex: 1, marginRight: '0.5em' },
  rightCol: { flex: 1, marginLeft: '0.5em' },
  singleCol: { marginTop: '1em', marginBottom: '1em' },
};

const VerticalSpacer = () => <span style={{ height: '1em' }} />;

interface FilterParams {
  isYear: boolean;
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
}

const Dashboard = () => {
  const isXSmall = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const [filterParams, setFilterParams] = useState<FilterParams>({
    isYear: false,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Use separate hooks for static and revenue data
  const {
    statusCount,
    orderList,
    loading: staticLoading,
    error: staticError,
  } = useStaticDashboardData();
  const {
    sellRevenue,
    loading: revenueLoading,
    error: revenueError,
  } = useRevenueData(filterParams);

  const loading = staticLoading;
  const error = staticError || revenueError;

  const handleFilterChange = (params: FilterParams) => {
    setFilterParams(params);
  };

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
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Status Section */}
        {statusCount && (
          <StatusCountCards
            sellRevenue={sellRevenue?.[0] as SellRevenue}
            orderStatusCount={statusCount.orderStatusCount}
            customerCount={statusCount.customerCount}
            sellAmount={statusCount.sellAmount}
          />
        )}
        {/* Sell Revenue Section */}
        {sellRevenue && (
          <SellRevenueChart
            data={sellRevenue}
            onFilterChange={handleFilterChange}
            loading={revenueLoading}
          />
        )}
        {/* Order Pending List Section */}
        {orderList && <OrderPendingList data={orderList} />}
      </Box>
    </Box>
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
              <SellRevenueChart
                data={sellRevenue}
                onFilterChange={handleFilterChange}
                loading={revenueLoading}
              />
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
              <SellRevenueChart
                data={sellRevenue}
                onFilterChange={handleFilterChange}
                loading={revenueLoading}
              />
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
