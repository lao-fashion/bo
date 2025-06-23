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
    ArrayInput,
    SimpleFormIterator,
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
            <React.Suspense fallback={<div>Loading...</div>}>
                <RichTextInput 
                    source="description" 
                    validate={required()} 
                    fullWidth 
                />
            </React.Suspense>
            <React.Suspense fallback={<div>Loading...</div>}>
                <RichTextInput 
                    source="description_la" 
                    label="Description (Lao)" 
                    fullWidth 
                />
            </React.Suspense>
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
            <ArrayInput source="image_url" label="Image URLs">
                <SimpleFormIterator inline>
                    <TextInput 
                        source="" 
                        label="Image URL" 
                        fullWidth
                        helperText="Enter image URL"
                    />
                </SimpleFormIterator>
            </ArrayInput>
            <React.Suspense fallback={<div>Loading...</div>}>
                <RichTextInput 
                    source="details" 
                    fullWidth 
                />
            </React.Suspense>
        </SimpleForm>
    </Create>
);

export default ProductCreate;
