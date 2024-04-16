import User from "../models/user.model.js";
import { Op } from 'sequelize'; // Asegúrate de importar correctamente Op desde sequelize
import updateUserPlan from "./repartirPuntos.js";

const updateUsers = async () => {
  try {
    // Encuentra todos los usuarios distintos de 'Nahyan' y actualiza los CodeReferenced
    const users = await User.findAll({
      where: {
        UserName: {
          [Op.ne]: 'Nahyan'
        }
      }
    });

    // Define los contadores para el nuevo valor de CodeReferenced
    let newValue = 912004;
    let count = 0;

    // Recorre cada usuario y actualiza el campo CodeReferenced
    for (const user of users) {
      // Actualiza el CodeReferenced según la lógica especificada
      await user.update({ CodeReferenced: newValue });

      // Incrementa el contador
      count++;

      // Si se han actualizado 3 usuarios, incrementa el valor de newValue
      if (count === 3) {
        newValue++;
        count = 0;
      }

      // Busca al usuario referente
      const referringUserCode = user.CodeReferenced;
      if (referringUserCode) {
        const referringUser = users.find(u => u.UserCode === referringUserCode);
        // Si se encuentra el usuario referente, incrementa su referralsCount
        if (referringUser) {
          referringUser.referralsCount += 1;
          await referringUser.save();
        }
      }
      updateUserPlan(user.idUser, user.idPaidPlan, user.CodeReferenced)
      

    }



    console.log('Todos los usuarios han sido actualizados correctamente.');
  } catch (error) {
    console.error('Error al actualizar usuarios:', error);
  }
};

// Llama a la función para actualizar los usuarios
export default updateUsers;