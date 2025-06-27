import {
  DataTable,
  Edit,
  EditButton,
  Labeled,
  ReferenceManyField,
  SimpleForm,
  TextInput,
  useDefaultTitle,
  useEditContext,
} from 'react-admin';

import { Avatar } from '@mui/material';
import ThumbnailField from '../products/ThumbnailField';
import { type Product } from '../types';
import {
  formatCurrency,
  useCurrencyContext,
} from '../components/CurrencySelector/CurrencyProvider';
export interface ProductCategory {
  collectionId: string;
  collectionName: string;
  id: string;
  name: string;
  name_la: string;
  image_url: string;
  created: string;
  updated: string;
}

const Column = DataTable.Col<Product>;
const ColumnNumber = DataTable.NumberCol<Product>;

const ImageUrlField = (record: ProductCategory | any) => {
  if (!record?.image_url) return null;

  return (
    <Avatar
      src={record.image_url}
      alt={record.name}
      sx={{ width: 32, height: 32 }}
    />
  );
};

const CategoryEdit = () => {
  const { displayCurrency, convert } = useCurrencyContext();

  return (
    <Edit title={<CategoryTitle />}>
      <SimpleForm>
        <TextInput source='name' />
        <TextInput source='image_url' label='Image URL' />
        <Labeled label='resources.categories.fields.products' fullWidth>
          <ReferenceManyField
            reference='products'
            target='category_id'
            perPage={20}
          >
            <DataTable
              sx={{ maxWidth: 800, marginLeft: 0, marginRight: 'auto' }}
            >
              <Column
                sx={{ width: 25, padding: 0 }}
                field={ThumbnailField}
                label={false}
              />
              <Column source='image_url' render={ImageUrlField} />
              <ColumnNumber
                source='name'
                options={{ minimumFractionDigits: 2 }}
              />
              <Column
                label='Price'
                render={(record: Product) =>
                  `${formatCurrency(
                    convert(record.price || 0)
                  )} ${displayCurrency}`
                }
              />

              <Column align='right'>
                <EditButton />
              </Column>
            </DataTable>
          </ReferenceManyField>
        </Labeled>
      </SimpleForm>
    </Edit>
  );
};

const CategoryTitle = () => {
  const appTitle = useDefaultTitle();
  const { defaultTitle } = useEditContext();
  return (
    <>
      <title>{`${appTitle} - ${defaultTitle}`}</title>
      <span>{defaultTitle}</span>
    </>
  );
};

export default CategoryEdit;
