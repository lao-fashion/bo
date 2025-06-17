import * as React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  PendingActions as PendingIcon,
  CheckCircle as AcceptedIcon,
  LocalShipping as DeliveringIcon,
  TaskAlt as CompletedIcon,
  Cancel as CancelIcon,
  People as CustomerIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

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

interface Props {
  orderStatusCount: OrderStatusCount;
  customerCount: number;
  sellAmount: SellAmount;
}

const StatusCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={1}>
        <Box
          sx={{
            backgroundColor: color,
            color: 'white',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {value}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const StatusCountCards: React.FC<Props> = ({ orderStatusCount, customerCount, sellAmount }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatusCard
          title="Pending Orders"
          value={orderStatusCount.pending}
          icon={<PendingIcon />}
          color="#ff9800"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatusCard
          title="Accepted Orders"
          value={orderStatusCount.accepted}
          icon={<AcceptedIcon />}
          color="#2196f3"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatusCard
          title="Delivering Orders"
          value={orderStatusCount.delivering}
          icon={<DeliveringIcon />}
          color="#9c27b0"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatusCard
          title="Completed Orders"
          value={orderStatusCount.completed}
          icon={<CompletedIcon />}
          color="#4caf50"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatusCard
          title="Cancelled Orders"
          value={orderStatusCount.cancel}
          icon={<CancelIcon />}
          color="#f44336"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatusCard
          title="Total Customers"
          value={customerCount}
          icon={<CustomerIcon />}
          color="#607d8b"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                sx={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <MoneyIcon />
              </Box>
              <Typography variant="h6" component="div">
                Total Sales Amount
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  LAK
                </Typography>
                <Typography variant="h6">
                  {parseInt(sellAmount.amountLAK).toLocaleString()} ₭
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  USD
                </Typography>
                <Typography variant="h6">
                  ${parseFloat(sellAmount.amountUSD).toLocaleString()}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  THB
                </Typography>
                <Typography variant="h6">
                  ฿{parseFloat(sellAmount.amountTHB).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatusCountCards;