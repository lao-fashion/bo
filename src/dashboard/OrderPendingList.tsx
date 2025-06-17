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
      <Card>
        <CardHeader title="Pending Orders" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            No pending orders
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: string, currency: string) => {
    const value = parseFloat(amount);
    switch (currency) {
      case 'LAK':
        return `${value.toLocaleString()} ₭`;
      case 'USD':
        return `$${value.toFixed(2)}`;
      case 'THB':
        return `฿${value.toFixed(2)}`;
      default:
        return amount;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader 
        title={`Pending Orders (${data.totalItems})`}
        subheader={`Showing ${data.items.length} of ${data.totalItems} orders`}
      />
      <CardContent sx={{ padding: 0 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {order.referenceID}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {order.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.phoneNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(order.amountUSD, 'USD')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatCurrency(order.amountLAK, 'LAK')}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color="warning"
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(order.created)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default OrderPendingList;