import { useQuery } from '@tanstack/react-query';
import { fetchAllPocketbaseDocuments } from '../api/pocketbase';
import { CurrencyItem } from '../model/currency';

export const useCurrency = () => {
  const { data: currencies } = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      return await fetchAllPocketbaseDocuments<CurrencyItem>('currency');
    },
  });

  return {
    currencies,
  };
};
