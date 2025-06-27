// in src/comments.js
import * as React from 'react';
import { Box, Card, CardHeader, CardContent, Typography } from '@mui/material';
import {
    DateField,
    EditButton,
    NumberField,
    TextField,
    BooleanField,
    useTranslate,
    useListContext,
    RecordContextProvider,
} from 'react-admin';

import CustomerReferenceField from '../visitors/CustomerReferenceField';
import { Order } from '../types';

const MobileGrid = () => {
    const { data, error, isPending } = useListContext<Order>();
    const translate = useTranslate();
    if (isPending || error || data.length === 0) {
        return null;
    }
    return (
        <Box sx={{ margin: 1 }}>
            {data?.map((record) => (
                <RecordContextProvider key={record.id} value={record}>
                    <Card
                        sx={{
                            marginBottom: 2,
                            boxShadow: 1,
                            borderRadius: 2,
                            overflow: 'hidden',
                        }}
                    >
                        <CardHeader
                            title={
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {translate('resources.orders.name', 1)} #
                                    <TextField
                                        source="reference"
                                        variant="body2"
                                        sx={{ display: 'inline', ml: 0.5 }}
                                    />
                                </Typography>
                            }
                            titleTypographyProps={{ variant: 'body1' }}
                            action={<EditButton />}
                        />
                        <CardContent sx={{ pt: 0 }}>
                            <CustomerReferenceField
                                source="customer_id"
                                sx={{ display: 'block', mb: 1 }}
                            />
                            <Typography variant="body2" gutterBottom>
                                {translate('resources.reviews.fields.date')}:&nbsp;
                                <DateField
                                    source="date"
                                    showTime
                                    sx={{ display: 'inline' }}
                                />
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {translate('resources.orders.fields.basket.total')}:&nbsp;
                                <NumberField
                                    source="total"
                                    options={{
                                        style: 'currency',
                                        currency: 'USD',
                                    }}
                                    sx={{ display: 'inline' }}
                                />
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                {translate('resources.orders.fields.status')}:&nbsp;
                                <TextField
                                    source="status"
                                    sx={{ display: 'inline' }}
                                />
                            </Typography>
                            <Typography variant="body2">
                                {translate('resources.orders.fields.returned')}:&nbsp;
                                <BooleanField
                                    source="returned"
                                    sx={{ display: 'inline' }}
                                />
                            </Typography>
                        </CardContent>
                    </Card>
                </RecordContextProvider>
            ))}
        </Box>
    );
};

export default MobileGrid;
