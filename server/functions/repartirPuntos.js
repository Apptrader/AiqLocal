import User from '../models/user.model.js';
import Rank from '../models/rank.model.js';
import PaidPlan from '../models/paidplans.model.js';
import Flush from '../models/flush.model.js';


const updateUserPlan = async (id, planId, CodeReferenced) => {
    console.log("ESto es el id: ", id)
    console.log("ESto es el plan: ", planId)
    console.log("ESto es el code: ", CodeReferenced)

    try {
      let plan
    if (planId === 1) {
      plan = {
        name: 'Basic',
        price: 150,
        price2: 60,
        bonus: 35,
        renewal: 60,
        id: 1,
        referred: CodeReferenced
      }
    } else if (planId === 2) {
      plan = {
        name: 'Pro',
        price: 250,
        price2: 250,
        bonus: 60,
        renewal: 85,
        id: 2,
        referred: CodeReferenced
      }
    } else {
      plan = {
        name: 'Sonic',
        price: 600,
        price2: 600,
        bonus: 120,
        renewal: 90,
        id: 3,
        referred: CodeReferenced
      }
    }

    // Validar la entrada
    if (!plan || !id) {
      throw new Error('Datos de entrada inválidos.');
    }

    // Lógica para el plan sin referido
    if (plan.referred.length === 0) {
      await handlePlanWithoutReferral(id, plan);
    } else {
      await handlePlanWithReferral(id, plan);
    }

    const updatedUser = await User.findOne({ where: { idUser: id } })

  } catch (error) {
    console.error('Error al actualizar el plan del usuario:', error);
  }
};

async function handlePlanWithoutReferral(userId, plan) {
  try {
    let referencedUser = await User.findOne({ where: { UserCode: 912004 } });
    const newReferralCount = referencedUser.referralsCount + 1;
    const newPv = plan.bonus;
    const newPointsLeft = referencedUser.pointsLeft + newPv;
    const newPointsRight = referencedUser.pointsRight + newPv;
    let enrollmentVolume = referencedUser.enrollmentVolume === null ? newPv : referencedUser.enrollmentVolume + newPv;
    let newPayAmount = referencedUser.payAmount === null ? newPv : referencedUser.payAmount + newPv;


    let position = '';

    if (newReferralCount % 2 === 0) {
      position = 'right';
    } else {
      position = 'left';
    }
    if (position === 'right') {
     try {
        console.log("2")
      await User.update(
        {
          pointsRight: newPointsRight,
          payAmount: newPayAmount,
          enrollmentVolume: enrollmentVolume,
          directRight: referencedUser.directRight + 1,
          referralsCount: newReferralCount
        },
        { where: { idUser: referencedUser.idUser } }
      );
      await assignRank(referencedUser.idUser);
     } catch (error) {
      console.log("error con el referido", error)
     }
     
      
    } else {

      try {
        console.log("3")
        await User.update(
          {
            pointsLeft: newPointsLeft,
            payAmount: newPayAmount,
            enrollmentVolume: enrollmentVolume,
            directLeft: referencedUser.directLeft + 1,
            referralsCount: newReferralCount
          },
          { where: { idUser: referencedUser.idUser } }
        );
        await assignRank(referencedUser.idUser);
      } catch (error) {
        console.log("error con el referido: ", error)
      }
    }

    console.log("4")

    

    const result = await User.update(
      {
        idPaidPlan: plan.id,
        status: 1,
        position: position,
        CodeReferenced: 912004
      },
      { where: { idUser: userId } }
    );

    console.log("5")

    const userFound = await User.findOne({
      where: { idUser: userId },
      include: [
        { model: PaidPlan, attributes: ['idPaidPlan', 'planName',] },
        { model: Rank, attributes: ['id', 'name', "right", "left"] }
      ]
    });

    let amount;

    if (plan.id === 1) {
      amount = 15;
    } else if (plan.id === 2) {
      amount = 35;
    } else if (plan.id === 3) {
      amount = 120;
    } else {
      // Valor predeterminado en caso de que plan.id no coincida con ninguno de los casos anteriores
      amount = 0; // O cualquier otro valor predeterminado que desees
    }

    const newFlush = await Flush.create({
      user_id: referencedUser.idUser,
      plan_id: plan.id,
      date: new Date(),
      amount: amount
    });
    console.log(result, "result")
    console.log("6")

    if (result[0] === 1 && plan) {
      
    } else {
      throw new Error('Error al actualizar el plan del usuario.');
    }
  } catch (error) {
    throw new Error('Error al manejar el plan sin referido:', error);
  }
}

async function handlePlanWithReferral(userId, plan) {
  try {
    let referencedUser = await User.findOne({ where: { UserCode: plan.referred } });
    const newReferralCount = referencedUser.referralsCount + 1;
    const newPv = plan.bonus;
    let position = '';

    if (newReferralCount % 2 === 0) {
      position = 'right';
    } else {
      position = 'left';
    }

    const newPointsLeft = referencedUser.pointsLeft + newPv;
    const newPointsRight = referencedUser.pointsRight + newPv;
    let enrollmentVolume = referencedUser.enrollmentVolume === null ? newPv : referencedUser.enrollmentVolume + newPv;
    let newPayAmount = referencedUser.payAmount === null ? newPv : referencedUser.payAmount + newPv;

    if (position === 'right') {
      await User.update(
        {
          pointsRight: newPointsRight,
          payAmount: newPayAmount,
          enrollmentVolume: enrollmentVolume,
          directRight: referencedUser.directRight + 1,
          referralsCount: newReferralCount
        },
        { where: { idUser: referencedUser.idUser } }
      );
      await assignRank(referencedUser.idUser);
    } else {
      await User.update(
        {
          pointsLeft: newPointsLeft,
          payAmount: newPayAmount,
          enrollmentVolume: enrollmentVolume,
          directLeft: referencedUser.directLeft + 1,
          referralsCount: newReferralCount
        },
        { where: { idUser: referencedUser.idUser } }
      );
      await assignRank(referencedUser.idUser);
    }

    let user = referencedUser;

    while (user.CodeReferenced) {
      const parentUser = await User.findOne({ where: { UserCode: user.CodeReferenced } });

      if (!parentUser) {
        break;
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

      await assignRank(parentUser.idUser);
      user = parentUser;
    }

    const result = await User.update(
      {
        idPaidPlan: plan.id,
        status: 1,
        position: position,
        CodeReferenced: plan.referred
      },
      { where: { idUser: userId } }
    );

    const userFound = await User.findOne({
      where: { idUser: userId },
      include: [
        { model: PaidPlan, attributes: ['idPaidPlan', 'planName',] },
        { model: Rank, attributes: ['id', 'name', "right", "left"] }
      ]
    });

    if (result[0] !== 1) {
      throw new Error('Error al actualizar el plan del usuario.');
    }
    let amount;

    if (plan.id === 1) {
      amount = 15;
    } else if (plan.id === 2) {
      amount = 35;
    } else if (plan.id === 3) {
      amount = 120;
    } else {
      // Valor predeterminado en caso de que plan.id no coincida con ninguno de los casos anteriores
      amount = 0; // O cualquier otro valor predeterminado que desees
    }

    const newFlush = await Flush.create({
      user_id: referencedUser.idUser,
      plan_id: plan.id,
      date: new Date(),
      amount: amount
    });

    
  } catch (error) {
    throw new Error('Error al manejar el plan con referido:', error);
  }
}

export default updateUserPlan


