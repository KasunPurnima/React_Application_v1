// assets
import { ChromeOutlined } from '@ant-design/icons';

// icons
const icons = { ChromeOutlined };

// ==============================|| MENU ITEMS - APPLICATION ||============================== //

const application = {
  id: 'application',
  title: 'Application',
  type: 'group',
  children: [
    {
      id: 'sample-page',
      title: 'Sample Page',
      type: 'item',
      url: '/application/sample-page',
      icon: icons.ChromeOutlined
    },
  ]
};

export default application;
