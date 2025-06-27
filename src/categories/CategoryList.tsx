import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { humanize } from 'inflection';
import {
  Edit,
  EditButton,
  List,
  RecordContextProvider,
  SimpleForm,
  TextInput,
  useDefaultTitle,
  useListContext,
  useRedirect,
} from 'react-admin';

import LinkToRelatedProducts from './LinkToRelatedProducts';

export interface Category {
  collectionId: string;
  collectionName: string;
  id: string;
  name: string;
  name_la: string;
  image_url: string;
  created: string;
  updated: string;
}

const CategoriesTitle = () => {
  const title = useDefaultTitle();
  const { defaultTitle } = useListContext();
  return (
    <>
      <title>{`${title} - ${defaultTitle}`}</title>
      <span>{defaultTitle}</span>
    </>
  );
};

const CategoryList = () => (
  <List
    sort={{ field: 'name', order: 'ASC' }}
    perPage={20}
    pagination={false}
    component='div'
    actions={false}
    title={<CategoriesTitle />}
  >
    <CategoryGrid />
  </List>
);

const CategoryGrid = () => {
  const { data, error, isPending } = useListContext<Category>();
  const redirect = useRedirect();
  if (isPending) {
    return null;
  }
  if (error) {
    return null;
  }
  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      {data.map((record) => (
        <RecordContextProvider key={record.id} value={record}>
          <Grid key={record.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
            <Card>
              <CardActionArea
                onClick={() => redirect(`/categories/${record.id}`)}
              >
                <CardMedia
                  image={`${record?.image_url}`}
                  sx={{ height: 140 }}
                />
                <CardContent sx={{ paddingBottom: '0.5em' }}>
                  <Typography variant='h5' component='h2' align='center'>
                    {humanize(record.name)}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions
                sx={{
                  '.MuiCardActions-spacing': {
                    display: 'flex',
                    justifyContent: 'space-around',
                  },
                }}
              >
                <LinkToRelatedProducts />
                <EditButton />
              </CardActions>
            </Card>
          </Grid>
        </RecordContextProvider>
      ))}
    </Grid>
  );
};

export const CategoryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source='name' fullWidth />
      <TextInput source='image_url' fullWidth />
    </SimpleForm>
  </Edit>
);

export default CategoryList;
