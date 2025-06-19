import { LoadingIndicator } from 'react-admin';

import { ThemeSwapper } from '../themes/ThemeSwapper';
import CurrencySelector from '../components/CurrencySelector/CurrencySelector';

export const AppBarToolbar = () => (
  <>
    {/* <LocalesMenuButton /> */}
    {/* Currency selector */}
    <CurrencySelector  />

    <ThemeSwapper />
    <LoadingIndicator />
  </>
);
