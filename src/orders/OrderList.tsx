import * as React from 'react';
import { Fragment, useCallback, useState, createContext, useContext } from 'react';
import {
    AutocompleteInput,
    BooleanField,
    Count,
    DataTable,
    DateField,
    DateInput,
    ExportButton,
    FilterButton,
    List,
    NullableBooleanInput,
    NumberInput,
    ReferenceField,
    ReferenceInput,
    SearchInput,
    ColumnsButton,
    TopToolbar,
    useDefaultTitle,
    useListContext,
    useDataProvider,
} from 'react-admin';
import { useMediaQuery, Divider, Tabs, Tab, Theme, ToggleButton, ToggleButtonGroup, Box, Typography } from '@mui/material';

import CustomerReferenceField from '../visitors/CustomerReferenceField';
import AddressField from '../visitors/AddressField';
import MobileGrid from './MobileGrid';
import { Customer, Order, Currency, ApiOrder } from '../types';

const storeKeyByStatus = {
    pending: 'orders.list1',
    delivered: 'orders.list2',
    cancelled: 'orders.list3',
};

const CurrencyContext = createContext<{
    currency: Currency;
    setCurrency: (currency: Currency) => void;
}>({ currency: 'USD', setCurrency: () => {} });

export const useCurrency = () => useContext(CurrencyContext);

const ListActions = () => {
    const { filterValues } = useListContext();
    const { currency, setCurrency } = useCurrency();
    const status =
        (filterValues.status as 'pending' | 'delivered' | 'cancelled') ??
        'pending';
    
    const handleCurrencyChange = (
        event: React.MouseEvent<HTMLElement>,
        newCurrency: Currency | null,
    ) => {
        if (newCurrency !== null) {
            setCurrency(newCurrency);
        }
    };
    
    return (
        <TopToolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>Currency:</Typography>
                <ToggleButtonGroup
                    value={currency}
                    exclusive
                    onChange={handleCurrencyChange}
                    size="small"
                >
                    <ToggleButton value="USD">USD</ToggleButton>
                    <ToggleButton value="LAK">LAK</ToggleButton>
                    <ToggleButton value="THB">THB</ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <FilterButton />
            <ColumnsButton storeKey={storeKeyByStatus[status]} />
            <ExportButton />
        </TopToolbar>
    );
};

const OrdersTitle = () => {
    const title = useDefaultTitle();
    const { defaultTitle } = useListContext();
    return (
        <>
            <title>{`${title} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const OrderList = () => {
    const [currency, setCurrency] = useState<Currency>('USD');
    
    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            <List
                filterDefaultValues={{ status: 'pending' }}
                sort={{ field: 'created', order: 'DESC' }}
                perPage={25}
                filters={orderFilters}
                actions={<ListActions />}
                title={<OrdersTitle />}
            >
                <TabbedDatagrid />
            </List>
        </CurrencyContext.Provider>
    );
};

const orderFilters = [
    <SearchInput source="q" alwaysOn />,
    <SearchInput source="customerName" label="Customer Name" />,
    <SearchInput source="phoneNumber" label="Phone Number" />,
    <DateInput source="created_gte" label="From Date" parse={d => new Date(d).toISOString().split('T')[0]} />,
    <DateInput source="created_lte" label="To Date" parse={d => new Date(d).toISOString().split('T')[0]} />,
];

const tabs = [
    { id: 'pending', name: 'pending' },
    { id: 'delivered', name: 'delivered' },
    { id: 'cancelled', name: 'cancelled' },
];


const TabbedDatagrid = () => {
    const listContext = useListContext();
    const { filterValues, setFilters, displayedFilters } = listContext;
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );

    const handleChange = useCallback(
        (event: React.ChangeEvent<{}>, value: any) => {
            setFilters &&
                setFilters(
                    { ...filterValues, status: value },
                    displayedFilters
                );
        },
        [displayedFilters, filterValues, setFilters]
    );

    return (
        <Fragment>
            <Tabs
                variant="fullWidth"
                centered
                value={filterValues.status ?? 'ordered'}
                indicatorColor="primary"
                onChange={handleChange}
            >
                {tabs.map(choice => (
                    <Tab
                        key={choice.id}
                        label={
                            <span>
                                {choice.name} (
                                <Count
                                    filter={{
                                        ...filterValues,
                                        status: choice.name,
                                    }}
                                    sx={{ lineHeight: 'inherit' }}
                                />
                                )
                            </span>
                        }
                        value={choice.id}
                    />
                ))}
            </Tabs>
            <Divider />
            {isXSmall ? (
                <MobileGrid />
            ) : (
                <>
                    {(filterValues.status == null ||
                        filterValues.status === 'pending') && (
                        <OrdersTable storeKey={storeKeyByStatus.pending} />
                    )}
                    {filterValues.status === 'delivered' && (
                        <OrdersTable storeKey={storeKeyByStatus.delivered}>
                            <Column
                                field={BooleanField}
                                source="returned"
                                align="right"
                                sx={{ mt: -0.5, mb: -0.5 }}
                            />
                        </OrdersTable>
                    )}
                    {filterValues.status === 'cancelled' && (
                        <OrdersTable storeKey={storeKeyByStatus.cancelled} />
                    )}
                </>
            )}
        </Fragment>
    );
};

const Column = DataTable.Col<ApiOrder>;
const ColumnNumber = DataTable.NumberCol<ApiOrder>;

const AmountField = ({ record }: { record?: ApiOrder }) => {
    const { currency } = useCurrency();
    
    if (!record) return null;
    
    const getAmount = () => {
        switch (currency) {
            case 'USD':
                return `$${parseFloat(record.amountUSD).toFixed(2)}`;
            case 'LAK':
                return `₭${parseFloat(record.amountLAK).toLocaleString()}`;
            case 'THB':
                return `฿${parseFloat(record.amountTHB).toFixed(2)}`;
            default:
                return `$${parseFloat(record.amountUSD).toFixed(2)}`;
        }
    };
    
    return <span style={{ fontWeight: 'bold' }}>{getAmount()}</span>;
};

const OrdersTable = React.memo(
    ({
        storeKey,
        children,
    }: {
        storeKey: string;
        children?: React.ReactNode;
    }) => (
        <DataTable
            rowClick="edit"
            storeKey={storeKey}
        >
            <Column source="created">
                <DateField source="created" showTime />
            </Column>
            <Column source="referenceID" label="Reference" />
            <Column source="customerName" label="Customer" />
            <Column source="phoneNumber" label="Phone" />
            <Column source="address" label="Address" />
            <Column source="status" label="Status" />
            <ColumnNumber
                source="quantity"
                label="Quantity"
            />
            <Column source="amount" label="Amount" field={AmountField} />
            {children}
        </DataTable>
    )
);

export default OrderList;
