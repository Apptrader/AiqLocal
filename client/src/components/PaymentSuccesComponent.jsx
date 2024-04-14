import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from './NavbarComponent';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/actions';
import getParamsEnv from '../functions/getParamsEnv';

const { API_URL_BASE } = getParamsEnv();

const PaymentSuccessComponent = () => {
  const navigate = useNavigate();
  const plan = useSelector((state) => state?.plan);
  const token = useSelector((state) => state?.user.token);
  const dispatch = useDispatch();

  // UseRef para almacenar el estado de la bandera
  const updateUserPlanRequested = useRef(false);

  useEffect(() => {

    const updateUserPlan = async () => {
      try {
        const response = await axios.post(
          `${API_URL_BASE}/apiUser/updateUserPlan`,
          { plan },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          }
        );

        console.log(response)

        if (response.data.updated === "ok") {
          const updateUser = {
            token: token,
            userFound: response.data.userFound
          }
          dispatch(setUser(updateUser))
        } else {
          console.log("Not okay");
        }
      } catch (error) {
        console.error("Error updating user plan:", error);
      }
    }

    // Realizar la llamada solo si aún no se ha realizado
    if (!updateUserPlanRequested.current) {
      updateUserPlanRequested.current = true;
      updateUserPlan();
    }

  }, [])

  return (
    <div>
      <NavbarComponent />
      <div className="flex bg-black items-center justify-center h-screen text-white font-bold">
        <div className="bg-black p-8 rounded-lg shadow-lg border border-blue-500 text-center mb-auto">
          <img
            src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1706298897/tickVerde_g2wk3p.png"
            alt="Imagen de éxito"
            className="mb-4 h-14 w-14"
          />
          <p className="text-4xl font-bold mb-4">The payment was successful.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessComponent;
