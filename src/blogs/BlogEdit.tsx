import { lazy } from 'react';
import {
  DateField,
  DeleteButton,
  Edit,
  FormDataConsumer,
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
      {/* <TextField source='id' /> */}
      <TextInput source='title' validate={[required()]} fullWidth />
      <RichTextInput source='description' validate={[required()]} fullWidth />
      <TextInput source='image_url' fullWidth />
      {/* <TextInput source='video_url' fullWidth /> */}
      <NumberInput source='count' />
      {/* <DateField source='created' /> */}
      {/* <DateField source='updated' /> */}

      <h3>Preview</h3>
      <FormDataConsumer>
        {({ formData }) => (
          <div
            style={{
              marginTop: 2,
              padding: 16,
              border: '1px solid #ccc',
              borderRadius: 8,
            }}
          >
            <h2>{formData.title}</h2>
            {formData.image_url && (
              <img
                src={formData.image_url}
                alt='Preview'
                style={{ marginTop: 16, maxWidth: '100%', height: 'auto' }}
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: formData.description }} />
          </div>
        )}
      </FormDataConsumer>
    </SimpleForm>
  </Edit>
);
