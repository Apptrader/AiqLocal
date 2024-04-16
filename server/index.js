import sequelize from './dbconnection.js';
import app from './app.js';
import User from './models/user.model.js'; // Importa el modelo de usuario
import PaidPlan from './models/paidplans.model.js';
import bcrypt from 'bcryptjs'
import createRanks from './functions/ranks.js';
import createVideoChapters from './functions/videoChapters.js';
import createVideos from './functions/videos.js';
import videoLanguage from './functions/languageVideo.js';
import https from 'https'; // Importa el módulo https de Node.js
import fs from 'fs'; // Importa el módulo fs para trabajar con archivos del sistema
import createUsers from './functions/createUsers.js';
import createDefaultUser from './functions/createDefaultUser.js'
import updateUsers from './functions/añadirReferidos.js'
import updatePlans from './functions/añdirPlan.js'
import createPaidPlan from './functions/createPaidPlans.js';
import updateUserPlan from './functions/repartirPuntos.js';
import { Op } from 'sequelize';



sequelize.sync({ force: true })
  .then(async () => {
    console.log('Modelos sincronizados con la base de datos.');

    // Crea el usuario por defecto
    await createPaidPlan({
      planName: 'Basic',
      planCost: 150,
      description: '',
      feature: '',
      planImage: '',
      bonus: 35,
      renewal: 60
    });
  
  await createPaidPlan({
    planName: 'Pro',
    planCost: 250,
    description: '',
    feature: '',
    planImage: '',
    bonus: 60,
    renewal: 85
  });
  
  await createPaidPlan({
    planName: 'Sonic',
    planCost: 600,
    description: '',
    feature: '',
    planImage: '',
    bonus: 150,
    renewal: 90
  });
  
    await createDefaultUser();
    await createRanks()
    await videoLanguage()
    await createUsers();
    await updatePlans();
    await updateUsers();
   

  
    



/*     const privateKey = fs.readFileSync('./../certificados/private.key', 'utf8');
const certificate = fs.readFileSync('./../certificados/certificate.crt', 'utf8');
const ca = fs.readFileSync('./../certificados/ca_bundle.crt', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};

// Crea un servidor HTTPS utilizando Express
 const httpsServer = https.createServer(credentials, app);

// Escucha en el puerto 443 (puerto predeterminado para HTTPS)
httpsServer.listen(443, () => {
  console.log('Servidor HTTPS está escuchando en el puerto 443');
});  */

     const port = 80;
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    }); 
  }) 
  .catch((error) => {
    console.error('Error al sincronizar modelos con la base de datos:', error);
  });