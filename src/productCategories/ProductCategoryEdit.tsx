import { Box, Typography } from '@mui/material';
import {
    Edit,
    FormDataConsumer,
    SimpleForm,
    TextInput,
    Title,
    required,
    useEditContext,
} from 'react-admin';

const ProductCategoryTitle = () => {
  const { record } = useEditContext();
  return (
    <Title
      title={record ? `Edit Category "${record.name}"` : 'Edit Category'}
    />
  );
};

const ProductCategoryEdit = () => (
  <Edit title={<ProductCategoryTitle />}>
    <SimpleForm>
      <Box
        display='flex'
        flexDirection='column'
        gap={2}
        width='100%'
        maxWidth={600}
      >
        <Typography variant='h6' gutterBottom>
          Category Information
        </Typography>

        <TextInput
          source='name'
          label='Category Name'
          validate={[required()]}
          fullWidth
        />

        <TextInput
          source='name_la'
          label='Lao Name'
          validate={[required()]}
          fullWidth
        />

        <FormDataConsumer>
          {({ formData }) => (
            <Box display='flex' flexDirection='column' gap={1}>
              <TextInput
                source='image_url'
                label='Image URL'
                validate={[required()]}
                fullWidth
                multiline
                rows={3}
              />
              {formData.image_url && (
                <Box
                  component='img'
                  src={formData.image_url}
                  alt='Preview'
                  sx={{
                    width: 200,
                    height: 'auto',
                    borderRadius: 1,
                    border: '1px solid #ccc',
                    mt: 1,
                  }}
                />
              )}
            </Box>
          )}
        </FormDataConsumer>
      </Box>
    </SimpleForm>
  </Edit>
);

export default ProductCategoryEdit;
