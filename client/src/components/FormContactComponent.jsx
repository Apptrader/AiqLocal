import React, { useState } from 'react';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import getParamsEnv from '../functions/getParamsEnv';
import toast from 'react-hot-toast';
import ToasterConfig from './Toaster';

const { API_URL_BASE } = getParamsEnv();

const ContactForm = () => {
  const isDesktopOrLaptop = useMediaQuery({ minDeviceWidth: 800 });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL_BASE}/apiContact/contact`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:5173',
          },
        }
      );

      if(response.data.sended === "ok") {
        toast.success("The email was sent successfully")
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: '',
        })
      }

    } catch (error) {
      toast.error(error)
      console.error('Error sending form data to server:', error);
    }
  };

  return (
    <>
    <form className="max-w-4xl mx-auto p-3" onSubmit={handleSubmit}>
      <div className={`grid grid-cols-1 gap-4 ${isDesktopOrLaptop ? 'md:grid-cols-3' : ''}`}>
        <div>
          <label htmlFor="firstName" className="text-white font-bold">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="p-2 border rounded-md w-full text-black font-bold"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="text-white font-bold">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="p-2 border rounded-md w-full text-black font-bold"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-white font-bold">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded-md w-full text-black font-bold"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="text-white font-bold">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="p-2 border rounded-md w-full text-black font-bold"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button type="submit" className="bg-blue-500 px-6 py-2 text-white rounded-md text-black font-bold">
          Send
        </button>
      </div>
    </form>
    <ToasterConfig />
    </>
  );
};

export default ContactForm;