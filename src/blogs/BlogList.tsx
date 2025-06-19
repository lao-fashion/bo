import { Typography } from '@mui/material';
import {
  BulkDeleteButton,
  CreateButton,
  Datagrid,
  DateField,
  DeleteButton,
  EditButton,
  ExportButton,
  FilterButton,
  List,
  NumberField,
  NumberInput,
  SearchInput,
  TextField,
  TextInput,
  TopToolbar,
  UrlField,
  useRecordContext,
} from 'react-admin';

const DescriptionField = () => {
  const record = useRecordContext();
  if (!record?.description) return null;

  // Strip HTML tags and limit text length for list view
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const plainText = stripHtml(record.description);
  const truncatedText =
    plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;

  return (
    <Typography
      variant='body2'
      sx={{
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {truncatedText}
    </Typography>
  );
};

const blogFilters = [
  <SearchInput source='q' alwaysOn />,
  <TextInput source='title' />,
  <TextInput source='description' />,
  <NumberInput source='count' />,
];

const BlogListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const BlogBulkActions = () => <BulkDeleteButton />;

export const BlogList = () => (
  <List
    filters={blogFilters}
    actions={<BlogListActions />}
    sort={{ field: 'created', order: 'DESC' }}
    perPage={25}
  >
    <Datagrid bulkActionButtons={<BlogBulkActions />} rowClick='edit'>
      <TextField source='id' />
      <TextField source='title' />
      <DescriptionField />
      <UrlField source='image_url' />
      {/* <UrlField source='video_url' /> */}
      <NumberField source='count' />
      <DateField source='created' />
      <DateField source='updated' />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
