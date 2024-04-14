import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routerUser from './routes/user.routes.js';
import routerPaidPlans from './routes/paidplans.routes.js';
import routerVideos from './routes/video.routes.js';
import routerPayment from './routes/payment.routes.js';
import routerFlush from './routes/flush.router.js';
import routerLanguages from './routes/languages.routes.js';
import morgan from 'morgan';
import routerRank from './routes/rank.routes.js';
import routerContact from './routes/contact.routes.js';
import { FRONTEND_URL } from './config.js';
import routerChapters from './routes/chapters.routes.js';
import bodyParser from 'body-parser';
import Stripe from "stripe";
import { WEBHOOK_SECRET, SSK } from "./config.js";


const endpointSecret = WEBHOOK_SECRET
const stripe = new Stripe(SSK);
 
const app = express();

// Configuración CORS
const corsOptions = {
  origin: FRONTEND_URL,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.raw({ type: "*/*" }))

// Rutas
app.use('/apiUser', routerUser);
app.use('/apiPaidPlans', routerPaidPlans);
app.use('/apiVideos', routerVideos);
app.use('/api/payment', routerPayment);
app.use('/api/rank', routerRank);
app.use('/apiContact', routerContact);
app.use('/api/flush', routerFlush);
app.use('/apiLanguages', routerLanguages)
app.use('/apiChapters', routerChapters)

let subId; // Declarar subId fuera del callback
let subPlanId
let customer
let payMethod

async function crearSuscripcionConMetodoDePago(customerId, priceId, paymentMethodId) {
  try {
      console.log(paymentMethodId)
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
    });
    
    await stripe.customers.update(customerId, {
        invoice_settings: {
            default_payment_method: paymentMethodId,
        }
    });

      const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
          trial_period_days: 30
      });

      console.log('Suscripción creada con método de pago:', subscription);
      return subscription;
  } catch (error) {
      console.error('Error al crear la suscripción con método de pago:', error);
      throw error;
  }
}

app.get('/.well-known/pki-validation/E8DFC2E40074C43216A87866B544A732.txt', (req, res) => {
  const filePath = './../certificados/E8DFC2E40074C43216A87866B544A732.txt';
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err)
      res.status(500).send('Error al leer el archivo de autorización');
      return;
    }
    res.send(data);
  });
});

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => { 
    const sig = request.headers["stripe-signature"];
    const bodyString = request.body.toString();
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        bodyString,
        sig,
        endpointSecret
      );
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    let resData = "";

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        customer = paymentIntent.customer
        payMethod = paymentIntent.payment_method
        if (paymentIntent.amount === 60000) {
          await crearSuscripcionConMetodoDePago(customer, "price_1P2MQQCtqRjqS5chcgCR4WJ2", payMethod)
        } else if(paymentIntent.amount === 25000) {
          await crearSuscripcionConMetodoDePago(customer, "price_1P2MPqCtqRjqS5chqiRgs0jA", payMethod)
        } else if (paymentIntent.amount === 15000) {
          await crearSuscripcionConMetodoDePago(customer, "price_1P2LOSCtqRjqS5ch03lA7nKo", payMethod)
        }

        /* if (paymentIntent.amount === 60000) {
          await crearSuscripcionConMetodoDePago(customer, "price_1P4XNOIrqUJwwaEOzJfiunHk", payMethod)
        } else if(paymentIntent.amount === 25000) {
          await crearSuscripcionConMetodoDePago(customer, "price_1P4XN7IrqUJwwaEO74KcP17W", payMethod)
        } else if (paymentIntent.amount === 15000) {
          await crearSuscripcionConMetodoDePago(customer, "price_1P4XLgIrqUJwwaEOjHD2sGNq", payMethod)
        } */

      case "charge.succeeded":
         payMethod = event.data.object.payment_method;
         stripe.paymentIntents.retrieve(
          event.data.object.id,
          function(err, paymentIntent) {
              if (err) {
                  console.error("Error al recuperar la información del pago:", err);
                  // Maneja el error de alguna manera adecuada
              } else {
                  console.log("Información del pago:", paymentIntent);
                  
              }
          }
      );
         /* stripe.customers.retrieve(
          event.data.object.customer,
          function(err, customer) {
              if (err) {
                  console.error("Error al recuperar la información del cliente:", err);
                  // Maneja el error de alguna manera adecuada
              } else {
                  console.log("Información del cliente:", customer);
                  // Aquí puedes acceder a toda la información del cliente
                  resData = customer;
              }
          }
      ); */
        break;
      case "customer.created":
        customer = event.data.object
        break
      case "customer.subscription.created":
        const subscription = event.data.object;
        subId = subscription.id; 
        subPlanId = subscription.plan.id

        break;
      case 'checkout.session.completed':
       /*  resData = event.data.object */
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

;

 /*    return response.status(200).send(resData); */
  }
);

/* // Carga los certificados SSL/TLS
const options = {
    key: fs.readFileSync('./../certificados/server.key'),
    cert: fs.readFileSync('./../certificados/server.cer')
};

// Crea el servidor HTTPS
const server = https.createServer(options, app);

// Escucha en el puerto 443
server.listen(443, () => {
    console.log('Servidor HTTPS en funcionamiento en el puerto 443');
}); */

export default app