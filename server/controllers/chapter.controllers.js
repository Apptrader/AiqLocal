import VideoChapter from "../models/videoChapter.model.js";
import VideoLanguage from "../models/languages.model.js";

export const allChapters = async (req, res) => {
    try {
        // Consulta para obtener todos los capítulos de vídeo con la relación a videoLanguage
        const chapters = await VideoChapter.findAll({
            include: [{
                model: VideoLanguage,
                attributes: ['name', 'id'], // Especificar los atributos que deseas obtener de VideoLanguage
            }]
        });
       
        res.status(200).json(chapters);
    } catch (error) {
        console.error('Error al obtener los capítulos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const createChapter = async (req, res) => {
    const { name, language_id } = req.body; // Extraer los datos necesarios del cuerpo de la solicitud

    try {
        // Crear un nuevo capítulo con los datos proporcionados
        const newChapter = await VideoChapter.create({
            name: name,
            language_id: language_id
        });

        // Si necesitas guardar explícitamente el capítulo, Sequelize ya lo hace automáticamente al crearlo
    
        res.status(201).json({newChapter, created: "ok"}); // Respondemos con el nuevo capítulo creado
    } catch (error) {
        console.log("Este es el error: ", error);
        res.status(500).send("Error creating new chapter");
    }
};

export const deleteChapter = async (req, res) => {
    const { id } = req.params; // Obtener el ID del parámetro de la solicitud
    
    try {
        // Buscar el capítulo por su ID y eliminarlo
        const deletedChapter = await VideoChapter.destroy({
            where: {
                id: id
            }
        });

        if (deletedChapter === 1) {
            // Si el capítulo se eliminó correctamente, responder con un mensaje de éxito
            res.status(200).json({ message: "Chapter deleted successfully" });
        } else {
            // Si el capítulo no se encontró o no se pudo eliminar, responder con un mensaje de error
            res.status(404).json({ error: "Chapter not found" });
        }
    } catch (error) {
        console.error("Error deleting chapter:", error);
        res.status(500).send("Error deleting chapter");
    }
};

export const updateChapter = async (req, res) => {
    const { id } = req.params; // Obtener el ID del capítulo a actualizar desde los parámetros de la solicitud
    const { name, language_id } = req.body; // Obtener los datos actualizados del capítulo desde el cuerpo de la solicitud

    try {
        // Buscar el capítulo por su ID
        const chapterToUpdate = await VideoChapter.findByPk(id);

        if (!chapterToUpdate) {
            // Si el capítulo no se encuentra, responder con un mensaje de error
            return res.status(404).json({ error: "Chapter not found" });
        }

        // Actualizar los datos del capítulo con los nuevos valores
        chapterToUpdate.name = name;
        chapterToUpdate.language_id = language_id.id;

        // Guardar los cambios en la base de datos
        await chapterToUpdate.save();

        // Responder con el capítulo actualizado
        res.status(200).json({chapterToUpdate, updated: "ok"});
    } catch (error) {
        console.error("Error updating chapter:", error);
        res.status(500).send("Error updating chapter");
    }
};