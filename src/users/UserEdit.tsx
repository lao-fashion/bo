import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useRecordContext } from 'react-admin';
import {
  BooleanInput,
  DateField,
  Edit,
  email,
  PasswordInput,
  required,
  SimpleForm,
  TextField,
  TextInput,
  useNotify,
} from 'react-admin';

const UserEdit = () => {
  const notify = useNotify();

  const validateForm = (values: any) => {
    const errors: any = {};
    if (!values.username) {
      errors.username = 'Username is required';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    }
    if (!values.full_name) {
      errors.full_name = 'Full name is required';
    }
    if (values.password && values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    if (values.passwordConfirm && values.password !== values.passwordConfirm) {
      errors.passwordConfirm = 'Passwords do not match';
    }
    return errors;
  };

  return (
    <Edit
      title='Edit User'
      mutationOptions={{
        onSuccess: () => {
          notify('User updated successfully', { type: 'success' });
        },
        onError: (error: any) => {
          notify(`Error updating user: ${error.message}`, { type: 'error' });
        },
      }}
    >
      <SimpleForm validate={validateForm}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Basic Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextInput
                    source='username'
                    validate={[required()]}
                    fullWidth
                    helperText='Username must be unique'
                  />

                  <TextInput
                    source='full_name'
                    validate={[required()]}
                    fullWidth
                    label='Full Name'
                  />

                  <TextInput
                    source='email'
                    validate={[required(), email()]}
                    fullWidth
                    helperText='Email must be unique'
                  />

                  <TextInput
                    source='phone_number'
                    fullWidth
                    label='Phone Number'
                  />

                  <TextInput source='avatar' fullWidth label='Avatar URL' />
                </Box>

                <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
                  Change Password
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <PasswordInput
                    source='password'
                    fullWidth
                    helperText='Leave empty to keep current password. Must be at least 6 characters long.'
                  />

                  <PasswordInput
                    source='passwordConfirm'
                    fullWidth
                    label='Confirm Password'
                    helperText='Must match the password above'
                  />
                </Box>

                <Typography variant='h6' gutterBottom sx={{ mt: 3 }}>
                  Account Settings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <BooleanInput source='verified' label='Verified' />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  User Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='center'
                  >
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ mb: 1 }}
                    >
                      Avatar
                    </Typography>
                    <AvatarDisplay />
                  </Box>
                  <Box>
                    <Typography variant='body2' color='text.secondary'>
                      User ID
                    </Typography>
                    <TextField source='id' />
                  </Box>

                  <Box>
                    <Typography variant='body2' color='text.secondary'>
                      Username
                    </Typography>
                    <TextField source='username' />
                  </Box>

                  <Box>
                    <Typography variant='body2' color='text.secondary'>
                      Created
                    </Typography>
                    <DateField source='created' showTime />
                  </Box>

                  <Box>
                    <Typography variant='body2' color='text.secondary'>
                      Updated
                    </Typography>
                    <DateField source='updated' showTime />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </SimpleForm>
    </Edit>
  );
};

const AvatarDisplay = () => {
  const record = useRecordContext();
  if (!record?.avatar) return null;
  return (
    <img
      src={record.avatar}
      alt='User Avatar'
      style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
    />
  );
};

export default UserEdit;
