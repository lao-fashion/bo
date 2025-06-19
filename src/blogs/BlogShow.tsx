import {
  DateField,
  DeleteButton,
  EditButton,
  RichTextField,
  Show,
  SimpleShowLayout,
  TextField,
  TopToolbar,
  UrlField,
} from 'react-admin';

// Removed RichTextField import because 'ra-input-rich-text' does not export RichTextField.

const BlogShowActions = () => (
  <TopToolbar>
    <EditButton />
    <DeleteButton />
  </TopToolbar>
);

export const BlogShow = () => (
  <Show actions={<BlogShowActions />}>
    <SimpleShowLayout>
      <TextField source='id' />
      <TextField source='title' />
      <RichTextField source='description' />
      <TextField source='title' />
      <TextField source='description' />
      <UrlField source='image_url' />
      <DateField source='created' />
      <DateField source='updated' />
    </SimpleShowLayout>
  </Show>
);
