import User from "../models/user.model.js";

const createUsers = async () => {
  try {
    

    for (let i = 1; i <= 50; i++) {
      const userData = {
        UserName: `test${i}`,
        Email: `test${i}@gmail.com`,
        UserLastName: `test${i}`,
        Password: `test${i}`,
        Phone: `1357924680-test${i}`
      };

      await User.create(userData);
      
    }

    console.log('Usuarios creados exitosamente.');
    
  } catch (error) {
    console.error('Error al crear los usuarios:', error);
  }
};

export default createUsers;
