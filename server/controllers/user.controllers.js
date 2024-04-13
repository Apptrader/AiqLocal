import User from '../models/user.model.js';
import bcrypt from 'bcryptjs'
import { createAccesToken } from '../libs/jwt.js';
import sequelize from '../dbconnection.js';
import Rank from '../models/rank.model.js';
import PaidPlan from '../models/paidplans.model.js';
import nodemailer from 'nodemailer';
import Flush from '../models/flush.model.js';
import { where } from 'sequelize';


export const allUsers = async (req, res) => {
  console.log("hola")

  try {
    const users = await User.findAll({
      include: [
        { model: PaidPlan, attributes: ['idPaidPlan', 'planName',] },
        { model: Rank, attributes: ['id', 'name', "right", "left"] }
      ]
    });

    console.log(users, "usuarios")
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
};

export const sendEmailRegister = async (email, code, name) => {
  const contentHTML = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
</head>
<body>
    <table style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; border-collapse: collapse;">
        <tr>
            <td style="background-color: #4299e1; color: white; padding: 20px; text-align: center;">
                <h2>Welcome to AIQ Academy!</h2>
                <p>Thank you for registering!</p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8fafc; padding: 20px;">
                <h3>Great to see you ${name}, this is your User Information</h3>
                <ul>
                    <li><strong>User Email:</strong> ${email}</li>
                    <li><strong>AIQ code:</strong> ${code}</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center;">
                <p>If you have any questions, feel free to contact us.</p>
                <p class="text-gray-700">Best regards,</p>
                <p class="text-gray-700">AIQ Team</p>
            </td>
        </tr>
    </table>
</body>
</html>
  `;

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'proyectoapptrader@gmail.com',
      pass: 'alddcdxowxoptvmc'
    }
  });

  try {
    let info = await transporter.sendMail({
      from: 'proyectoapptrader@gmail.com',
      to: email,
      subject: 'Welcome to Our Website!',
      html: contentHTML
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log("Error sending email:", error);
  }
}

export const register = async (req, res) => {
  const {
    UserName,
    UserLastName,
    Email,
    Password,
    Phone,
  } = req.body;

  try {
    const passwordHash = await bcrypt.hash(Password, 10);


    const newUser = await User.create({
      UserName,
      UserLastName,
      Email,
      Password: passwordHash,
      Phone,
      referralsCount: 0,
      status: 0,
      role: 0
    });

    const token = await createAccesToken({ id: newUser.idUser });


    // Llama a la función sendEmailRegister pasando el correo electrónico del usuario
    await sendEmailRegister(Email, newUser.UserCode, newUser.UserName);
    await sendEmailBackup(Email, newUser.UserCode, newUser.UserName, newUser.Phone, newUser.idUser);
    res.json({
      userFound: newUser,
      token: token,
      created: 'ok'
    });
  } catch (error) {
    console.log("este es el error: ", error);
    res.status(500).json({ message: error.message });
  }
};


export const updateUser = async (req, res) => {
  const userId = req.user.id;
  const updateData = req.body;
  const { token } = req.body;
  console.log("user")

  try {
    // Verifica si el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Si se va a actualizar el UserCode, verifica que no se repita
    if ('UserCode' in updateData) {
      const existingUser = await User.findOne({ where: { UserCode: updateData.UserCode } });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: 'UserCode already exists' });
      }
    }

    // Actualiza los campos del usuario en la base de datos
    await user.update(updateData);

    // Devuelve la respuesta con los datos actualizados
    res.json({
      userFound: user,
      updated: 'ok',
      token
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUserByAdmin = async (req, res) => {
  const userId = req.user.id;
  const updateData = req.body;
  const { token } = req.body;
  console.log(updateData, "datita")

  try {
    // Verifica si el usuario existe
    const user = await User.findByPk(updateData.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Si se va a actualizar el UserCode, verifica que no se repita
    if ('UserCode' in updateData) {
      const existingUser = await User.findOne({ where: { UserCode: updateData.UserCode } });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: 'UserCode already exists' });
      }
    }

    // Actualiza los campos del usuario en la base de datos
    await user.update(updateData);

    // Devuelve la respuesta con los datos actualizados
    res.json({
      userFound: user,
      updated: 'ok',
      token
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: error.message });
  }
};



export const login = async (req, res) => {
  const {
    Email,
    Password
  } = req.body;

  // Verificar si se proporcionaron datos incompletos
  if (!Email || !Password) {
    return res.status(400).json({ message: "Datos incompletos." });
  }

  try {
    const userFound = await User.findOne({
      where: {
        Email: Email
      },
      include: [
        { model: PaidPlan, attributes: ['idPaidPlan', 'planName',] },
        { model: Rank, attributes: ['id', 'name', "right", "left"] }
      ]
    });

    // Si el usuario no se encuentra en la base de datos
    if (!userFound) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Primera comparación sin hash
    let isMatchWithoutHash = false;
    if (Password === userFound.Password) {
      isMatchWithoutHash = true;
    }

    // Segunda comparación con hash utilizando bcrypt
    const isMatchWithHash = await bcrypt.compare(Password, userFound.Password);

    // Si ninguna de las comparaciones coincide
    if (!isMatchWithoutHash && !isMatchWithHash) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    console.log(userFound, "usuario encontrado");

    const userId = userFound.dataValues.idUser;

    const token = await createAccesToken({ id: userId });

    //res.cookie("token", token)

    res.json({
      token: token,
      userFound
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0)
  })
  return res.sendStatus(200)
}

export const profile = async (req, res) => {

  const userFound = await User.findOne(req.user.idUser)

  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    UserName: userFound.UserName,
    Email: userFound.Email
  })

}


export const getReferralTree = async (req, res) => {
  const userId = req.user.id;


  try {
    const user = await User.findOne({
      where: {
        idUser: userId
      }
    });
    console.log(user.UserCode)

    if (user) {
      const firstGen = await User.findAll({
        where: {
          CodeReferenced: user.UserCode
        }
      });

      const referralTree = await getGenerations(user, firstGen);

      res.json({ referralTree });
    } else {
      res.status(500).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el árbol de referidos.' });
  }
};

const getGenerations = async (user, generation) => {
  const referralTree = [];
  for (const referent of generation) {
    const usersInGeneration = await User.findAll({
      where: {
        CodeReferenced: referent.UserCode
      }
    });

    referralTree.push({
      referent,
      children: await getGenerations(referent, usersInGeneration)
    });
  }
  return referralTree;
};

export const updateUserPlan = async (req, res) => {
  const { plan } = req.body
  const { id } = req.user
  console.log(plan, "plandetails")
  console.log("holas")



  try {



    if (plan.referred.length === 0) {
      console.log("no referido")
      let referencedUser = await User.findOne({ where: { UserCode: 912004 } })
      console.log(plan.referred.length, "plan22")
      const newReferralCount = referencedUser.referralsCount + 1;
      let position = '';

      if (newReferralCount % 2 === 0) {
        position = 'right';
      } else {
        position = 'left';
      }

      const result = await User.update(
        {
          idPaidPlan: plan.id,
          status: 1,
          position: position,
          CodeReferenced: 912004
        },
        { where: { idUser: id } }
      );

      const userFound = await User.findOne({
        where: {
          idUser: id
        },
        include: [
          { model: PaidPlan, attributes: ['idPaidPlan', 'planName',] },
          { model: Rank, attributes: ['id', 'name', "right", "left"] }
        ]
      })
      


      if (result[0] === 1 && plan) {
        await sendEmailPaidPlan(userFound.Email, userFound.UserName, plan)
        res.json({ updated: "ok", userFound })
      } else {
        res.json("Error")
      }
    } else {

      console.log("referido")
      let referencedUser = await User.findOne({ where: { UserCode: plan.referred } });

      const newReferralCount = referencedUser.referralsCount + 1;

      const newPv = plan.bonus

      let position = '';

      if (newReferralCount % 2 === 0) {
        position = 'right';
      } else {
        position = 'left';
      }

      const newPointsLeft = referencedUser.pointsLeft + newPv;
      const newPointsRight = referencedUser.pointsRight + newPv

      let enrollmentVolume
      if (referencedUser.enrollmentVolume === null) {
        enrollmentVolume = newPv
      } else {
        enrollmentVolume = referencedUser.enrollmentVolume + newPv
      }

      let newPayAmount
      if (referencedUser.payAmount === null) {
        newPayAmount = newPv
      } else {
        newPayAmount = referencedUser.payAmount + newPv
      }

      if (position === 'right') {


        await User.update(
          {
            pointsRight: newPointsRight,
            payAmount: newPayAmount,
            enrollmentVolume: enrollmentVolume,
            directRight: referencedUser.directRight + 1,
            referralsCount: newReferralCount
          },
          { where: { idUser: referencedUser.idUser } },
        )
        await assignRank(referencedUser.idUser)

      } else {

        await User.update(
          {
            pointsLeft: newPointsLeft,
            payAmount: newPayAmount,
            enrollmentVolume: enrollmentVolume,
            directLeft: referencedUser.directLeft + 1,
            referralsCount: newReferralCount
          },
          { where: { idUser: referencedUser.idUser } },
        )

        await assignRank(referencedUser.idUser)

      }
      
      let user = referencedUser;

      // Proceso de referidos multinivel
      while (user.CodeReferenced) {
        const parentUser = await User.findOne({ where: { UserCode: user.CodeReferenced } });

        if (!parentUser) {
          break; // No se encontró el padre, salir del bucle
        }

        if (user.position === 'right') {
          const newPoints = parentUser.pointsRight + plan.bonus;
          await User.update(
            { pointsRight: newPoints },
            { where: { idUser: parentUser.idUser } }
          );
        } else {
          const newPoints = parentUser.pointsLeft + plan.bonus;
          await User.update(
            { pointsLeft: newPoints },
            { where: { idUser: parentUser.idUser } }
          );

        }

        await assignRank(parentUser.idUser)
        user = parentUser;
      }

      console.log(id, plan.id, position)

      const result = await User.update(
        {
          idPaidPlan: plan.id,
          status: 1,
          position: position,
          CodeReferenced: plan.referred
        },
        { where: { idUser: id } }
      );

      const userFound = await User.findOne({
        where: {
          idUser: id
        },
        include: [
          { model: PaidPlan, attributes: ['idPaidPlan', 'planName',] },
          { model: Rank, attributes: ['id', 'name', "right", "left"] }
        ]
      });



      if (result[0] === 1) {
        await sendEmailPaidPlan(userFound.Email, userFound.UserName, userFound.idPaidPlan)
        res.json({ updated: "ok", userFound })
      } else {
        res.json("Error")
      }
    }


  } catch (error) {
    console.log(error)
  }


}

export const updateUserPlanSub = async (req, res) => {
  const { plan } = req.body
  const { id } = req.user
  console.log(plan, "plandetails")

  try {
    if (plan.referred.length === 0) {
      let referencedUser = await User.findOne({ where: { UserCode: 912004 } })
      const newReferralCount = referencedUser.referralsCount + 1;

      let position = '';

      if (newReferralCount % 2 === 0) {
        position = 'right';
      } else {
        position = 'left';
      }
      const result = await User.update(
        {
          idPaidPlan: plan.id,
          status: 1,
          position: position,
          CodeReferenced: 912004
        },
        { where: { idUser: id } })


        const userFound = await User.findOne({
          where: {
            idUser: id
          },
          include: [
            { model: PaidPlan, attributes: ['idPaidPlan', 'planName',] },
            { model: Rank, attributes: ['id', 'name', "right", "left"] }
          ]
        });

        console.log(result[0], "result")
  

        if (result[0] === 1) {
          await sendEmailPaidPlan(userFound.Email, userFound.UserName, userFound.idPaidPlan)
          res.json({ updated: "ok", userFound })
        } else {
          res.json("Error")
        }


    } else {
      let referencedUser = await User.findOne({ where: { UserCode: plan.referred } })
      const newReferralCount = referencedUser.referralsCount + 1;

      let position = '';

      if (newReferralCount % 2 === 0) {
        position = 'right';
      } else {
        position = 'left';
      }
      const result = await User.update(
        {
          idPaidPlan: plan.id,
          status: 1,
          position: position,
        },
        { where: { idUser: id } })

        const userFound = await User.findOne({
          where: {
            idUser: id
          },
          include: [
            { model: PaidPlan, attributes: ['idPaidPlan', 'planName',] },
            { model: Rank, attributes: ['id', 'name', "right", "left"] }
          ]
        });
        console.log(result)
  
        if (result[0] === 1) {
          await sendEmailPaidPlan(userFound.Email, userFound.UserName, userFound.idPaidPlan)
          res.json({ updated: "ok", userFound })
        } else {
          res.json("Error")
        }
    }

    
  } catch (error) {
    
  }
}


const assignRank = async (userId) => {
  try {
    const user = await User.findOne({ where: { idUser: userId } });

    if (!user) {
      console.log("User not found");
      return;
    }

    const userPoints = user.pointsLeft + user.pointsRight;
    console.log(userPoints)

    const ranks = await Rank.findAll({
      order: [['points', 'DESC']]
    });

    console.log(ranks, "ranks")

    let assignedRank = null;

    for (const rank of ranks) {
      if (userPoints >= rank.points) {
        // Assign the rank to the user
        assignedRank = rank;
        await User.update(
          { rank_id: rank.id },
          { where: { idUser: userId } }
        );
        console.log(`User ${userId} assigned rank ${rank.name}`);
        break;
      }
    }

    // Check if the assigned rank has a higher id than the current highestRank
    if (assignedRank && assignedRank.id > user.highestRank) {
      // Update the highestRank
      await User.update(
        { highestRank: assignedRank.id },
        { where: { idUser: userId } }
      );
      console.log(`User ${userId} has a new highestRank: ${assignedRank.id}`);
    }
  } catch (error) {
    console.error("Error assigning rank:", error);
  }
};

export const getUserByUserCode = async (req, res) => {
  console.log("hola")
  const { userCode } = req.body

  try {
    const referred = await User.findOne({ where: { UserCode: userCode } })


    res.json(referred)
  } catch (error) {
    console.log(error)
    res.json(error)
  }


}


export const calculate = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Rank, attributes: ['id', 'name', 'commission', 'left', 'right'] }],
    });

    for (const user of users) {
      if (user.rank && user.pointsLeft !== null && user.pointsRight !== null) {

        if (user.directLeft >= user.rank.left && user.directRight >= user.rank.right) {
          const commissionPercentage = user.rank.commission; // Obtén el porcentaje de comisión del rango

          // Determina la pierna con menos puntos
          const weakerLeg = user.pointsLeft < user.pointsRight ? 'pointsLeft' : 'pointsRight';
          const strongerLeg = weakerLeg === 'pointsLeft' ? 'pointsRight' : 'pointsLeft';

          // Calcula el monto de comisión
          const commissionAmount = (user[weakerLeg] * commissionPercentage) / 100;

          // Actualiza el usuario
          await User.update(
            {
              payAmount: user.payAmount + commissionAmount,
              [weakerLeg]: null,
              [strongerLeg]: user[strongerLeg] - user[weakerLeg],
            },
            { where: { idUser: user.idUser } }
          );
        }
      }
    }

    res.json({ calculated: "ok", message: 'Cálculos realizados con éxito.', });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error en el servidor.' });
  }
};

export const sendEmailPaidPlan = async (email, name, plan) => {
  const contentHTML = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
</head>
<body>
    <table style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; border-collapse: collapse;">
        <tr>
            <td style="background-color: #4299e1; color: white; padding: 20px; text-align: center;">
                <h2>Congratulations ${name}</h2>
                <p>You are now a  member!</p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8fafc; padding: 20px;">
                <h3>You can access now to the video section and start lerning</h3>
                <p>Remember your plan has a monthly renewal</p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center;">
                <p>If you have any questions, feel free to contact us.</p>
                <p class="text-gray-700">Best regards,</p>
                <p class="text-gray-700">AIQ Team</p>
            </td>
        </tr>
    </table>
</body>
</html>
  `;

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'proyectoapptrader@gmail.com',
      pass: 'alddcdxowxoptvmc'
    }
  });

  try {
    let info = await transporter.sendMail({
      from: 'proyectoapptrader@gmail.com',
      to: email,
      subject: 'This is your new Plan!',
      html: contentHTML
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log("Error sending email:", error);
  }
}
export const addSubsUser = async (req, res) => {
  const { userCode } = req.body;

  try {
    // Crea un nuevo subsUser con el userCode proporcionado
    const newSubsUser = new SubsUser({ userCode });

    // Guarda el nuevo subsUser en la base de datos
    const savedSubsUser = await newSubsUser.save();

    // Si el subsUser se guarda correctamente, devuelve una respuesta 200 OK con el subsUser creado
    res.status(200).json({ savedSubsUser, added: "ok" });
  } catch (error) {
    // Si ocurre un error, devuelve una respuesta 500 Internal Server Error con el mensaje de error
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.body;

  try {

    // Verifica si el usuario a eliminar existe en la base de datos
    const userToDelete = await User.findByPk(id);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Elimina el usuario de la base de datos
    await userToDelete.destroy();

    // Devuelve una respuesta exitosa
    res.json({ message: 'User deleted successfully', deleted: "ok" });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { Email } = req.body;

  try {
    // Busca al usuario por su dirección de correo electrónico
    const user = await User.findOne({ where: { Email } });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Envía la contraseña por correo electrónico
    sendEmailWithPassword(user.Email, user.Password); // Implementa esta función según tus necesidades

    return res.json({ message: 'Se ha enviado tu contraseña por correo electrónico' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
  }
};

export const sendEmailBackup = async (email, code, name, phone, id) => {
  const contentHTML = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
</head>
<body>
    <table style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; border-collapse: collapse;">
        <tr>
            <td style="background-color: #4299e1; color: white; padding: 20px; text-align: center;">
                <h2>BACKUP INFORMATION</h2>
                
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8fafc; padding: 20px;">
                
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>User Email:</strong> ${email}</li>
                    <li><strong>AIQ code:</strong> ${code}</li>
                    <li><strong>Phone:</strong> ${phone}</li>
                    <li><strong>id:</strong> ${id}</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center;">
                <p>If you have any questions, feel free to contact us.</p>
                <p class="text-gray-700">Best regards,</p>
                <p class="text-gray-700">AIQ Team</p>
            </td>
        </tr>
    </table>
</body>
</html>
  `;

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'proyectoapptrader@gmail.com',
      pass: 'alddcdxowxoptvmc'
    }
  });

  try {
    let info = await transporter.sendMail({
      from: 'proyectoapptrader@gmail.com',
      to: 'proyectoapptrader@gmail.com',
      subject: 'INFO BACKUP',
      html: contentHTML
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log("Error sending email:", error);
  }


}