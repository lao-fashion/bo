import * as React from 'react';
import { Layout } from 'react-admin';
import AppBar from './AppBar';
import Menu from './Menu';

export default ({ children }: { children: React.ReactNode }) => (
  <Layout
    appBar={AppBar}
    menu={Menu}
    sx={{
      backgroundColor: (theme) =>
        (theme.vars || theme).palette.background.default,
    }}
  >
    {children}
  </Layout>
);
