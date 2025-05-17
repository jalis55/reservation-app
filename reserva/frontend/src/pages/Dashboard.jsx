// Dashboard.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateBooking from './CreateBooking';
import { Modal } from '@/components/Modal';

const Dashboard = () => {


  return (
    <>
      <Modal />
      <CreateBooking />
    </>
  );
};

export default Dashboard;