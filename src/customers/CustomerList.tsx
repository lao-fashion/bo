import { Download } from '@mui/icons-material';
import {
  Avatar,
  Button,
  FormControlLabel,
  Switch,
  Theme,
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';
import {
  ColumnsButton,
  CreateButton,
  DataTable,
  DateField,
  EmailField,
  List,
  SearchInput,
  SelectInput,
  TopToolbar,
  useDataProvider,
  useDefaultTitle,
  useListContext,
  useNotify,
  useRefresh,
  useUpdate,
} from 'react-admin';
import * as XLSX from 'xlsx';
import { Customer } from '../dataProvider/customersDataProvider';

const customerFilters = [
  <SearchInput key='q' source='q' alwaysOn />,
  <SelectInput
    key='verified'
    source='verified'
    choices={[
      { id: '', name: 'All Status' },
      { id: true, name: 'Verified' },
      { id: false, name: 'Unverified' },
    ]}
    label='Status'
    emptyText='All Status'
  />,
  <SelectInput
    key='has_ordered'
    source='has_ordered'
    choices={[
      { id: '', name: 'All Customers' },
      { id: true, name: 'Has Orders' },
      { id: false, name: 'No Orders' },
    ]}
    label='Order Status'
    emptyText='All Customers'
  />,
  <SelectInput
    key='emailVisibility'
    source='emailVisibility'
    choices={[
      { id: '', name: 'All Email Visibility' },
      { id: true, name: 'Email Visible' },
      { id: false, name: 'Email Hidden' },
    ]}
    label='Email Visibility'
    emptyText='All Email Visibility'
  />,
  <SearchInput
    key='email'
    source='email'
    label='Search by Email'
    placeholder='Enter email address'
  />,
];

const CustomerListActions = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const handleExportExcel = async () => {
    try {
      const { data } = await dataProvider.getList('customers', {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'created', order: 'DESC' },
        filter: {},
      });

      const exportData = data.map((customer: Customer) => ({
        Name: customer.name,
        Username: customer.username,
        Email: customer.email,
        Phone: customer.phone_number,
        Verified: customer.verified ? 'Yes' : 'No',
        Created: new Date(customer.created).toLocaleDateString(),
        Updated: new Date(customer.updated).toLocaleDateString(),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');

      XLSX.writeFile(
        workbook,
        `customers_export_${new Date().toISOString().split('T')[0]}.xlsx`
      );
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
        variant='outlined'
        size='small'
      >
        Export Excel
      </Button>
      <CreateButton />
      <ColumnsButton />
    </TopToolbar>
  );
};

const CustomerTitle = () => {
  const title = useDefaultTitle();
  const { defaultTitle } = useListContext();
  return (
    <>
      <title>{`${title} - ${defaultTitle}`}</title>
      <span>{defaultTitle}</span>
    </>
  );
};

const Column = DataTable.Col<Customer>;

const AvatarField = (record: Customer) => {
  if (!record?.avatar) return null;

  return (
    <Avatar
      src={record.avatar}
      alt={record.name}
      sx={{ width: 32, height: 32 }}
    />
  );
};

const VerifiedField = (record: Customer) => {
  const [update] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleVerifiedChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    if (!record) return;

    const newVerified = event.target.checked;
    try {
      await update('customers', {
        id: record.id,
        data: { ...record, verified: newVerified },
        previousData: record,
      });
      notify(
        `Customer ${newVerified ? 'verified' : 'unverified'} successfully`,
        { type: 'success' }
      );
      refresh();
    } catch (error) {
      notify('Error updating verification status', { type: 'error' });
    }
  };

  return (
    <Switch
      checked={record?.verified || false}
      onChange={handleVerifiedChange}
      size='small'
      color='success'
    />
  );
};

const AccountStatusField = ({ record }: { record?: Customer }) => {
  const [update] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!record) return;

    const newStatus = event.target.checked;
    try {
      await update('customers', {
        id: record.id,
        data: { ...record, verified: newStatus },
        previousData: record,
      });
      notify(`Account status updated to ${newStatus ? 'Active' : 'Inactive'}`, {
        type: 'success',
      });
      refresh();
    } catch (error) {
      notify('Error updating account status', { type: 'error' });
    }
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={record?.verified || false}
          onChange={handleStatusChange}
          size='small'
          color='primary'
        />
      }
      label={record?.verified ? 'Active' : 'Inactive'}
      labelPlacement='start'
      sx={{ margin: 0 }}
    />
  );
};

const CustomerList = () => {
  const isXsmall = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down('sm')
  );
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

  return (
    <List
      filters={customerFilters}
      sort={{ field: 'created', order: 'DESC' }}
      perPage={25}
      actions={<CustomerListActions />}
      title={<CustomerTitle />}
    >
      <DataTable
        rowClick='edit'
        sx={{
          '& .column-avatar': {
            width: '48px',
          },
          '& .column-phone_number': {
            md: { display: 'none' },
            lg: { display: 'table-cell' },
          },
        }}
      >
        <Column source='avatar' render={AvatarField} />
        <Column source='name' label='Name' />
        <Column source='username' label='Username' />
        <Column source='email' field={EmailField} />
        <Column source='phone_number' label='Phone' />
        <Column source='verified' render={VerifiedField} label='Verified' />
        <Column source='created' field={DateField} label='Created' />
        <Column source='updated' field={DateField} label='Updated' />
      </DataTable>
    </List>
  );
};

export default CustomerList;
