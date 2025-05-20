// App.js
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RedirectRoute from './RedirectRoute';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layouts/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DailyReports from './reports/DailyReports';
import CurrentDateReport from './reports/CurrentDateReport';
import AsonDateReport from './reports/AsonDateReport';
import DateRangeReport from './reports/DateRangeReport';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path:'/curdt-report', element: <CurrentDateReport/> },
      { path:'/asondt-report', element: <AsonDateReport/> },
      { path:'/rangedt-report', element: <DateRangeReport/> },

    ],
  },
  {
    element: <RedirectRoute />,
    children: [
      { path: 'login', element: <Login /> },
      // Add more public routes here
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
