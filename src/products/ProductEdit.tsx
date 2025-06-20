import * as React from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    ReferenceInput,
    SelectInput,
    required,
    useDefaultTitle,
    useEditContext,
} from 'react-admin';

const ProductTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useEditContext();
    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const ProductEdit = () => (
    <Edit title={<ProductTitle />}>
        <SimpleForm sx={{ maxWidth: '40em' }}>
            <TextInput 
                source="name" 
                validate={required()} 
                fullWidth 
            />
            <TextInput 
                source="name_la" 
                label="Name (Lao)" 
                fullWidth 
            />
            <TextInput 
                source="description" 
                multiline 
                rows={3} 
                validate={required()} 
                fullWidth 
            />
            <TextInput 
                source="description_la" 
                label="Description (Lao)" 
                multiline 
                rows={3} 
                fullWidth 
            />
            <NumberInput 
                source="price" 
                validate={required()} 
                min={0} 
                step={0.01} 
                fullWidth 
            />
            <ReferenceInput
                source="category_id"
                reference="categories"
            >
                <SelectInput source="name" fullWidth validate={required()} />
            </ReferenceInput>
            <TextInput 
                source="image_url" 
                label="Image URL" 
                fullWidth 
            />
            <TextInput 
                source="details" 
                multiline 
                rows={4} 
                fullWidth 
            />
        </SimpleForm>
    </Edit>
);

export default ProductEdit;
