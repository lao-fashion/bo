import { Avatar, Typography } from '@mui/material';
import {
  BulkDeleteButton,
  CreateButton,
  DataTable,
  DateField,
  DeleteButton,
  EditButton,
  ExportButton,
  FilterButton,
  List,
  NumberInput,
  SearchInput,
  TextInput,
  TopToolbar,
  useRecordContext
} from 'react-admin';

export interface Blogs {
  collectionId: string;
  collectionName: string;
  id: string;
  image_url: string;
  title: string;
  description: string;
  video_url: string;
  count: number;
  created: string;
  updated: string;
}

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

const ImageUrlField = (record: Blogs) => {
  if (!record?.image_url) return null;

  return (
    <Avatar
      src={record.image_url}
      alt={record.collectionName}
      sx={{ width: 32, height: 32 }}
    />
  );
};

const Column = DataTable.Col<Blogs>;

export const BlogList = () => (
  <List
    filters={blogFilters}
    actions={<BlogListActions />}
    sort={{ field: 'created', order: 'DESC' }}
    perPage={25}
  >
    <DataTable bulkActionButtons={<BlogBulkActions />} rowClick='edit'>
      <Column source='image_url' label='Image' render={ImageUrlField} />
      {/* <Column source='id' /> */}
      <Column source='title' />
      <Column source='description' render={DescriptionField} />
      {/* <UrlField source='video_url' /> */}
      <Column source='count' />
      <Column
        source='created'
        label='Created'
        render={(record) => <DateField source='created' record={record} showTime />}
      />
      <Column
        source='updated'
        label='Updated'
        render={(record) => <DateField source='updated' record={record} showTime />}
      />
      <Column
        source='edit'
        field={DateField}
        label='Edit'
        render={EditButton}
      />
      <Column
        source='delete'
        field={DateField}
        label='Delete'
        render={DeleteButton}
      />
    </DataTable>
  </List>
);
