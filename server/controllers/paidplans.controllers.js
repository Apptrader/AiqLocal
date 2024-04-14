import PaidPlan from "../models/paidplans.model.js";


export const allPaidPlans = async (req,res) =>{

    const paidPlans = await PaidPlan.findAll();
    res.json(paidPlans)
};

export const createPaidPlan = async (req, res) => {
    const {
        planName,
        planCost,
        bonus,
        renewal,
        planImage
    } = req.body;

    try {
        const newPlan = await PaidPlan.create({
            planName,
            planCost,
            bonus,
            renewal,
            planImage
        });

        res.send({created: "ok"});

        // Guarda los cambios en la base de datos
        await newPlan.save();

    } catch (error) {
        console.log("Este es el error: ", error);
        res.status(500).send("Error creating new plan");
    }

};


export const getPaidPlan  = async (req,res) =>{
    const paidPlan = await PaidPlan.findByPk(req.params.id)
    if(!paidPlan) return res.status(404).json()
    res.json(paidPlan);
};


export const deletePaidPlan = async (req, res) => {
    try {
        const paidPlan = await PaidPlan.findByPk(req.params.id);

        if (!paidPlan) {
            return res.status(404).json({ message: 'PaidPlan not found' });
        }

        // Eliminar el PaidPlan de la base de datos
        await paidPlan.destroy();

        res.json({ message: 'PaidPlan deleted successfully', deleted: "ok" });
    } catch (error) {
        console.error('Error deleting PaidPlan:', error);
        res.status(500).json({ error: 'Error deleting PaidPlan' });
    }
};

export const updatePaidPlan = async (req, res) => {
    try {
        const { planName, planCost, bonus, renewal, planImage} = req.body;

        // Encuentra el PaidPlan por su clave primaria (id)
        const paidPlan = await PaidPlan.findByPk(req.params.id);

        // Verifica si el PaidPlan existe
        if (!paidPlan) {
            return res.status(404).json({ message: 'PaidPlan not found'});
        }

        // Actualiza los campos necesarios
        paidPlan.planName = planName;
        paidPlan.planCost = planCost;
        paidPlan.bonus = bonus;
        paidPlan.renewal = renewal;
        paidPlan.planImage = planImage


        // Guarda los cambios en la base de datos
        await paidPlan.save();

        // Responde con el PaidPlan actualizado
        res.json({paidPlan, updated: "ok"});
    } catch (error) {
        console.error('Error updating PaidPlan:', error);
        res.status(500).json({ error: 'Error updating PaidPlan' });
    }
};
