// assets
import { BankOutlined, HourglassOutlined,SwapOutlined,AlertOutlined } from '@ant-design/icons';
// icons
const icons = { BankOutlined, HourglassOutlined, SwapOutlined,AlertOutlined };

// ==============================|| MENU ITEMS - PARAMETER ||============================== //

const parameter = {
  id: 'parameter',
  title: 'Parameter',
  type: 'group',
  children: [
    {
      id: 'currency',
      title: 'Currency Crud Samples',
      type: 'item',
      url: '/parameter/currency-page',
      icon: icons.BankOutlined
    },
    {
      id: 'existinggroupsnew',
      title: 'Get Existing Groups New',
      type: 'item',
      url: '/parameter/get_existing-groups-new',
      icon: icons.HourglassOutlined
    },
    {
      id: 'existinggroupsold',
      title: 'Get Existing Groups Old',
      type: 'item',
      url: '/parameter/get_existing-groups-old',
      icon: icons.SwapOutlined
    },
    {
      id: 'paginationtest',
      title: 'Pagination API Test',
      type: 'item',
      url: '/parameter/get-pagiantion-api-test',
      icon: icons.AlertOutlined
    },
  ]
};

export default parameter;
