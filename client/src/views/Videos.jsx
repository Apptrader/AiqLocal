import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/NavbarComponent';
import PartnersComponent from '../components/PartnersComponent';
import FooterComponent from '../components/FooterComponent';
import VideosListComponent from '../components/VideosListComponent';
import VideosHeaderComponent from '../components/VideosHeaderComponent';
import { useSelector } from 'react-redux';

const Videos = () => {
  const user = useSelector((state) => state?.user?.userFound); // <-- Asegurando que state?.user esté definido
  const navigate = useNavigate();
  const [hasPlan, setHasPlan] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log(user)

  useEffect(() => {
    setIsLoggedIn(!!user);
    if (user && !user.idPaidPlan) {
      setHasPlan(false);
    }
  }, [user]);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col ">
        <NavbarComponent />
        <div className="flex flex-grow justify-center items-center  bg-black text-white text-center p-10">
          <div className="flex flex-col mt-32 items-center" style={{ height: '40vh' }}>
            <h1 className="text-4xl font-bold mb-4">You are not logged in</h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => navigate('/login')}
            >
              Log In
            </button>
          </div>
        </div>
        <div className="flex-grow">
          <PartnersComponent />
        </div>
        <FooterComponent />
      </div>
    );
  }

  if (!hasPlan) {
    return (
      <div className="flex flex-col ">
        <NavbarComponent />
        <div className="flex flex-grow justify-center items-center  bg-black text-white text-center p-10">
          <div className="flex flex-col mt-32 items-center" style={{ height: '40vh' }}>
            <h1 className="text-4xl font-bold mb-4">User has no plan</h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => navigate('/paidPlansList')}
            >
              Get Plan
            </button>
          </div>
        </div>
        <div className="flex-grow">
          <PartnersComponent />
        </div>
        <FooterComponent />
      </div>
    );
  }

  return (
    <div className="bg-black">
      <NavbarComponent />
      <VideosHeaderComponent />
      <VideosListComponent />
      <PartnersComponent />
      <FooterComponent />
    </div>
  );
};

export default Videos;
