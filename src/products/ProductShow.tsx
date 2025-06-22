import * as React from 'react';
import {
    Show,
    SimpleShowLayout,
    TextField,
    NumberField,
    DateField,
    ReferenceField,
    ImageField,
    useDefaultTitle,
    useShowContext,
} from 'react-admin';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Divider,
    Paper,
} from '@mui/material';
import { AttachMoney, Category, CalendarToday, Inventory } from '@mui/icons-material';

const ProductTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useShowContext();
    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const ProductShow = () => (
    <Show title={<ProductTitle />}>
        <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card sx={{ height: 'fit-content' }}>
                        <CardContent>
                            <ImageField 
                                source="image_url" 
                                label="" 
                                sx={{ 
                                    '& img': { 
                                        width: '100%', 
                                        height: 'auto', 
                                        borderRadius: 2,
                                        maxHeight: 400,
                                        objectFit: 'cover'
                                    } 
                                }} 
                            />
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card>
                        <CardContent>
                            <Box sx={{ mb: 3 }}>
                                <TextField 
                                    source="name" 
                                    sx={{ 
                                        '& .RaTextField-text': { 
                                            fontSize: '2rem', 
                                            fontWeight: 600, 
                                            color: 'primary.main',
                                            mb: 1 
                                        } 
                                    }} 
                                />
                                <TextField 
                                    source="name_la" 
                                    label=""
                                    sx={{ 
                                        '& .RaTextField-text': { 
                                            fontSize: '1.2rem', 
                                            color: 'text.secondary',
                                            fontStyle: 'italic'
                                        } 
                                    }} 
                                />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AttachMoney color="success" sx={{ mr: 1 }} />
                                <NumberField 
                                    source="price" 
                                    sx={{ 
                                        '& .RaNumberField-text': { 
                                            fontSize: '1.5rem', 
                                            fontWeight: 600, 
                                            color: 'success.main' 
                                        } 
                                    }} 
                                />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Category color="primary" sx={{ mr: 1 }} />
                                <ReferenceField source="category_id" reference="categories">
                                    <Chip label={<TextField source="name" />} color="primary" variant="outlined" />
                                </ReferenceField>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
                                    Description
                                </Typography>
                                <TextField 
                                    source="description" 
                                    sx={{ 
                                        '& .RaTextField-text': { 
                                            lineHeight: 1.6,
                                            color: 'text.secondary'
                                        } 
                                    }} 
                                />
                                <Box sx={{ mt: 1 }}>
                                    <TextField 
                                        source="description_la" 
                                        label=""
                                        sx={{ 
                                            '& .RaTextField-text': { 
                                                lineHeight: 1.6,
                                                color: 'text.secondary',
                                                fontStyle: 'italic'
                                            } 
                                        }} 
                                    />
                                </Box>
                            </Box>

                            {/* Additional Details Section */}
                            <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                                <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                                    Product Details
                                </Typography>
                                <TextField 
                                    source="details" 
                                    sx={{ 
                                        '& .RaTextField-text': { 
                                            lineHeight: 1.6 
                                        } 
                                    }} 
                                />
                            </Paper>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Box>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                Created
                                            </Typography>
                                            <DateField source="created" />
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Inventory fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Box>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                Updated
                                            </Typography>
                                            <DateField source="updated" />
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    </Show>
);

export default ProductShow;