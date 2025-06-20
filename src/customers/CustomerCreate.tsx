import * as React from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    BooleanInput,
    useTranslate,
    email,
    useDefaultTitle,
    useCreateContext,
    ImageInput,
    ImageField,
} from 'react-admin';
import { Box, Typography } from '@mui/material';

export const validateForm = (
    values: Record<string, any>
): Record<string, any> => {
    const errors = {} as any;
    if (!values.name) {
        errors.name = 'ra.validation.required';
    }
    if (!values.username) {
        errors.username = 'ra.validation.required';
    }
    if (!values.email) {
        errors.email = 'ra.validation.required';
    } else {
        const error = email()(values.email);
        if (error) {
            errors.email = error;
        }
    }
    return errors;
};

const CustomerTitle = () => {
    const appTitle = useDefaultTitle();
    const { defaultTitle } = useCreateContext();
    return (
        <>
            <title>{`${appTitle} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const CustomerCreate = () => (
    <Create title={<CustomerTitle />}>
        <SimpleForm
            sx={{ maxWidth: 600 }}
            defaultValues={{
                verified: false,
                emailVisibility: true,
            }}
            validate={validateForm}
        >
            <SectionTitle label="Customer Information" />
            <Box
                sx={{
                    display: { xs: 'block', sm: 'flex', width: '100%' },
                    gap: 2,
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <TextInput source="name" isRequired fullWidth />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <TextInput source="username" isRequired fullWidth />
                </Box>
            </Box>
            
            <TextInput type="email" source="email" isRequired fullWidth />
            <TextInput source="phone_number" fullWidth />
            
            <Separator />
            
            <SectionTitle label="Profile Settings" />
            <ImageInput source="avatar" accept={{}} maxSize={5000000}>
                <ImageField source="src" title="title" />
            </ImageInput>
            
            <Box
                sx={{
                    display: { xs: 'block', sm: 'flex' },
                    gap: 2,
                }}
            >
                <BooleanInput source="verified" />
                <BooleanInput source="emailVisibility" />
            </Box>
            
            <Separator />
            
            <SectionTitle label="Address" />
            <TextInput source="address_id" fullWidth helperText="Link to address record" />
        </SimpleForm>
    </Create>
);

const SectionTitle = ({ label }: { label: string }) => {
    return (
        <Typography variant="h6" gutterBottom>
            {label}
        </Typography>
    );
};

const Separator = () => (
    <Box
        sx={{
            pt: '1em',
        }}
    />
);

export default CustomerCreate;