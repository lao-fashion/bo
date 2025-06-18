import { Typography } from '@mui/material';
import { LoginForm, Login as RaLogin } from 'react-admin';

const Login = () => (
  <RaLogin sx={{ background: 'none' }}>
    <Typography
      sx={{
        color: 'text.disabled',
        textAlign: 'center',
      }}
    >
      Hint: demo / demo
    </Typography>
    <LoginForm />
  </RaLogin>
);

export default Login;
