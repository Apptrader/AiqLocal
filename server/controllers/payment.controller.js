import Stripe from "stripe";


import { FRONTEND_URL, SSK } from "../config.js";

const stripe = new Stripe(SSK);

export const handlePayment = async (req, res) => {
    const { product, customerInfo } = req.body;
    const { name, email, id } = customerInfo;
    console.log(product, name, email);

    try {
        let customer;

        // Verificar si el cliente ya existe en Stripe
        try {
            customer = await stripe.customers.retrieve(id);
        } catch (error) {
            // Si el cliente no existe, crearlo
            customer = await stripe.customers.create({
                name: name,
                email: email,
                id: id
            });
        }

        const currentDate = new Date();

        // Obtener el próximo mes
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        // Crear la sesión de pago con el ID del cliente
        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            line_items: [
                {
                    price: product.price, 
                    quantity: 1
                }
            ],
            mode: 'payment',
            payment_method_types: ['card'],
            success_url: `${FRONTEND_URL}/payment/success`, 
            cancel_url: `${FRONTEND_URL}/payment/cancel`,
            payment_intent_data: {
                setup_future_usage: "off_session"
            }
        });
        res.json(session);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

export const handleSubscription = async (req, res) => {
    const { product, name } = req.body;
    console.log(product, name);

    try {
        const currentDate = new Date();
        
        // Calcular el final del período de prueba en 30 días
        const trialEnd = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días en milisegundos

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: product.price, 
                    quantity: 1
                }
            ],
            mode: 'subscription',
            payment_method_types: ['card'],
            success_url: `${FRONTEND_URL}/payment/successSub`, 
            cancel_url: `${FRONTEND_URL}/payment/cancel`,
            subscription_data: {
                trial_end: Math.floor(trialEnd.getTime() / 1000)
            }
        });
        res.json(session);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};

 

//CODIGO DEL DEPLOY

/* const stripe = new Stripe(SSK);

export const handlePayment = async (req, res) => {
    const { product, customerInfo } = req.body;
    const { name, email } = customerInfo;
    console.log(product, name, email);

    try {
        // Crear el cliente en Stripe
        const customer = await stripe.customers.create({
            name: name,
            email: email,
        });

        const currentDate = new Date();

        // Obtener el próximo mes
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        // Crear la sesión de pago con el ID del cliente
        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            line_items: [
                {
                    price: product.price, 
                    quantity: 1
                }
            ],
            mode: 'payment',
            payment_method_types: ['card'],
            success_url: `${FRONTEND_URL}/payment/success`, 
            cancel_url: `${FRONTEND_URL}/payment/cancel`,
            payment_intent_data: {
                setup_future_usage: "off_session"
            }
        });
        res.json(session);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};
export const handleSubscription = async (req, res) => {
    const { product, name } = req.body;
    console.log(product, name);

    try {

        const currentDate = new Date();

        // Obtener el próximo mes
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: product.price, 
                    quantity: 1
                }
            ],
            mode: 'subscription',
            payment_method_types: ['card'],
            success_url: `${FRONTEND_URL}/payment/success`, 
            cancel_url: `${FRONTEND_URL}/payment/cancel`,
        });
        res.json(session);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
};
 */