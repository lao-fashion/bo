import * as React from 'react';
import {
    BooleanField,
    CreateButton,
    DataTable,
    DateField,
    EmailField,
    List,
    SearchInput,
    TextField,
    ColumnsButton,
    TopToolbar,
    useDefaultTitle,
    useListContext,
    BooleanInput,
    SelectInput,
    useUpdate,
    useNotify,
    useRefresh,
    useDataProvider,
} from 'react-admin';
import { useMediaQuery, Theme, Chip, Switch, FormControlLabel, Button } from '@mui/material';
import { Download, Person } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { User } from '../dataProvider/usersDataProvider';

const userFilters = [
    <SearchInput key="q" source="q" alwaysOn />,
    <SelectInput 
        key="verified"
        source="verified" 
        choices={[
            { id: '', name: 'All Status' },
            { id: true, name: 'Verified' },
            { id: false, name: 'Unverified' }
        ]} 
        label="Status" 
        allowEmpty
        emptyText="All Status"
    />,
    <SelectInput 
        key="emailVisibility"
        source="emailVisibility" 
        choices={[
            { id: '', name: 'All Email Visibility' },
            { id: true, name: 'Email Visible' },
            { id: false, name: 'Email Hidden' }
        ]} 
        label="Email Visibility" 
        allowEmpty
        emptyText="All Email Visibility"
    />,
    <SearchInput key="email" source="email" label="Search by Email" placeholder="Enter email address" />,
    <SearchInput key="username" source="username" label="Search by Username" placeholder="Enter username" />,
];

const UserListActions = () => {
    const dataProvider = useDataProvider();
    const notify = useNotify();
    
    const handleExportExcel = async () => {
        try {
            const { data } = await dataProvider.getList('users', {
                pagination: { page: 1, perPage: 1000 },
                sort: { field: 'created', order: 'DESC' },
                filter: {},
            });
            
            const exportData = data.map((user: User) => ({
                'Full Name': user.full_name,
                'Username': user.username,
                'Email': user.email,
                'Phone': user.phone_number,
                'Verified': user.verified ? 'Yes' : 'No',
                'Email Visibility': user.emailVisibility ? 'Visible' : 'Hidden',
                'Created': new Date(user.created).toLocaleDateString(),
                'Updated': new Date(user.updated).toLocaleDateString(),
            }));
            
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
            
            XLSX.writeFile(workbook, `users_export_${new Date().toISOString().split('T')[0]}.xlsx`);
            notify('Excel file exported successfully', { type: 'success' });
        } catch (error) {
            notify('Failed to export Excel file', { type: 'error' });
        }
    };
    
    return (
        <TopToolbar>
            <Button
                onClick={handleExportExcel}
                startIcon={<Download />}
                variant="outlined"
                size="small"
            >
                Export Excel
            </Button>
            <CreateButton />
            <ColumnsButton />
        </TopToolbar>
    );
};

const UserTitle = () => {
    const title = useDefaultTitle();
    const { defaultTitle } = useListContext();
    return (
        <>
            <title>{`${title} - ${defaultTitle}`}</title>
            <span>{defaultTitle}</span>
        </>
    );
};

const Column = DataTable.Col<User>;

const VerifiedField = ({ record }: { record?: User }) => {
    const [update] = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();
    
    const handleVerifiedChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        if (!record) return;
        
        const newVerified = event.target.checked;
        try {
            await update('users', {
                id: record.id,
                data: { ...record, verified: newVerified },
                previousData: record,
            });
            notify(`User ${newVerified ? 'verified' : 'unverified'} successfully`, { type: 'success' });
            refresh();
        } catch (error) {
            notify('Error updating verification status', { type: 'error' });
        }
    };
    
    return (
        <Switch
            checked={record?.verified || false}
            onChange={handleVerifiedChange}
            size="small"
            color="success"
        />
    );
};

const EmailVisibilityField = ({ record }: { record?: User }) => {
    const [update] = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();
    
    const handleEmailVisibilityChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        if (!record) return;
        
        const newEmailVisibility = event.target.checked;
        try {
            await update('users', {
                id: record.id,
                data: { ...record, emailVisibility: newEmailVisibility },
                previousData: record,
            });
            notify(`Email visibility ${newEmailVisibility ? 'enabled' : 'disabled'} successfully`, { type: 'success' });
            refresh();
        } catch (error) {
            notify('Error updating email visibility', { type: 'error' });
        }
    };
    
    return (
        <Switch
            checked={record?.emailVisibility || false}
            onChange={handleEmailVisibilityChange}
            size="small"
            color="primary"
        />
    );
};

const UserList = () => {
    const isXsmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
    
    return (
        <List
            filters={userFilters}
            sort={{ field: 'created', order: 'DESC' }}
            perPage={25}
            actions={<UserListActions />}
            title={<UserTitle />}
        >
            <DataTable
                rowClick="edit"
                sx={{
                    '& .column-phone_number': {
                        md: { display: 'none' },
                        lg: { display: 'table-cell' },
                    },
                }}
            >
                <Column
                    source="full_name"
                    label="Full Name"
                />
                <Column
                    source="username"
                    label="Username"
                />
                <Column
                    source="email"
                    field={EmailField}
                />
                <Column
                    source="phone_number"
                    label="Phone"
                />
                <Column
                    source="verified"
                    field={VerifiedField}
                    label="Verified"
                />
                <Column
                    source="emailVisibility"
                    field={EmailVisibilityField}
                    label="Email Visibility"
                />
                <Column
                    source="created"
                    field={DateField}
                    label="Created"
                />
                <Column
                    source="updated"
                    field={DateField}
                    label="Updated"
                />
            </DataTable>
        </List>
    );
};

export default UserList;