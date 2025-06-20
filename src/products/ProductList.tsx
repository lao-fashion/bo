import * as React from 'react';
import { 
    Box, 
    Chip, 
    useMediaQuery, 
    Theme, 
    Card, 
    CardContent, 
    Typography, 
    CardMedia,
    CardActions,
    Button,
    IconButton,
    useTheme
} from '@mui/material';
import {
    CreateButton,
    ExportButton,
    FilterButton,
    InputProps,
    List,
    TextField,
    NumberField,
    DateField,
    EditButton,
    DeleteButton,
    ShowButton,
    NumberInput,
    ReferenceInput,
    SearchInput,
    SelectInput,
    SortButton,
    Title,
    TopToolbar,
    useTranslate,
    useDefaultTitle,
    useListContext,
    BulkDeleteButton,
    BulkExportButton,
    ImageField,
    useRecordContext,
    RecordContextProvider,
    FilterForm,
    FilterLiveSearch,
} from 'react-admin';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const ProductList = () => {
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
    
    return (
        <List
            filters={productFilters}
            perPage={24}
            sort={{ field: 'name', order: 'ASC' }}
            actions={<ListActions />}
        >
            <Box sx={{ display: 'flex' }}>
                {!isSmall && <ProductFilters />}
                <Box sx={{ flex: 1 }}>
                    <ProductGrid />
                </Box>
            </Box>
        </List>
    );
};

const ProductGrid = () => {
    const { data, isLoading } = useListContext();
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
    
    let columns = 12;
    if (isXs) columns = 2;
    else if (isSm) columns = 3;
    else if (isMd) columns = 4;
    else if (isLg) columns = 6;
    
    const cardWidth = `calc(${100 / columns}% - 16px)`;
    
    if (isLoading) {
        return (
            <Box sx={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                alignItems: 'stretch'
            }}>
                {Array.from({ length: 12 }).map((_, index) => (
                    <Card 
                        key={index}
                        sx={{ 
                            width: cardWidth,
                            minWidth: '200px',
                            height: 300, 
                            display: 'flex', 
                            flexDirection: 'column' 
                        }}
                    >
                        <Box sx={{ height: 200, bgcolor: 'grey.200' }} />
                        <CardContent sx={{ flex: 1 }}>
                            <Box sx={{ height: 20, bgcolor: 'grey.200', mb: 1 }} />
                            <Box sx={{ height: 16, bgcolor: 'grey.200', width: '60%' }} />
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    }
    
    if (!data || data.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="textSecondary">
                    No products found
                </Typography>
            </Box>
        );
    }
    
    return (
        <Box sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'stretch'
        }}>
            {data.map((record: any) => (
                <Box 
                    key={record.id}
                    sx={{ 
                        width: cardWidth,
                        minWidth: '200px'
                    }}
                >
                    <RecordContextProvider value={record}>
                        <ProductCard />
                    </RecordContextProvider>
                </Box>
            ))}
        </Box>
    );
};

const ProductCard = () => {
    const record = useRecordContext();
    const theme = useTheme();
    
    if (!record) return null;
    
    return (
        <Card 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4]
                }
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={record.image_url || '/placeholder-product.svg'}
                alt={record.name}
                sx={{ 
                    objectFit: 'cover',
                    bgcolor: 'grey.100'
                }}
                onError={(e: any) => {
                    e.target.src = '/placeholder-product.svg';
                }}
            />
            <CardContent sx={{ flex: 1, pb: 1 }}>
                <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                        fontSize: '1rem',
                        fontWeight: 600,
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {record.name}
                </Typography>
                {record.name_la && (
                    <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{ 
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {record.name_la}
                    </Typography>
                )}
                <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ 
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '2.5em'
                    }}
                >
                    {record.description}
                </Typography>
                <Typography 
                    variant="h6" 
                    color="primary"
                    sx={{ 
                        fontWeight: 600,
                        fontSize: '1.1rem'
                    }}
                >
                    ${Number(record.price).toFixed(2)}
                </Typography>
            </CardContent>
            <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
                <Box>
                    <IconButton 
                        size="small" 
                        component="a" 
                        href={`#/products/${record.id}/show`}
                        sx={{ color: 'info.main' }}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        component="a" 
                        href={`#/products/${record.id}`}
                        sx={{ color: 'primary.main' }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Typography variant="caption" color="textSecondary">
                    {new Date(record.created).toLocaleDateString()}
                </Typography>
            </CardActions>
        </Card>
    );
};

const ProductTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useListContext();

    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <Title defaultTitle={defaultTitle} />
        </>
    );
};

const QuickFilter = ({ label }: InputProps) => {
    const translate = useTranslate();
    return <Chip sx={{ mb: 1 }} label={translate(label as string)} />;
};

const ProductFilters = () => {
    const translate = useTranslate();
    
    return (
        <Card sx={{ order: -1, mr: 2, width: '16em' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Filters
                </Typography>
                
                <FilterForm>
                    <FilterLiveSearch source="q" placeholder="Search products..." />
                    
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        Sales Performance
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <SelectInput 
                            source="sales_best" 
                            label="Best Sellers"
                            choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
                        />
                        <SelectInput 
                            source="sales_average" 
                            label="Average Sales"
                            choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
                        />
                        <SelectInput 
                            source="sales_low" 
                            label="Low Sales"
                            choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
                        />
                        <SelectInput 
                            source="sales_never" 
                            label="Never Sold"
                            choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
                        />
                    </Box>

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        Stock Status
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <SelectInput 
                            source="stock_out" 
                            label="Out of Stock"
                            choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
                        />
                        <SelectInput 
                            source="stock_low" 
                            label="1-9 Items"
                            choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
                        />
                        <SelectInput 
                            source="stock_medium" 
                            label="10-49 Items"
                            choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
                        />
                        <SelectInput 
                            source="stock_high" 
                            label="50+ Items"
                            choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
                        />
                    </Box>

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        Categories
                    </Typography>
                    <ReferenceInput
                        source="category_id"
                        reference="categories"
                        sort={{ field: 'name', order: 'ASC' }}
                    >
                        <SelectInput source="name" />
                    </ReferenceInput>

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        Price Range
                    </Typography>
                    <NumberInput source="price_gte" label="Min Price" />
                    <NumberInput source="price_lte" label="Max Price" />
                </FilterForm>
            </CardContent>
        </Card>
    );
};

export const productFilters = [
    <FilterLiveSearch source="q" placeholder="Search products..." />,
    <ReferenceInput
        source="category_id"
        reference="categories"
        sort={{ field: 'name', order: 'ASC' }}
    >
        <SelectInput source="name" />
    </ReferenceInput>,
    <NumberInput source="price_gte" label="Min Price" />,
    <NumberInput source="price_lte" label="Max Price" />,
    <SelectInput 
        source="sales_best" 
        label="Best Sellers"
        choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
    />,
    <SelectInput 
        source="sales_average" 
        label="Average Sales"
        choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
    />,
    <SelectInput 
        source="sales_low" 
        label="Low Sales"
        choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
    />,
    <SelectInput 
        source="sales_never" 
        label="Never Sold"
        choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
    />,
    <SelectInput 
        source="stock_out" 
        label="Out of Stock"
        choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
    />,
    <SelectInput 
        source="stock_low" 
        label="1-9 Items"
        choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
    />,
    <SelectInput 
        source="stock_medium" 
        label="10-49 Items"
        choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
    />,
    <SelectInput 
        source="stock_high" 
        label="50+ Items"
        choices={[{ id: true, name: 'Yes' }, { id: false, name: 'No' }]}
    />,
];

const ProductBulkActionButtons = () => (
    <>
        <BulkDeleteButton />
        <BulkExportButton />
    </>
);

const ListActions = () => {
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
    
    return (
        <TopToolbar>
            {isSmall && <FilterButton />}
            <SortButton fields={['name', 'price', 'created', 'updated']} />
            <CreateButton />
            <ExportButton />
        </TopToolbar>
    );
};

export default ProductList;
