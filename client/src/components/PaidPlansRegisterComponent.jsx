import React, { useState } from 'react';
import axios from 'axios';
import getParamsEnv from '../functions/getParamsEnv';

const {API_URL_BASE} = getParamsEnv()

const PaidPlansRegisterComponent =() =>{

    const [formData, setFormData] = useState({
        
        planName: '',
        planCost: '',
        description:'',
        feature:''
    });

    const handleInputChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          // Realizar la solicitud a tu servidor Node.js
        
          const response = await axios.post(`${API_URL_BASE}/apiPaidPlans/create`, formData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          });
         
        
          // Manejar la respuesta del servidor según sea necesario
        
        } catch (error) {
          console.error('Error al enviar datos al servidor:', error);
        }
      };

    return (
        
        <div className='bg-gray-800'>
            <div className="flex justify-center m-5">
                <button id="defaultModalButton" data-modal-target="defaultModal" data-modal-toggle="defaultModal" className="block text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" type="button">
                Create product
                </button>
            </div>

            
            <div id="defaultModal" tabIndex="-1" aria-hidden="true" className=" overflow-y-auto  fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
            
                    <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Add New PaidPlan
                            </h3>
                            <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
            
                        <form action="#" onSubmit={handleSubmit} method='POST'>
                            <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="planName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                    <input onChange={handleInputChange} type="text" name="planName" id="planName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" required=""/>
                                </div>
                                {/* <div>
                                    <label htmlFor="brand" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Brand</label>
                                    <input type="text" name="brand" id="brand" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Product brand" required=""/>
                                </div> */}
                                <div>
                                    <label htmlFor="planCost" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                                    <input onChange={handleInputChange} type="number" name="planCost" id="planCost" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$2999" required=""/>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                    <textarea onChange={handleInputChange} id="description" name="description" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write product description here"></textarea>                    
                                </div> 
                                <div className="sm:col-span-2">
                                    <label htmlFor="feature" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Feature</label>
                                    <textarea onChange={handleInputChange} id="feature" name="feature" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write features here"></textarea>                    
                                </div>  
                                <div className="sm:col-span-2">
          <label htmlFor="planImage" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Image
          </label>
          <input
            onChange={handleInputChange}
            type="file"
            name="planImage"
            id="planImage"
            accept="image/*" // Aceptar cualquier tipo de imagen
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            required=""
          />
        </div>
                                
                            </div>
                            <button type="submit" className="text-white inline-flex items-center bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                Add new PaidPlan
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    
    )
}

export default PaidPlansRegisterComponent