import * as React from 'react';
import {
    List,
    Datagrid,
    TextField,
    ImageField,
    DateField,
    EditButton,
    DeleteButton,
    CreateButton,
    ExportButton,
    FilterButton,
    TopToolbar,
    SearchInput,
    TextInput,
    useListContext,
} from 'react-admin';
import { Card, CardContent } from '@mui/material';

const ProductCategoryFilters = [
    <SearchInput source="name" placeholder="Search by name" alwaysOn />,
    <TextInput source="name_la" label="Lao Name" />,
];

const ProductCategoryListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

const ProductCategoryList = () => (
    <List
        filters={ProductCategoryFilters}
        actions={<ProductCategoryListActions />}
        sort={{ field: 'created', order: 'DESC' }}
        perPage={25}
    >
        <Datagrid
            rowClick="edit"
            bulkActionButtons={<DeleteButton />}
        >
            <ImageField 
                source="image_url" 
                label="Image"
                sx={{ width: 60, height: 60, objectFit: 'cover' }} 
            />
            <TextField source="name" label="Name" />
            <TextField source="name_la" label="Lao Name" />
            <DateField source="created" label="Created" showTime />
            <DateField source="updated" label="Updated" showTime />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export default ProductCategoryList;