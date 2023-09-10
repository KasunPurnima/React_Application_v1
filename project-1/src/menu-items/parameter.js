// assets
import { BankOutlined } from '@ant-design/icons';
// icons
const icons = { BankOutlined };

// ==============================|| MENU ITEMS - PARAMETER ||============================== //

const parameter = {
  id: 'parameter',
  title: 'Parameter',
  type: 'group',
  children: [
    {
      id: 'currency',
      title: 'Currency',
      type: 'item',
      url: '/parameter/currency-page',
      icon: icons.BankOutlined
    },
    {
      id: 'company',
      title: 'Company',
      type: 'item',
      url: '/parameter/company-page',
      icon: icons.BankOutlined
    },
  ]
};

export default parameter;
