// assets
import { BankOutlined, HourglassOutlined, SwapOutlined, AlertOutlined } from '@ant-design/icons';
// icons
const icons = { BankOutlined, HourglassOutlined, SwapOutlined, AlertOutlined };

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
      title: 'Existing Workflow Details',
      type: 'item',
      url: '/parameter/get_existing-groups-new',
      icon: icons.HourglassOutlined
    },
    {
      id: 'existinggroupsold',
      title: 'Own Requests',
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

    {
      id: 'usergroups',
      title: 'Existing Groups',
      type: 'item',
      url: '/parameter/get-user-groups',
      icon: icons.SwapOutlined
    }
  ]
};

export default parameter;
