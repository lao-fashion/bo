import { lazy } from 'react';
import {
  DateField,
  DeleteButton,
  Edit,
  NumberInput,
  required,
  ShowButton,
  SimpleForm,
  TextField,
  TextInput,
  TopToolbar,
} from 'react-admin';

const RichTextInput = lazy(() =>
  import('ra-input-rich-text').then((m) => ({ default: m.RichTextInput }))
);

const BlogEditActions = () => (
  <TopToolbar>
    <ShowButton />
    <DeleteButton />
  </TopToolbar>
);

export const BlogEdit = () => (
  <Edit actions={<BlogEditActions />}>
    <SimpleForm>
      <TextField source='id' />
      <TextInput source='title' validate={[required()]} fullWidth />
      <RichTextInput source='description' validate={[required()]} fullWidth />
      <TextInput source='image_url' fullWidth />
      <TextInput source='video_url' fullWidth />
      <NumberInput source='count' />
      <DateField source='created' />
      <DateField source='updated' />
    </SimpleForm>
  </Edit>
);
