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
        <SimpleShowLayout>
            <ImageField source="image_url" label="Image" />
            <TextField source="name" />
            <TextField source="name_la" label="Name (Lao)" />
            <TextField source="description" />
            <TextField source="description_la" label="Description (Lao)" />
            <NumberField source="price" />
            <ReferenceField source="category_id" reference="categories">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="details" />
            <DateField source="created" />
            <DateField source="updated" />
        </SimpleShowLayout>
    </Show>
);

export default ProductShow;