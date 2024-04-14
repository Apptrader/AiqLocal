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

const createDefaultUser = async () => {
  try {
    // Verifica si ya existe un usuario por defecto
    const existingUser = await User.findOne({ where: { Email: 'nahyan@gmail.com' } });

    // Si no existe, crea el usuario por defecto
    if (!existingUser) {
      const defaultUserData = {
        UserName: 'Nahyan',
        UserLastName: 'LastName',
        Email: 'nahyan@gmail.com',
        Password: '123456', // Cambia esto por la contraseña deseada
        Phone: '1234567890',
        referralsCount: 0,
        idPaidPlan: 3,
        status: 1,
        role: '1' // Define el rol del usuario por defecto
      };

      await createUser(defaultUserData);
      console.log('Usuario por defecto creado exitosamente.');
    } else {
      console.log('El usuario por defecto ya existe.');
    }
  } catch (error) {
    console.log(error)
    console.error('Error al crear el usuario por defecto:', error);
  }
};

const createUser = async (userData) => {
  try {
    const { UserName, UserLastName, Email, Password, Phone, referralsCount, status, role } = userData;

    const passwordHash = await bcrypt.hash(Password, 10);

    console.log(userData)

    const newUser = await User.create({
      UserName,
      UserLastName,
      Email,
      Password: passwordHash,
      Phone,
      referralsCount,
      status,
      role
    });

    console.log('Usuario creado:', newUser);

    // Puedes agregar aquí cualquier otra lógica que necesites después de crear el usuario

    return newUser;
  } catch (error) {
    throw new Error('Error al crear el usuario:', error);
  }
};

const createPaidPlan = async (planData) => {
  try {
    const { planName, planCost, description, feature, planImage, bonus, renewal } = planData;

    // Verifica si ya existe un plan con el mismo nombre
    const existingPlan = await PaidPlan.findOne({ where: { planName } });

    if (existingPlan) {
      console.log(`Ya existe un plan con el nombre "${planName}". No se creará un nuevo plan.`);
      return existingPlan;
    }

    const newPlan = await PaidPlan.create({
      planName,
      planCost,
      description,
      feature,
      planImage,
      bonus,
      renewal
    });

    console.log('Nuevo plan creado:', newPlan);

    return newPlan;
  } catch (error) {
    throw new Error('Error al crear el plan:', error);
  }
};

sequelize.sync({ force: false })
  .then(async () => {
    console.log('Modelos sincronizados con la base de datos.');

    // Crea el usuario por defecto
    await createDefaultUser();
    await createRanks()
    await videoLanguage()

     
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