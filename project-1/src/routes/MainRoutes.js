import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - application
const SamplePage = Loadable(lazy(() => import('pages/application/SamplePage')));

// render - parameter
const CurrencyPage = Loadable(lazy(() => import('pages/parameter/currency/CurrencyPage')));
const CompanyPage = Loadable(lazy(() => import('pages/parameter/company/CompanyPage')));



// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    }, 
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'application',
      children: [
        {
          path: 'sample-page',
          element: <SamplePage />
        }
      ]
    },
    {
      path: 'parameter',
      children: [
        {
          path: 'currency-page',
          element: <CurrencyPage />
        },
        {
          path: 'company-page',
          element: <CompanyPage />
        }
      ]
    },
  ]
};

export default MainRoutes;
