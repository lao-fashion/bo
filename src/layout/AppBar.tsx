import { Box, Theme, useMediaQuery } from '@mui/material';
import { AppBar, TitlePortal } from 'react-admin';

import { AppBarToolbar } from './AppBarToolbar';

const CustomAppBar = () => {
  const isLargeEnough = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.up('sm')
  );
  return (
    <AppBar color='secondary' toolbar={<AppBarToolbar />}>
      <TitlePortal />
      {isLargeEnough && <Box component='span' sx={{ flex: 1 }} />}
    </AppBar>
  );
};

export default CustomAppBar;
