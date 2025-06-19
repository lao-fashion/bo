import { lazy } from 'react';
import {
  Create,
  NumberInput,
  required,
  SimpleForm,
  TextInput,
} from 'react-admin';

const RichTextInput = lazy(() =>
  import('ra-input-rich-text').then((m) => ({ default: m.RichTextInput }))
);

export const BlogCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source='title' validate={[required()]} fullWidth />
      <RichTextInput source='description' validate={[required()]} fullWidth />
      <TextInput source='image_url' fullWidth />
      <TextInput source='video_url' fullWidth />
      <NumberInput source='count' defaultValue={0} />
    </SimpleForm>
  </Create>
);
