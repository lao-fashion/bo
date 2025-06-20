import * as React from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    NumberInput,
    ReferenceInput,
    SelectInput,
    required,
    useCreateContext,
    useDefaultTitle,
} from 'react-admin';

const RichTextInput = React.lazy(() =>
    import('ra-input-rich-text').then(module => ({
        default: module.RichTextInput,
    }))
);

const ProductTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useCreateContext();

    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const ProductCreate = () => (
    <Create title={<ProductTitle />}>
        <SimpleForm sx={{ maxWidth: '40em' }}>
            <TextInput 
                autoFocus 
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
    </Create>
);

export default ProductCreate;
