import sequelize from './dbconnection.js';
import app from './app.js';
import User from './models/user.model.js'; // Importa el modelo de usuario
import PaidPlan from './models/paidplans.model.js';
import bcrypt from 'bcryptjs'
import createRanks from './functions/ranks.js';
import createVideoChapters from './functions/videoChapters.js';
import createVideos from './functions/videos.js';

const createDefaultUser = async () => {
  try {
    // Verifica si ya existe un usuario por defecto
    const existingUser = await User.findOne({ where: { UserName: 'default' } });

    // Si no existe, crea el usuario por defecto
    if (!existingUser) {
      const defaultUserData = {
        UserName: 'Nahyan',
        Email: 'nahyan@gmail.com',
        Password: '123456', // Cambia esto por la contraseña deseada
        Phone: '1234567890',
        referralsCount: 0,
        idPaidPlan: 3,
        status: 1,
        role: '1' // Define el rol del usuario por defecto
      };

      await createUser(defaultUserData);
    }
  } catch (error) {
    console.error('Error al crear el usuario por defecto:', error);
  }
};

const createUser = async (userData) => {
  try {
    const { UserName, Email, Password, Phone, referralsCount, status, role } = userData;

    const passwordHash = await bcrypt.hash(Password, 10);

    const newUser = await User.create({
      UserName,
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

sequelize.sync({ force: true })
  .then(async () => {
    console.log('Modelos sincronizados con la base de datos.');

    // Crea el usuario por defecto
    await createDefaultUser();
    await createUser(
      {
        UserName: "test2",
        Email: "test2@gmail.com",
        Password: 'test2',
        Phone: "0987654321",
        referralsCount: 0,
        idPaidPlan:2,
        status: 0,
        role: '0' // '1' for admin, '0' for regular user
      });
     await createUser( {
        UserName: "test3",
        Email: "test3@gmail.com",
        Password: 'test3',
        Phone: "1357924680",
        referralsCount: 0,
        idPaidPlan: 2,
        status: 1,
        role: '0' // '1' for admin, '0' for regular user
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
      planName: 'Basic',
      planCost: 150,
      description: '',
      feature: '',
      planImage: '',
      bonus: 35,
      renewal: 60
    });

    await createRanks()
    await createVideoChapters()
    await createVideos()

    const port = 4000;
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar modelos con la base de datos:', error);
  });