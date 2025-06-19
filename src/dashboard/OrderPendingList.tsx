import * as React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useCurrencyContext } from '../components/CurrencySelector/CurrencyProvider';
import { formatCurrency } from '../utils/format';

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

interface OrderListData {
  items: OrderItem[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface Props {
  data: OrderListData;
}

const OrderPendingList: React.FC<Props> = ({ data }) => {
  if (!data || !data.items || data.items.length === 0) {
    return (
      <Card elevation={3} sx={{ borderRadius: 3, p: 2 }}>
        <CardHeader
          title='Pending Orders'
          titleTypographyProps={{ fontWeight: 'bold', fontSize: 18 }}
        />
        <CardContent>
          <Typography variant='body2' color='text.secondary'>
            No pending orders
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const { currency } = useCurrencyContext();

  return (
    <Card sx={{ borderRadius: '10px', p: 2 }}>
      <CardHeader
        sx={{ mt: -1 }}
        title={`Pending Orders (${data.totalItems})`}
        subheader={`Showing ${data.items.length} of ${data.totalItems} orders`}
        titleTypographyProps={{ fontWeight: 'bold', fontSize: 18 }}
        subheaderTypographyProps={{ color: 'text.secondary' }}
      />
      <CardContent sx={{ padding: 0 }}>
        <Box sx={{ overflowX: 'auto', maxWidth: 630, mx: 'auto' }}>
          <TableContainer>
            <Table size='small' sx={{ minWidth: '800px' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Reference ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((order, index) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#fafafa' : 'inherit',
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant='body2' fontWeight='medium'>
                          {order.referenceID}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display='flex' flexDirection='column'>
                        <Typography variant='body2' fontWeight='medium'>
                          {order.customerName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>{order.quantity}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant='body2' fontWeight='medium'>
                          {currency === 'USD' &&
                            order?.amountUSD &&
                            `${formatCurrency(Number(order?.amountUSD))} $`}
                          {currency === 'THB' &&
                            order?.amountTHB &&
                            `${formatCurrency(Number(order?.amountTHB))} ฿`}
                          {currency === 'LAK' &&
                            order?.amountLAK &&
                            `${formatCurrency(Number(order?.amountLAK))} ₭`}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={
                          order.status === 'pending'
                            ? 'warning'
                            : order.status === 'completed'
                            ? 'success'
                            : 'default'
                        }
                        size='small'
                        variant='filled'
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant='caption' color='text.secondary'>
                        {formatDate(order.created)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderPendingList;
