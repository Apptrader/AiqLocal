import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/actions';
import NavbarComponent from './NavbarComponent';
import getParamsEnv from '../functions/getParamsEnv';
import './styles/loader.css';
import toast from 'react-hot-toast';
import ToasterConfig from './Toaster';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './styles/custom-phone-input.css';

const { API_URL_BASE } = getParamsEnv();

const RegisterUserComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        UserName: '',
        UserLastName: "",
        Email: '',
        Password: '',
        ConfirmPassword: '',
        UserCode: '',
        Phone: '',
        CodeReferenced: '',
        idPaidPlanForUser: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let error = '';

        if (name === 'UserName' && !value.trim()) {
            error = 'User Name is required';
        } else if (name === 'Email' && (!value.trim() || !/\S+@\S+\.\S+/.test(value))) {
            error = 'Email is invalid';
        } else if (name === 'Password' && !value.trim()) {
            error = 'Password is required';
        } else if (name === 'ConfirmPassword' && value !== formData.Password) {
            error = 'Passwords do not match';
        }

        setFormData({
            ...formData,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: error,
        });
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formData.UserName) {
            errors.UserName = 'User Name is required';
            isValid = false;
        }
        if (!formData.UserLastName) {
            errors.UserLastName = 'User Last Name is required';
            isValid = false;
        }

        if (!formData.Email) {
            errors.Email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
            errors.Email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.Password) {
            errors.Password = 'Password is required';
            isValid = false;
        }

        if (!formData.ConfirmPassword) {
            errors.ConfirmPassword = 'Confirm Password is required';
            isValid = false;
        } else if (formData.Password !== formData.ConfirmPassword) {
            errors.ConfirmPassword = 'Passwords do not match';
            isValid = false;
        }

        if (!formData.Phone) {
            errors.Phone = 'Phone is required';
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Mostrar el loader

        if (validateForm()) {
            try {
                const response = await axios.post(`${API_URL_BASE}/apiUser/register`, formData, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data.created === 'ok') {
                    setLoading(false); // Ocultar el loader
                    dispatch(setUser(response.data));
                    navigate('/home');
                }
            } catch (error) {
                setLoading(false); // Ocultar el loader
                let errorMessage = '';
                if (
                    error.response.data.message ===
                    'llave duplicada viola restricción de unicidad «users_Email_key»'
                ) {
                    errorMessage = 'Email already in use';
                } else if (
                    error.response.data.message ===
                    'llave duplicada viola restricción de unicidad «users_UserName_key»'
                ) {
                    errorMessage = 'UserName already in use';
                } else if (
                    error.response.data.message ===
                    'llave duplicada viola restricción de unicidad «users_Phone_key»'
                ) {
                    errorMessage = 'Phone already in use';
                } else {
                    errorMessage = 'There was an error in the registration, please check the fields and try again.';
                }
                setLoading(false)
                toast.error(errorMessage);
                console.error('Error al enviar datos al servidor:', error);
            }
        }
        setLoading(false)
    };

    return (
        <>
            <NavbarComponent />
            <div className="bg-black min-h-screen flex flex-col mt-[-60px]">
                <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                    <div className="bg-black px-6 py-8 rounded shadow-md w-full">
                        <img
                            className="mx-auto h-10 w-auto"
                            src="https://static.wixstatic.com/media/39c6da_c313300b528e4aa284d37b4c31f951a8~mv2.png/v1/crop/x_83,y_128,w_336,h_226/fill/w_154,h_104,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Untitled%20design.png"
                            alt="Your Company"
                        />
                        <h1 className="mt-10 mb-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                            Sign up
                        </h1>

                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className="mb-4">
                                <label htmlFor="UserName" className="block font-bold leading-6 text-white mt-4">
                                    User Name
                                </label>
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    className={`pl-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2 bg-gray-700 ${errors.UserName ? 'border-red-500' : ''
                                        }`}
                                    name="UserName"
                                    placeholder=""
                                />
                                {errors.UserName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.UserName}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="UserName" className="block font-bold leading-6 text-white mt-4">
                                   User Last Name
                                </label>
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    className={`pl-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2 bg-gray-700 ${errors.UserLastName ? 'border-red-500' : ''
                                        }`}
                                    name="UserLastName"
                                    placeholder=""
                                />
                                {errors.UserLastName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.UserLastName}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="email" className="block font-bold leading-6 text-white mt-4">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2 bg-gray-700"
                                    name="Email"
                                    onChange={handleInputChange}
                                    placeholder=""
                                />
                                {errors.Email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.Email}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="Password" className="block font-bold leading-6 text-white mt-4">
                                    Password
                                </label>
                                <input
                                    onChange={handleInputChange}
                                    type="password"
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2 bg-gray-700"
                                    name="Password"
                                    placeholder=""
                                />
                                {errors.Password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.Password}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="ConfirmPassword" className="block font-bold leading-6 text-white mt-4">
                                    Confirm Password
                                </label>
                                <input
                                    onChange={handleInputChange}
                                    type="password"
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mt-2 bg-gray-700"
                                    name="ConfirmPassword"
                                    placeholder=""
                                />
                                {errors.ConfirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.ConfirmPassword}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="Phone" className="block font-bold leading-6 text-white mt-4">
                                    Phone
                                </label>
                                <PhoneInput
                                    inputProps={{
                                        name: 'Phone',
                                        required: true,
                                        autoFocus: true,
                                        style: {
                                            backgroundColor: '#374151',
                                            color: 'white',
                                            borderRadius: '0.375rem',
                                            border: 'none'
                                        }
                                    }}
                                    containerStyle={{
                                        marginTop: '0.5rem',
                                        backgroundColor: '#374151',
                                        borderRadius: '0.375rem',
                                        border: '1px solid white'
                                    }}
                                    dropdownStyle={{
                                        backgroundColor: 'white'
                                    }}
                                    country={'us'}
                                    value={formData.Phone}
                                    onChange={(phone) => setFormData({ ...formData, Phone: phone })}
                                />

                                {errors.Phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.Phone}</p>
                                )}
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center items-center mt-6">
                                    <span className="loader"></span>
                                </div>
                            ) : (
                                <button
                                    type="submit"
                                    className="flex justify-center items-center mt-6 w-full rounded-md bg-blue-600 px-3 py-1.5 font-bold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Create Account
                                </button>
                            )}
                        </form>

                        <div className="text-center text-sm text-white mt-4 font-bold">
                            By signing up, you agree to the{' '}
                            <a className="ml-2 no-underline border-b border-grey-dark text-gray-500" href="#">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a className="ml-2 no-underline border-b border-grey-dark text-gray-500" href="#">
                                Privacy Policy
                            </a>
                        </div>
                    </div>

                    <div className="text-white font-bold mt-6">
                        Already have an account?
                        <a className="pl-2 font-bold leading-6 text-blue-400 hover:text-blue-300" href="/loginUser">
                            Log in
                        </a>
                        .
                    </div>
                </div>
            </div>
            <ToasterConfig />
        </>
    );
};

export default RegisterUserComponent;