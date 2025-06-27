import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import {
  BooleanInput,
  DateField,
  Edit,
  SimpleForm,
  TextField,
  TextInput,
  useDefaultTitle,
  useEditContext,
} from 'react-admin';
import { validateForm } from './CustomerCreate';

const CustomerEdit = () => {
  return (
    <Edit title={<CustomerTitle />} aside={<CustomerAside />}>
      <SimpleForm validate={validateForm}>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box sx={{ flex: 2 }}>
            <Typography variant='h6' gutterBottom>
              Customer Information
            </Typography>
            <Box
              sx={{
                display: { xs: 'block', sm: 'flex' },
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <TextInput source='name' isRequired fullWidth />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextInput source='username' isRequired fullWidth />
              </Box>
            </Box>

            <TextInput type='email' source='email' isRequired fullWidth />
            <TextInput source='phone_number' fullWidth />

            <Box sx={{ mt: 2 }} />

            <Typography variant='h6' gutterBottom>
              Profile Settings
            </Typography>
            <TextInput source='avatar' fullWidth label='Avatar URL' />

            <Box
              sx={{
                display: { xs: 'block', sm: 'flex' },
                gap: 2,
              }}
            >
              <BooleanInput source='verified' />
              <BooleanInput source='emailVisibility' />
            </Box>

            <Box sx={{ mt: 2 }} />

            <Typography variant='h6' gutterBottom>
              Address
            </Typography>
            <TextInput
              source='address_id'
              fullWidth
              helperText='Link to address record'
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant='h6' gutterBottom>
              Customer Stats
            </Typography>
            <Card>
              <CardContent>
                <Typography variant='body2' color='textSecondary'>
                  Created: <DateField source='created' showTime />
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Updated: <DateField source='updated' showTime />
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </SimpleForm>
    </Edit>
  );
};

const CustomerAside = () => {
  const { record } = useEditContext();

  if (!record) return null;

  return (
    <Box sx={{ width: 300, p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Profile Preview
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ width: 64, height: 64 }} src={record.avatar}>
              {record.name?.[0]}
            </Avatar>
            <Box>
              <Typography variant='h6'>{record.name}</Typography>
              <Typography variant='body2' color='textSecondary'>
                @{record.username}
              </Typography>
            </Box>
          </Box>
          <Typography variant='body2'>Email: {record.email}</Typography>
          <Typography variant='body2'>Phone: {record.phone_number}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

const CustomerTitle = () => {
  const appTitle = useDefaultTitle();
  const { defaultTitle } = useEditContext();
  return (
    <>
      <title>{`${appTitle} - ${defaultTitle}`}</title>
      <Typography variant='h5'>
        Edit Customer: <TextField source='name' />
      </Typography>
    </>
  );
};

export default CustomerEdit;
