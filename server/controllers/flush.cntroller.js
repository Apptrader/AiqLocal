import Flush from "../models/flush.model.js";
import User from "../models/user.model.js";

export const getNextWeekFlush = async (req, res) => {
    const { id } = req.body;
    console.log(id);

    try {
        // Buscar al usuario con el id proporcionado
        const user = await User.findOne({
            where: { idUser: id }
        });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        const flush = await Flush.findAll({
         where: {
            user_id: id
         }
        });
    
        console.log(flush)
    
        let sumaMontos = 0;
    
        flush.forEach((elemento) => {
          sumaMontos += elemento.dataValues.amount;
        });
        
        const firstflush = sumaMontos

        // Función recursiva para buscar referidos y sumar los flush
        const sumFlushAmounts = async (userCode) => {
            console.log(userCode, "usercode");
            // Buscar todos los referidos directos del usuario actual
            const directReferrals = await User.findAll({
                where: { CodeReferenced: userCode }
            });

            let totalFlushAmount = 0;

            // Sumar los montos de flush de los referidos directos
            for (const referral of directReferrals) {
                console.log(referral.idUser, "IDuSER");
                const flush = await Flush.findAll({
                    where: { user_id: referral.idUser }
                });

                for (const element of flush) {
                    totalFlushAmount += element.dataValues.amount;
                }

                // Llamada recursiva para buscar referidos de este referido
                totalFlushAmount += await sumFlushAmounts(referral.UserCode);
            }

            return totalFlushAmount;
        };

        // Llamar a la función recursiva para obtener el total de los montos de flush
        const totalFlush = await sumFlushAmounts(user.UserCode);
        const finalFlush = totalFlush + firstflush
        console.log(finalFlush)
        res.status(200).json(finalFlush);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};