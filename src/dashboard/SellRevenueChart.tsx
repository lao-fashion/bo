import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  Grid,
} from '@mui/material';

interface SellRevenueData {
  year: number;
  month: number;
  amountLAK: string;
  amountUSD: string;
  amountTHB: string;
}

interface Props {
  data: SellRevenueData[];
}

const SellRevenueChart: React.FC<Props> = ({ data }) => {
  const defaultData: SellRevenueData[] = [
    {
      year: 2025,
      month: 6,
      amountLAK: '15000000',
      amountUSD: '1000',
      amountTHB: '35000',
    },
  ];

  const finalData = data && data.length > 0 ? data : defaultData;

  const fillMissingMonths = (data: SellRevenueData[]): SellRevenueData[] => {
    const year = data[0]?.year ?? new Date().getFullYear();
    const monthMap = new Map(data.map(item => [item.month, item]));

    const fullData: SellRevenueData[] = [];
    for (let m = 1; m <= 12; m++) {
      if (monthMap.has(m)) {
        fullData.push(monthMap.get(m)!);
      } else {
        fullData.push({
          year,
          month: m,
          amountLAK: '0',
          amountUSD: '0',
          amountTHB: '0',
        });
      }
    }

    return fullData;
  };

  const filledData = fillMissingMonths(finalData);

  // Transform data for the chart
  const chartData = filledData.map((item, index) => ({
    date: `${String(item.month).padStart(2, '0')}/${String(item.year).slice(
      -2
    )}`,
    usd: Number.parseFloat(item.amountUSD),
    thb: Number.parseFloat(item.amountTHB),
    lak: Number.parseInt(item.amountLAK) / 1000, // Convert to thousands for better visualization
    day: index + 1,
  }));

  // Generate sample 30-day data if we don't have enough data points
  const generateSampleData = () => {
    const sampleData = [];
    const baseUSD = Number.parseFloat(finalData[0]?.amountUSD || '800');

    for (let i = 1; i <= 30; i++) {
      const variation = Math.sin(i * 0.2) * 300 + Math.random() * 200 - 100;
      const usdValue = Math.max(400, baseUSD + variation);

      sampleData.push({
        date: `${String(finalData[0]?.month).padStart(2, '0')}/${String(finalData[0]?.year).slice(-2)}`,
        usd: Math.round(usdValue),
        day: i,
      });
    }
    return sampleData;
  };

  const displayData = chartData.length >= 10 ? chartData : generateSampleData();

  return (
    <Card className='w-full'>
      <CardHeader
        title={
          <Typography
            variant='h6'
            sx={{ fontWeight: 'bold', textAlign: 'start' }}
          >
            30 Day Revenue History
          </Typography>
        }
      />
      <CardContent>
        <Box sx={{ height: 320, width: '100%' }}>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={displayData}
              margin={{
                top: 0,
                right: 0,
                left: -10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#f0f0f0'
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey='date'
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                interval='preserveStartEnd'
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={(value) => `$${value}`}
                domain={[0, 2000]}
                ticks={[0, 500, 1000, 1500, 2000]}
              />
              <Line
                type='monotone'
                dataKey='usd'
                stroke='#D4A574'
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4, fill: '#D4A574' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Revenue Summary Cards */}
        <Grid container spacing={2} mt={1}>
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                p: 2,
                backgroundColor: '#f9fafb',
                borderRadius: 2,
              }}
            >
              <Typography variant='body2' color='text.secondary' mb={1}>
                LAK
              </Typography>
              <Typography variant='h6' color='#a67c00'>
                {Number.parseInt(
                  finalData[0]?.amountLAK || '0'
                ).toLocaleString()}{' '}
                ₭
              </Typography>
            </Box>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                p: 2,
                backgroundColor: '#f9fafb',
                borderRadius: 2,
              }}
            >
              <Typography variant='body2' color='text.secondary' mb={1}>
                USD
              </Typography>
              <Typography variant='h6' color='#a67c00'>
                ${Number.parseFloat(finalData[0]?.amountUSD || '0').toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                p: 2,
                backgroundColor: '#f9fafb',
                borderRadius: 2,
              }}
            >
              <Typography variant='body2' color='text.secondary' mb={1}>
                THB
              </Typography>
              <Typography variant='h6' color='#a67c00'>
                ฿{Number.parseFloat(finalData[0]?.amountTHB || '0').toFixed(2)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SellRevenueChart;
