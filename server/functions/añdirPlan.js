import User from "../models/user.model.js";
import { Op } from 'sequelize';

const updatePlans = async () => {
  try {
    // Encuentra todos los usuarios distintos de 'Nahyan'
    const users = await User.findAll({
      where: {
        UserName: {
          [Op.ne]: 'Nahyan'
        }
      }
    });

    // Define un arreglo con los valores posibles para idPaidPlan
    const idPaidPlanValues = [1, 2, 3];

    // Recorre cada usuario y actualiza el campo idPaidPlan de manera aleatoria
    for (const user of users) {
      // Obtiene un índice aleatorio del arreglo idPaidPlanValues
      const randomIndex = Math.floor(Math.random() * idPaidPlanValues.length);
      // Obtiene el valor de idPaidPlan correspondiente al índice aleatorio
      const idPaidPlan = idPaidPlanValues[randomIndex];

      try {
        await User.update(
          { idPaidPlan: idPaidPlan },
          { where: { idUser: user.idUser } }
        );
      } catch (error) {
        console.log(error);
      }

     
    }

    console.log('Todos los usuarios han sido actualizados correctamente.');
  } catch (error) {
    console.error('Error al actualizar usuarios:', error);
  }
};

// Llama a la función para actualizar los usuarios
export default updatePlans;
