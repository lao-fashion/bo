import { People } from '@mui/icons-material';

import UserList from './UserList';
import UserCreate from './UserCreate';
import UserEdit from './UserEdit';
import UserShow from './UserShow';

const users = {
    list: UserList,
    create: UserCreate,
    edit: UserEdit,
    show: UserShow,
    icon: People,
};

export default users;