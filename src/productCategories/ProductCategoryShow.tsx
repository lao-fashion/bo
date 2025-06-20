import * as React from 'react';
import {
    Show,
    SimpleShowLayout,
    TextField,
    ImageField,
    DateField,
    EditButton,
    DeleteButton,
    TopToolbar,
    useShowContext,
    Title,
} from 'react-admin';
import { Box, Card, CardContent, Typography } from '@mui/material';

const ProductCategoryShowActions = () => (
    <TopToolbar>
        <EditButton />
        <DeleteButton />
    </TopToolbar>
);

const ProductCategoryTitle = () => {
    const { record } = useShowContext();
    return (
        <Title title={record ? `Category "${record.name}"` : 'Category Details'} />
    );
};

const ProductCategoryShow = () => (
    <Show 
        title={<ProductCategoryTitle />}
        actions={<ProductCategoryShowActions />}
    >
        <SimpleShowLayout>
            <Box display="flex" flexDirection="column" gap={3} maxWidth={800}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Category Details
                        </Typography>
                        
                        <Box display="flex" gap={4} alignItems="start">
                            <Box flex={1}>
                                <TextField source="name" label="Category Name" />
                                <TextField source="name_la" label="Lao Name" />
                                <TextField source="image_url" label="Image URL" />
                            </Box>
                            
                            <Box>
                                <ImageField 
                                    source="image_url" 
                                    label="Category Image"
                                    sx={{ maxWidth: 200, maxHeight: 200, objectFit: 'contain' }}
                                />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Metadata
                        </Typography>
                        
                        <DateField source="created" label="Created" showTime />
                        <DateField source="updated" label="Last Updated" showTime />
                        <TextField source="id" label="ID" />
                        <TextField source="collectionId" label="Collection ID" />
                    </CardContent>
                </Card>
            </Box>
        </SimpleShowLayout>
    </Show>
);

export default ProductCategoryShow;