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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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

const ModernStatusCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}> = ({ title, value, icon }) => (
  <Card
    sx={{
      height: '100%',
      borderRadius: 2,
      backgroundColor: '#fff',
      border: '1px solid #ece7df',
      boxShadow: 'none',
      px: 3,
      py: 3,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    {/* Background shape */}
    <Box
      sx={{
        position: 'absolute',
        left: -40,
        top: 0,
        bottom: 0,
        width: 150,
        backgroundColor: '#fef1dc',
        borderTopRightRadius: 150,
        borderBottomRightRadius: 150,
      }}
    />
    {/* Icon */}
    <Box
      sx={{
        position: 'relative',
        width: 48,
        height: 48,
        minWidth: 48,
        borderRadius: '50%',
        backgroundColor: '#fef1dc',
        color: '#D4AF37',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        zIndex: 1,
        ml: 2,
        mr: 3,
      }}
    >
      {icon}
    </Box>
    {/* Text */}
    <Box>
      <Typography
        variant='body2'
        sx={{ fontSize: '1rem', color: '#7b7462', fontWeight: 500 }}
      >
        {title}
      </Typography>
      <Typography
        variant='h6'
        sx={{ fontSize: '1.5rem', color: '#000', fontWeight: 700 }}
      >
        {value}
      </Typography>
    </Box>
  </Card>
);

const ModernSalesCard: React.FC<{ sellAmount: SellAmount }> = ({
  sellAmount,
}) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: 'none',
      border: '1px solid #ece7df',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#fefaf5',
      color: 'black',
    }}
  >
    <CardContent sx={{ p: 3, position: 'relative' }}>
      {/* Background decorative circle */}
      <Box
        sx={{
          position: 'absolute',
          backgroundColor: '#f7e9cc',
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box display='flex' alignItems='center' mb={3}>
          <Box
            sx={{
              backgroundColor: '#f7e9cc',
              color: '#a67c00',
              borderRadius: '50%',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              backdropFilter: 'blur(10px)',
            }}
          >
            <MoneyIcon />
          </Box>
          <Typography
            variant='h6'
            component='div'
            sx={{ fontWeight: 600, color: '#7b7462' }}
          >
            Total Sales Amount
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 2,
                p: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant='body2' sx={{ opacity: 0.9, mb: 1 }}>
                LAK
              </Typography>
              <Typography variant='h6' sx={{ fontWeight: 700 }}>
                {parseInt(sellAmount.amountLAK).toLocaleString()} ₭
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 2,
                p: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant='body2' sx={{ opacity: 0.9, mb: 1 }}>
                USD
              </Typography>
              <Typography variant='h6' sx={{ fontWeight: 700 }}>
                ${parseFloat(sellAmount.amountUSD).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 2,
                p: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant='body2' sx={{ opacity: 0.9, mb: 1 }}>
                THB
              </Typography>
              <Typography variant='h6' sx={{ fontWeight: 700 }}>
                ฿{parseFloat(sellAmount.amountTHB).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </CardContent>
  </Card>
);

const StatusCountCards: React.FC<Props> = ({
  orderStatusCount,
  customerCount,
  sellAmount,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <ModernStatusCard
          title='Total Customers'
          value={customerCount}
          icon={
            <Box sx={{ fontSize: 38 }}>
              <CustomerIcon />
            </Box>
          }
          color='#607d8b'
          bgColor='#607d8b'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <ModernStatusCard
          title='Orders Status'
          value={orderStatusCount.pending}
          icon={
            <Box sx={{ fontSize: 38 }}>
              <ShoppingCartIcon />
            </Box>
          }
          color='#090909'
          bgColor='#ff9800'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <ModernStatusCard
          title='Accepted Orders'
          value={orderStatusCount.accepted}
          icon={
            <Box sx={{ fontSize: 38 }}>
              <AcceptedIcon />
            </Box>
          }
          color='#2196f3'
          bgColor='#2196f3'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <ModernStatusCard
          title='Orders Delivering'
          value={orderStatusCount.delivering}
          icon={
            <Box sx={{ fontSize: 38 }}>
              <DeliveringIcon />
            </Box>
          }
          color='#9c27b0'
          bgColor='#9c27b0'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <ModernStatusCard
          title='Completed Orders'
          value={orderStatusCount.completed}
          icon={
            <Box sx={{ fontSize: 38 }}>
              <CompletedIcon />
            </Box>
          }
          color='#4caf50'
          bgColor='#4caf50'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <ModernStatusCard
          title='Cancelled Orders'
          value={orderStatusCount.cancel}
          icon={
            <Box sx={{ fontSize: 38 }}>
              <CancelIcon fontSize='inherit' />
            </Box>
          }
          color='#f44336'
          bgColor='#f44336'
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ModernSalesCard sellAmount={sellAmount} />
      </Grid>
    </Grid>
  );
};

export default StatusCountCards;
