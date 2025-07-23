// App.js
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import AuthProvider from './auth/AuthContext';
import RedirectRoute from './auth/RedirectRoute';
import RoleRoute from './auth/RoleRoute';
import RequiredAuth from './auth/ReuiredRoute';
// import RoleRoute from './auth/RoleRoute';
import Layout from './Layouts/Layout';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import CurrentDateReport from './reports/CurrentDateReport';
import AsonDateReport from './reports/AsonDateReport';
import DateRangeReport from './reports/DateRangeReport';
import Unauthorized from './pages/Unauthorized';


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequiredAuth>
        <Layout />
      </RequiredAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path:'/curdt-report', element: <CurrentDateReport/> },
      { path:'/asondt-report', element: <AsonDateReport/> },
    // role-restricted
    {
      path: '/rangedt-report',
      element: (
        <RoleRoute allowedRoles={['admin', 'superAdmin']}>
          <DateRangeReport />
        </RoleRoute>
      )
    }
   
    ],
  },
  {
    element: <RedirectRoute />,
    children: [
      { path: 'login', element: <Login /> },
      { path:'register', element: <Registration /> },
      // ... other public routes
    ],
  },
  {
    path: '/unauthorized',
    element:<Unauthorized/>
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
