import { Box, Container } from '@mui/material';
import theme from '../styles/theme';

const Loading = () => {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: theme.palette.background.default,
        zIndex: 9999,
      }}
    >
      {/* Centered loading circle */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {/* Loading circles with gift icon in the middle */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-yellow-700"></div>
          </div>
        </Box>
      </Box>
    </Container>
  );
};

export default Loading;
