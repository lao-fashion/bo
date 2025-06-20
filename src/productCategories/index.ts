import CategoryIcon from '@mui/icons-material/Category';
import ProductCategoryList from './ProductCategoryList';
import ProductCategoryEdit from './ProductCategoryEdit';
import ProductCategoryCreate from './ProductCategoryCreate';
import ProductCategoryShow from './ProductCategoryShow';

export default {
    list: ProductCategoryList,
    edit: ProductCategoryEdit,
    create: ProductCategoryCreate,
    show: ProductCategoryShow,
    icon: CategoryIcon,
    recordRepresentation: 'name',
};