import { Box } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import {
  DashboardMenuItem,
  MenuItemLink,
  MenuProps,
  useSidebarState,
  useTranslate,
} from 'react-admin';

import blogs from '../blogs';
import categories from '../categories';
import customers from '../customers';
import orders from '../orders';
import products from '../products';
import visitors from '../visitors';

type MenuName = 'menuCatalog' | 'menuSales' | 'menuCustomers';

const Menu = ({ dense = false }: MenuProps) => {
  const [state, setState] = useState({
    menuCatalog: true,
    menuSales: true,
    menuCustomers: true,
  });
  const translate = useTranslate();
  const [open] = useSidebarState();

  const handleToggle = (menu: MenuName) => {
    setState((state) => ({ ...state, [menu]: !state[menu] }));
  };

  return (
    <Box
      sx={{
        width: open ? 200 : 50,
        marginTop: 1,
        marginBottom: 1,
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
      className={clsx({
        'RaMenu-open': open,
        'RaMenu-closed': !open,
      })}
    >
      <DashboardMenuItem />
      <MenuItemLink
        to='/orders'
        state={{ _scrollToTop: true }}
        primaryText={translate(`resources.orders.name`, {
          smart_count: 2,
        })}
        leftIcon={<orders.icon />}
        dense={dense}
      />
      <MenuItemLink
        to='/blogs'
        state={{ _scrollToTop: true }}
        primaryText={translate(`resources.blogs.name`, {
          smart_count: 2,
        })}
        leftIcon={<blogs.icon />}
        dense={dense}
      />
      <MenuItemLink
        to='/customers'
        state={{ _scrollToTop: true }}
        primaryText={translate(`resources.customers.name`, {
          smart_count: 2,
        })}
        leftIcon={<customers.icon />}
        dense={dense}
      />
      <MenuItemLink
        to='/products'
        state={{ _scrollToTop: true }}
        primaryText={translate(`resources.products.name`, {
          smart_count: 2,
        })}
        leftIcon={<products.icon />}
        dense={dense}
      />
      <MenuItemLink
        to='/categories'
        state={{ _scrollToTop: true }}
        primaryText={translate(`resources.categories.name`, {
          smart_count: 2,
        })}
        leftIcon={<categories.icon />}
        dense={dense}
      />
    </Box>
  );
};

export default Menu;
