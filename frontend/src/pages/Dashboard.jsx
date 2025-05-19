// Dashboard.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateBooking from './CreateBooking';
import { Modal } from '@/components/Modal';
import DepartmentCard from '../components/DepartmentCard';

const Dashboard = () => {


  return (
    <>
     
      <CreateBooking />
    </>
  );
};

export default Dashboard;
