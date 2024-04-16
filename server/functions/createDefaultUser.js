import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

const createDefaultUser = async () => {
  try {
    // Verifica si ya existe un usuario por defecto
    

    // Función para crear un nuevo usuario
    const createDefault = async (userData) => {
      try {
        const { UserName, UserLastName, Email, Password, Phone, referralsCount, status, role } = userData;

        const passwordHash = await bcrypt.hash(Password, 10);

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
        console.error('Error al crear el usuario:', error);
        throw new Error('Error al crear el usuario:', error);
      }
    };

    // Si no existe, crea el usuario por defecto
    
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

      await createDefault(defaultUserData);
      console.log('Usuario por defecto creado exitosamente.');
    
  } catch (error) {
    console.error('Error al crear el usuario por defecto:', error);
  }
};



export default createDefaultUser;