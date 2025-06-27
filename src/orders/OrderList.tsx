import {
  ExpandLess,
  ExpandMore,
  LocationOn,
  Person,
  Receipt,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';
import {
  createContext,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { DateField, Loading } from 'react-admin';

import pb from '../api/pocketbase';
import {
  PBAddress,
  PBCustomer,
  PBOrder,
  PBOrderItem,
  PBProduct,
} from '../model/OrderList';
import { Currency } from '../types';

const CurrencyContext = createContext<{
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}>({ currency: 'USD', setCurrency: () => {} });

export const useCurrency = () => useContext(CurrencyContext);

const OrderList = () => {
  const [currency, setCurrency] = useState<Currency>('USD');

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant='h5' component='h5'>
            Orders Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='body2'>Currency:</Typography>
            <ToggleButtonGroup
              value={currency}
              exclusive
              onChange={(event, newCurrency) => {
                if (newCurrency !== null) {
                  setCurrency(newCurrency);
                }
              }}
              size='small'
            >
              <ToggleButton value='USD'>USD</ToggleButton>
              <ToggleButton value='LAK'>LAK</ToggleButton>
              <ToggleButton value='THB'>THB</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
        <TabbedDatagrid />
      </Box>
    </CurrencyContext.Provider>
  );
};

const tabs = [
  { id: 'pending', name: 'pending' },
  { id: 'delivered', name: 'delivered' },
  { id: 'cancelled', name: 'cancelled' },
];

const TabbedDatagrid = () => {
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [orderCounts, setOrderCounts] = useState<{ [key: string]: number }>({});
  const isXSmall = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down('sm')
  );

  // Fetch order counts for each status
  useEffect(() => {
    const fetchOrderCounts = async () => {
      try {
        const counts: { [key: string]: number } = {};

        for (const tab of tabs) {
          const response = await pb.collection('orders').getList(1, 1, {
            filter: `status = "${tab.id}"`,
          });
          counts[tab.id] = response.totalItems;
        }

        setOrderCounts(counts);
      } catch (error) {
        console.error('Error fetching order counts:', error);
      }
    };

    fetchOrderCounts();
  }, []);

  const handleChange = useCallback(
    (event: React.SyntheticEvent, value: string) => {
      setActiveTab(value);

      if (isXSmall) {
        const tabsContainer = document.querySelector('[role="tablist"]');
        if (tabsContainer) {
          tabsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },
    [isXSmall]
  );

  return (
    <Fragment>
      <Tabs
        variant='scrollable'
        scrollButtons='auto'
        value={activeTab}
        indicatorColor='primary'
        onChange={(event, value) => handleChange(event, value)}
      >
        {tabs.map((choice) => (
          <Tab
            key={choice.id}
            label={
              <span>
                {choice.name} ({orderCounts[choice.id] || 0})
              </span>
            }
            value={choice.id}
          />
        ))}
      </Tabs>
      <Divider />
      <br />
      <OrdersTable status={activeTab} />
    </Fragment>
  );
};

// Order Detail Component
const OrderDetail: React.FC<{ order: PBOrder }> = ({ order }) => {
  const [open, setOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<PBOrderItem[]>([]);
  const [customer, setCustomer] = useState<PBCustomer | null>(null);
  const [address, setAddress] = useState<PBAddress | null>(null);
  const [products, setProducts] = useState<{ [key: string]: PBProduct }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currency } = useCurrency();

  const fetchOrderDetails = async () => {
    if (!open || orderItems.length > 0) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch order items
      const itemsResponse = await pb.collection('order_items').getList(1, 50, {
        filter: `order_id = "${order.id}"`,
      });
      setOrderItems(itemsResponse.items as unknown as PBOrderItem[]);

      // Fetch customer details
      if (order.customer_id) {
        try {
          const customerData = await pb
            .collection('customers')
            .getOne(order.customer_id);
          setCustomer(customerData as unknown as PBCustomer);
        } catch (err) {
          console.warn('Failed to fetch customer:', err);
        }
      }

      // Fetch address details
      if (order.address_id) {
        try {
          const addressData = await pb
            .collection('addresses')
            .getOne(order.address_id);
          setAddress(addressData as unknown as PBAddress);
        } catch (err) {
          console.warn('Failed to fetch address:', err);
        }
      }

      // Fetch product details for each order item
      const productIds = itemsResponse.items.map((item) => item.product_id);
      const uniqueProductIds = Array.from(new Set(productIds));

      const productPromises = uniqueProductIds.map(async (productId) => {
        try {
          const productData = await pb.collection('products').getOne(productId);
          return { id: productId, data: productData as unknown as PBProduct };
        } catch (err) {
          console.warn(`Failed to fetch product ${productId}:`, err);
          return null;
        }
      });

      const productResults = await Promise.all(productPromises);
      const productsMap: { [key: string]: PBProduct } = {};
      productResults.forEach((result) => {
        if (result) {
          productsMap[result.id] = result.data;
        }
      });
      setProducts(productsMap);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [open, order.id]);

  const calculateTotals = () => {
    return orderItems.reduce(
      (totals, item) => {
        return {
          lak: totals.lak + item.quantity * item.price_lak,
          usd: totals.usd + item.quantity * item.price_usd,
          thb: totals.thb + item.quantity * item.price_thb,
        };
      },
      { lak: 0, usd: 0, thb: 0 }
    );
  };

  const totals = calculateTotals();

  const formatCurrency = (amount: number, currencyType: string) => {
    switch (currencyType) {
      case 'LAK':
        return `₭${amount.toLocaleString()}`;
      case 'USD':
        return `$${amount.toFixed(2)}`;
      case 'THB':
        return `฿${amount.toFixed(2)}`;
      default:
        return amount.toString();
    }
  };

  const getCurrentTotal = () => {
    switch (currency) {
      case 'LAK':
        return formatCurrency(totals.lak, 'LAK');
      case 'USD':
        return formatCurrency(totals.usd, 'USD');
      case 'THB':
        return formatCurrency(totals.thb, 'THB');
      default:
        return formatCurrency(totals.usd, 'USD');
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => setOpen(!open)} size='small'>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <DateField source='created' record={order} showTime />
          </Box>
        </TableCell>
        <TableCell>{order.reference_id}</TableCell>
        <TableCell>{order.customer_name}</TableCell>
        <TableCell>{order.phone_number}</TableCell>
        <TableCell>{order.address}</TableCell>
        <TableCell>
          <Chip
            label={order.status}
            color={
              order.status === 'pending'
                ? 'warning'
                : order.status === 'delivered'
                ? 'success'
                : 'error'
            }
            size='small'
          />
        </TableCell>
        <TableCell>{getCurrentTotal()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} sx={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 2 }}>
              {loading && <Loading />}
              {error && <Alert severity='error'>{error}</Alert>}
              {!loading && !error && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Order Information Section */}
                  <Box sx={{ width: { xs: '100%', md: '33%' } }}>
                    <Card>
                      <CardContent>
                        <Typography variant='h6' gutterBottom>
                          <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Order Information
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          <strong>Reference:</strong> {order.reference_id}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          <strong>Created:</strong>{' '}
                          {new Date(order.created).toLocaleString()}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          <strong>Status:</strong> {order.status}
                        </Typography>
                        {order.remark && (
                          <Typography variant='body2' color='text.secondary'>
                            <strong>Remark:</strong> {order.remark}
                          </Typography>
                        )}
                        {customer && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant='subtitle2' gutterBottom>
                              <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                              Customer Details
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              <strong>Name:</strong>{' '}
                              {customer.name || customer.username}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              <strong>Email:</strong> {customer.email}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              <strong>Phone:</strong> {customer.phone_number}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              <strong>Verified:</strong>{' '}
                              {customer.verified ? 'Yes' : 'No'}
                            </Typography>
                          </Box>
                        )}
                        {address && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant='subtitle2' gutterBottom>
                              <LocationOn
                                sx={{ mr: 1, verticalAlign: 'middle' }}
                              />
                              Shipping Address
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              <strong>Name:</strong> {address.shipping_name}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              <strong>Village:</strong> {address.village}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Box>

                  {/* Order Items Section */}
                  <Box sx={{ width: { xs: '100%', md: '42%' } }}>
                    <Card>
                      <CardContent>
                        <Typography variant='h6' gutterBottom>
                          Order Items
                        </Typography>
                        {orderItems.length > 0 ? (
                          <TableContainer>
                            <Table size='small'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Product</TableCell>
                                  <TableCell align='right'>Qty</TableCell>
                                  <TableCell align='right'>Price</TableCell>
                                  <TableCell align='right'>Total</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {orderItems.map((item) => {
                                  const product = products[item.product_id];
                                  const getPrice = () => {
                                    switch (currency) {
                                      case 'LAK':
                                        return item.price_lak;
                                      case 'USD':
                                        return item.price_usd;
                                      case 'THB':
                                        return item.price_thb;
                                      default:
                                        return item.price_usd;
                                    }
                                  };
                                  const price = getPrice();
                                  const total = price * item.quantity;

                                  return (
                                    <TableRow key={item.id}>
                                      <TableCell>
                                        {product?.name || item.product_name}
                                      </TableCell>
                                      <TableCell align='right'>
                                        {item.quantity}
                                      </TableCell>
                                      <TableCell align='right'>
                                        {formatCurrency(price, currency)}
                                      </TableCell>
                                      <TableCell align='right'>
                                        {formatCurrency(total, currency)}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Typography variant='body2' color='text.secondary'>
                            No items found
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Box>

                  {/* Order Totals Section */}
                  <Box sx={{ width: { xs: '100%', md: '25%' } }}>
                    <Card>
                      <CardContent>
                        <Typography variant='h6' gutterBottom>
                          Order Totals
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography variant='body2'>LAK:</Typography>
                            <Typography variant='body2' fontWeight='bold'>
                              {formatCurrency(totals.lak, 'LAK')}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography variant='body2'>USD:</Typography>
                            <Typography variant='body2' fontWeight='bold'>
                              {formatCurrency(totals.usd, 'USD')}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography variant='body2'>THB:</Typography>
                            <Typography variant='body2' fontWeight='bold'>
                              {formatCurrency(totals.thb, 'THB')}
                            </Typography>
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography variant='body1' fontWeight='bold'>
                              Current ({currency}):
                            </Typography>
                            <Typography
                              variant='body1'
                              fontWeight='bold'
                              color='primary'
                            >
                              {getCurrentTotal()}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Custom Orders Table with PocketBase integration
const OrdersTable = React.memo(({ status }: { status: string }) => {
  const [orders, setOrders] = useState<PBOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await pb.collection('orders').getList(1, 50, {
          filter: `status = "${status}"`,
          sort: '-created',
        });
        setOrders(response.items as unknown as PBOrder[]);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status]);

  if (loading) return <Loading />;
  if (error) return <Alert severity='error'>{error}</Alert>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Reference</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <OrderDetail key={order.id} order={order} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default OrderList;
