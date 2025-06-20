import * as React from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    required,
    useEditContext,
    Title,
} from 'react-admin';
import { Box, Typography } from '@mui/material';

const ProductCategoryTitle = () => {
    const { record } = useEditContext();
    return (
        <Title title={record ? `Edit Category "${record.name}"` : 'Edit Category'} />
    );
};

const ProductCategoryEdit = () => (
    <Edit title={<ProductCategoryTitle />}>
        <SimpleForm>
            <Box display="flex" flexDirection="column" gap={2} width="100%" maxWidth={600}>
                <Typography variant="h6" gutterBottom>
                    Category Information
                </Typography>
                
                <TextInput
                    source="name"
                    label="Category Name"
                    validate={[required()]}
                    fullWidth
                />
                
                <TextInput
                    source="name_la"
                    label="Lao Name"
                    validate={[required()]}
                    fullWidth
                />
                
                <TextInput
                    source="image_url"
                    label="Image URL"
                    validate={[required()]}
                    fullWidth
                    multiline
                    rows={3}
                />
            </Box>
        </SimpleForm>
    </Edit>
);

export default ProductCategoryEdit;