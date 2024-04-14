import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import getParamsEnv from './../../functions/getParamsEnv.js';
import { PaymentElement } from '@stripe/react-stripe-js';
const { VITE_PAYMENT_SUCCES, VIT_FRONTEND_URL } = getParamsEnv()

const CheckOutModal = ({ setShowStripeCard, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const {error: submitError} = await elements.submit();
    if (submitError) {
      console.log(submitError);
      return;
    }

    const {error} = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${VIT_FRONTEND_URL}${VITE_PAYMENT_SUCCES}`,
      },
      // Uncomment below if you only want redirect for redirect-based payments
      // redirect: "if_required",
    });

    if (error) {
      console.log('Error during payment:', error);
    } else {
      // Aquí puedes redirigir al usuario a la página de éxito
      window.location.href = VITE_PAYMENT_SUCCES;
    }

    setIsProcessing(false);
  };

  const closeModal = () => {
    setShowStripeCard(false)
  }

  return (
    <div className="fixed z-20 top-0 left-0 flex items-center justify-center w-full h-full bg-black" style={{ background: "rgba(0, 0, 0, 0.70)" }}>
      <div className="modal-content bg-white font-bold p-6 rounded-md shadow-md max-w-md w-full">
        <div className='w-full flex'>
          <button className="text-black ml-auto" onClick={closeModal}> X </button>
        </div>
        <div>
          <form className="flex flex-col gap-5 text-black" onSubmit={handleSubmit}>
            <label className="font-bold text-xl">
              Card Details
              {/* <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              /> */}
              <PaymentElement />
            </label>
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-extrabold p-3 rounded-full" type="submit" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Pay now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckOutModal;