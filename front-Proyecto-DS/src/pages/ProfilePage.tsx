import React from 'react';
import { useAuth } from '../context/AuthContext';
import DoctorProfileFields from '../components/DoctorProfileFields';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <h1>Profile Page</h1>
      <p>This is your profile page. You can modify your information here.</p>
      {user && user.tipoUsuarioId === 2 && <DoctorProfileFields />}
    </div>
  );
};

export default ProfilePage;
