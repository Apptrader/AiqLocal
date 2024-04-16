import PaidPlan from "../models/paidplans.model.js";

const createPaidPlan = async (planData) => {
    try {
      const { planName, planCost, description, feature, planImage, bonus, renewal } = planData;
  
      // Verifica si ya existe un plan con el mismo nombre
      const existingPlan = await PaidPlan.findOne({ where: { planName } });
  
      if (existingPlan) {
        
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

export default createPaidPlan