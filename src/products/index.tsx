import ProductIcon from '@mui/icons-material/Collections';
import ProductList from './ProductList';
import ProductEdit from './ProductEdit';
import ProductCreate from './ProductCreate';
import ProductShow from './ProductShow';

export default {
    list: ProductList,
    create: ProductCreate,
    edit: ProductEdit,
    show: ProductShow,
    icon: ProductIcon,
    recordRepresentation: (record: any) => record.name || `Product ${record.id}`,
};
