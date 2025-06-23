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
    useTheme,
    List as MuiList,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    InputAdornment,
    TextField as MuiTextField
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
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
    useDataProvider,
    useNotify,
} from 'react-admin';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon, Search as SearchIcon } from '@mui/icons-material';

const ProductList = () => {
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
    
    return (
        <List
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
                image={
                    Array.isArray(record.image_url) 
                        ? (record.image_url.length > 0 ? record.image_url[0] : '/placeholder-product.svg')
                        : (record.image_url || '/placeholder-product.svg')
                }
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
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const { setFilters, filterValues } = useListContext();
    const [categories, setCategories] = React.useState<any[]>([]);
    const [loadingCategories, setLoadingCategories] = React.useState(true);
    const [searchValue, setSearchValue] = React.useState('');
    
    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await dataProvider.getList('categories', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'name', order: 'ASC' },
                    filter: {},
                });
                setCategories(data);
            } catch (error) {
                notify('Error loading categories', { type: 'warning' });
            } finally {
                setLoadingCategories(false);
            }
        };
        
        fetchCategories();
    }, [dataProvider, notify]);

    const handleCategoryToggle = (categoryId: string) => {
        const currentCategoryId = filterValues.category_id;
        const newCategoryId = currentCategoryId === categoryId ? undefined : categoryId;
        setFilters({ ...filterValues, category_id: newCategoryId }, null);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);
        setFilters({ ...filterValues, q: value }, null);
    };

    const handleSalesFilter = (filterType: string, value: boolean) => {
        setFilters({ ...filterValues, [filterType]: value }, null);
    };

    const handleStockFilter = (filterType: string, value: boolean) => {
        setFilters({ ...filterValues, [filterType]: value }, null);
    };
    
    return (
        <Card sx={{ order: -1, mr: 2, width: '16em' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Filters
                </Typography>
                
                <MuiTextField
                    fullWidth
                    placeholder="Search products..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    size="small"
                    sx={{ mb: 3 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                    }}
                />
                
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
                    💰 SALES
                </Typography>
                <MuiList dense sx={{ py: 0 }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => handleSalesFilter('sales_best', !filterValues.sales_best)}
                            sx={{ py: 0.5 }}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                {filterValues.sales_best && <CheckIcon fontSize="small" color="primary" />}
                            </ListItemIcon>
                            <ListItemText 
                                primary="Best sellers"
                                primaryTypographyProps={{ variant: 'body2' }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => handleSalesFilter('sales_average', !filterValues.sales_average)}
                            sx={{ py: 0.5 }}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                {filterValues.sales_average && <CheckIcon fontSize="small" color="primary" />}
                            </ListItemIcon>
                            <ListItemText 
                                primary="Average"
                                primaryTypographyProps={{ variant: 'body2' }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => handleSalesFilter('sales_low', !filterValues.sales_low)}
                            sx={{ py: 0.5 }}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                {filterValues.sales_low && <CheckIcon fontSize="small" color="primary" />}
                            </ListItemIcon>
                            <ListItemText 
                                primary="Low"
                                primaryTypographyProps={{ variant: 'body2' }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => handleSalesFilter('sales_never', !filterValues.sales_never)}
                            sx={{ py: 0.5 }}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                {filterValues.sales_never && <CheckIcon fontSize="small" color="primary" />}
                            </ListItemIcon>
                            <ListItemText 
                                primary="Never sold"
                                primaryTypographyProps={{ variant: 'body2' }}
                            />
                        </ListItemButton>
                    </ListItem>
                </MuiList>

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
                    📊 STOCK
                </Typography>
                <MuiList dense sx={{ py: 0 }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => handleStockFilter('stock_out', !filterValues.stock_out)}
                            sx={{ py: 0.5 }}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                {filterValues.stock_out && <CheckIcon fontSize="small" color="primary" />}
                            </ListItemIcon>
                            <ListItemText 
                                primary="Out of stock"
                                primaryTypographyProps={{ variant: 'body2' }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => handleStockFilter('stock_low', !filterValues.stock_low)}
                            sx={{ py: 0.5 }}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                {filterValues.stock_low && <CheckIcon fontSize="small" color="primary" />}
                            </ListItemIcon>
                            <ListItemText 
                                primary="1-9 items"
                                primaryTypographyProps={{ variant: 'body2' }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => handleStockFilter('stock_medium', !filterValues.stock_medium)}
                            sx={{ py: 0.5 }}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                {filterValues.stock_medium && <CheckIcon fontSize="small" color="primary" />}
                            </ListItemIcon>
                            <ListItemText 
                                primary="10-49 items"
                                primaryTypographyProps={{ variant: 'body2' }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => handleStockFilter('stock_high', !filterValues.stock_high)}
                            sx={{ py: 0.5 }}
                        >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                                {filterValues.stock_high && <CheckIcon fontSize="small" color="primary" />}
                            </ListItemIcon>
                            <ListItemText 
                                primary="50 items and more"
                                primaryTypographyProps={{ variant: 'body2' }}
                            />
                        </ListItemButton>
                    </ListItem>
                </MuiList>
                    
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
                    🏷️ CATEGORIES
                </Typography>
                {loadingCategories ? (
                    <Typography variant="body2" color="textSecondary">
                        Loading categories...
                    </Typography>
                ) : (
                    <MuiList dense sx={{ py: 0 }}>
                        {categories.map((category) => (
                            <ListItem key={category.id} disablePadding>
                                <ListItemButton
                                    onClick={() => handleCategoryToggle(category.id)}
                                    sx={{ py: 0.5 }}
                                >
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        {filterValues.category_id === category.id && <CheckIcon fontSize="small" color="primary" />}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={category.name}
                                        primaryTypographyProps={{ variant: 'body2' }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </MuiList>
                )}
            </CardContent>
        </Card>
    );
};


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
