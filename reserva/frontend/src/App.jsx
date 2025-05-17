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
      // Add more protected routes here
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
