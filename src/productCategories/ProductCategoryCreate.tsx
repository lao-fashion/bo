import * as React from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    required,
    Title,
} from 'react-admin';
import { Box, Typography } from '@mui/material';

const ProductCategoryCreate = () => (
    <Create title={<Title title="Create New Product Category" />}>
        <SimpleForm>
            <Box display="flex" flexDirection="column" gap={2} width="100%" maxWidth={600}>
                <Typography variant="h6" gutterBottom>
                    New Category Information
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
                    helperText="Enter a valid image URL"
                />
            </Box>
        </SimpleForm>
    </Create>
);

export default ProductCategoryCreate;