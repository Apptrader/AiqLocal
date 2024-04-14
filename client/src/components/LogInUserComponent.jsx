import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/actions';
import NavbarComponent from './NavbarComponent';
import toast from 'react-hot-toast';
import ToasterConfig from './Toaster';
import getParamsEnv from '../functions/getParamsEnv';
import ForgotPasswordModal from './modals/ForgotPasswordModal'; // Import the ForgotPasswordModal component

const { API_URL_BASE, VITE_HOME, VITE_REGISTER } = getParamsEnv();

const LogInUserComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
  });
  const [errors, setErrors] = useState({});
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false); // State to manage visibility of forgot password modal

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.Email) {
      errors.Email = 'Email is required';
      isValid = false;
    }

    if (!formData.Password) {
      errors.Password = 'Password is required';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setLoading(true);
        const response = await axios.post(`${API_URL_BASE}/apiUser/login`, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setLoading(false);
        dispatch(setUser(response.data));
        navigate(VITE_HOME);
      } catch (error) {
        setLoading(false);
        console.error('Error sending data to server:', error);
        toast.error(`${error.response.data.message ? error.response.data.message : "Log in Error, please try again"}`)
      }
    }
  };

  const forgotPassword = async () => {
    try {
      await axios.post(`${API_URL_BASE}/apiUser/forgotPassword`, { email: formData.Email });
    } catch (error) {
      console.log(error)
    }
  };

  const handleForgotPassword = () => {

    
      setShowForgotPasswordModal(true);
    
  };

  return (
    <>
      <NavbarComponent />
      <div className="mt-[-150px] bg-black flex min-h-full flex-col text-white justify-center px-6 py-6 lg:px-8 text-black h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://static.wixstatic.com/media/39c6da_c313300b528e4aa284d37b4c31f951a8~mv2.png/v1/crop/x_83,y_128,w_336,h_226/fill/w_154,h_104,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Untitled%20design.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-black">
          <form className="space-y-6" onSubmit={handleSubmit} method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-sm leading-6 text-white font-bold"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="Email"
                  type="email"
                  autoComplete="off"
                  required
                  value={formData.Email}
                  onChange={handleInputChange}
                  className={`block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-700 text-white ${errors.Email ? 'border-red-500' : ''}`}
                />
                {errors.Email && (
                  <p className="text-red-500 text-sm mt-1">{errors.Email}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm leading-6 text-white font-bold"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                    onClick={handleForgotPassword} // Handle forgot password click
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="Password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.Password}
                  onChange={handleInputChange}
                  className={`block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-700 text-white ${errors.Password ? 'border-red-500' : ''}`}
                />
                {errors.Password && (
                  <p className="text-red-500 text-sm mt-1">{errors.Password}</p>
                )}
              </div>
            </div>
            <div className="mt-6">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <span className="loader"></span>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full rounded-md bg-blue-600 px-3 py-1.5 font-bold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Log In
                </button>
              )}
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Not a member?
            <Link to={VITE_REGISTER} className="ml-1 font-semibold text-indigo-600 hover:text-indigo-500">          
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      {showForgotPasswordModal && (
        <ForgotPasswordModal // Render the ForgotPasswordModal component
        onSubmit={(email) => {
          // Handle form submission in the modal
          forgotPassword(email)
            .then(() => {
              toast.success('Password reset email sent successfully');
            })
            .catch(() => {
              toast.error('Error sending password reset email');
            });
        }}
        setShowForgotPasswordModal={setShowForgotPasswordModal}
      />
        
      )}
      <ToasterConfig />
    </>
  );
};

export default LogInUserComponent;

/*
<ForgotPasswordModal // Render the ForgotPasswordModal component
       
       onClose={() => setShowForgotPasswordModal(false)} // Handle modal close
       onSubmit={(email) => {
         // Handle form submission in the modal
         forgotPassword(email)
           .then(() => {
             toast.success('Password reset email sent successfully');
           })
           .catch(() => {
             toast.error('Error sending password reset email');
           });
       }}
     />*/