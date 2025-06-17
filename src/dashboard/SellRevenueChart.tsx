import * as React from 'react';
import { Card, CardContent, CardHeader, Grid, Typography, Box } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

interface SellRevenueData {
  year: number;
  month: number;
  amountLAK: string;
  amountTHB: string;
  amountUSD: string;
}

interface Props {
  data: SellRevenueData[];
}

const SellRevenueChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader title="Sell Revenue" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No revenue data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const latestRevenue = data[0];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Card>
      <CardHeader 
        title="Sell Revenue" 
        subheader={`${monthNames[latestRevenue.month - 1]} ${latestRevenue.year}`}
        avatar={
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
            }}
          >
            <TrendingUpIcon />
          </Box>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                LAK
              </Typography>
              <Typography variant="h5" component="div" color="primary">
                {parseInt(latestRevenue.amountLAK).toLocaleString()} ₭
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                USD
              </Typography>
              <Typography variant="h5" component="div" color="primary">
                ${parseFloat(latestRevenue.amountUSD).toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                THB
              </Typography>
              <Typography variant="h5" component="div" color="primary">
                ฿{parseFloat(latestRevenue.amountTHB).toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SellRevenueChart;