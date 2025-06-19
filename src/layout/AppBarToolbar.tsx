import { LoadingIndicator, LocalesMenuButton } from 'react-admin';
import CurrencySelector from '../components/CurrencySelector/CurrencySelector';

export const AppBarToolbar = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <CurrencySelector />
    <LocalesMenuButton />
    <LoadingIndicator />
  </div>
);
