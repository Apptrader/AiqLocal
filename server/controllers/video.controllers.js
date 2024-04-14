import Video from "../models/video.model.js";
import VideoChapter from "../models/videoChapter.model.js";
import VideoLanguage from "../models/languages.model.js";
import multer from "multer";

import multerS3 from 'multer-s3';
import {config} from 'dotenv';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // Asegúrate de que la importación sea correcta
import {  GetObjectCommand } from "@aws-sdk/client-s3";

import { CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
dotenv.config();

config();



const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION



const s3Client = new S3Client({ 
  region: process.env.AWS_BUCKET_REGION, 
  credentials: {
    accessKeyId: process.env.AWS_PUBLIC_KEY, 
    secretAccessKey: process.env.AWS_SECRET_KEY,
  }
});



const upload = multer({
  storage: multer.memoryStorage(), // Almacenamos el archivo en memoria para acceder a su contenido
  fileFilter: function (req, file, cb) {
    // Verificar que el archivo tenga un tipo de contenido válido
    if (!file.mimetype) {
      return cb(new Error('El tipo de contenido del archivo no está definido.'));
    }
    cb(null, true);
  }
});

export const uploadVideo = upload.single('video');

/* export const createVideo = async (req, res) => {
  const {
    title,
    chapter_id,
    language
  } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file was provided.' });
  }

  try {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: req.file.originalname, // Nombre del archivo en S3
      Body: req.file.buffer, // Contenido del archivo
      ContentType: 'video/mp4' // Tipo de contenido
    };

    // Subir el archivo al bucket de S3
    const data = await s3Client.send(new PutObjectCommand(uploadParams));

    // Construir la URL del video en S3
    const videoUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${req.file.originalname}`;

    console.log(data, "la info del video")


     const newVideo = await Video.create({
      videoUrl: videoUrl,
      title,
      chapter_id,
      language
    });

    res.status(201).json({ message: 'New video created', video: newVideo, created: "ok" });
  } catch (error) {
    console.error('Error creating new video:', error);
    res.status(500).json({ error: 'Error creating new video' });
  }
}; */



export const createVideo = async (req, res) => {
  const {
    title,
    chapter_id,
    videoUrl, // Modificado para aceptar el enlace de video
    language
  } = req.body;

  console.log(language, "chapter")
  
  if (!videoUrl) {
    return res.status(400).json({ error: 'No video URL was provided.' });
  }

  try {
    // Construir la URL del video en S3 (en este caso, el enlace de video proporcionado)
    const videoS3Url = videoUrl;

    // Crear un nuevo video con la URL proporcionada
    const newVideo = await Video.create({
      videoUrl: videoS3Url,
      title,
      chapter_id,
      language
    });

    res.status(201).json({ message: 'New video created', video: newVideo, created: "ok" });
  } catch (error) {
    console.error('Error creating new video:', error);
    res.status(500).json({ error: 'Error creating new video' });
  }
};

export const allVideos = async (req, res) => {
  try {
    // Consulta para obtener los datos de los videos desde tu base de datos
    const videos = await Video.findAll({
      include: [
        {
          model: VideoChapter,
          attributes: ['name', "id"] // Include original
        },
        {
          model: VideoLanguage,
          attributes: ['name', "id"], // Nuevo include para VideoLanguage
        }
      ]
    });
   /*  console.log("ESTOS SON LOS VIDEOS: ",videos) */

    // Construir las URLs de los videos en tu bucket de S3
    const s3 = new S3Client({ 
      region: process.env.AWS_BUCKET_REGION, 
      credentials: {
        accessKeyId: process.env.AWS_PUBLIC_KEY, 
        secretAccessKey: process.env.AWS_SECRET_KEY,
      }
    });

    const bucket = process.env.AWS_BUCKET_NAME;

    const videosWithS3Urls = await Promise.all(
      videos.map(async video => {
        const s3Params = {
          Bucket: bucket,
          Key: video.videoUrl // Utiliza la propiedad correcta que almacena la ubicación del video en S3
        };

        const command = new GetObjectCommand(s3Params); // Usamos GetObjectCommand para obtener el objeto

        //const signedUrl = await s3.getSignedUrl(command, { expiresIn: 3600 }); // Obtenemos la URL firmada para el objeto

        return { ...video.toJSON(), s3Url: command };
      })
    );

    res.json(videosWithS3Urls);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const createChapter = async (req, res) => {
  const { name, language_id } = req.body;

  try {
    // Verificar si el capítulo ya existe
    const existingChapter = await VideoChapter.findOne({ where: { name, language_id } });
    if (existingChapter) {
      return res.status(400).json({ error: 'Chapter already exists' });
    }

    // Crear un nuevo capítulo
    const newChapter = await VideoChapter.create({ name, language_id });

    res.status(201).json({ message: 'New chapter created', chapter: newChapter });

  } catch (error) {
    console.error('Error creating new chapter:', error);
    res.status(500).json({ error: 'Error creating new chapter' });
  }
};

export const getAllChapters = async (req,res) => {
  try {
    const response = await VideoChapter.findAll()
    res.status(200).json(response)
  } catch (error) {
    res.json(error)
  }
}

export const deleteVideos = async (req, res) => {
  const { id } = req.body;
  try {
    const deletedRows = await Video.destroy({
      where: {
        id: id
      }
    });

   
    if (deletedRows > 0) {
      return res.status(200).json({ message: 'Elemento eliminado correctamente.', deleted: "ok" });
    } else {
      return res.status(404).json({ message: 'No se encontró ningún elemento con el ID proporcionado.' });
    }
  } catch (error) {
    console.error('Error al intentar eliminar el elemento:', error);
    return res.status(500).json({ message: 'Hubo un error al intentar eliminar el elemento.' });
  }
};

export const editVideo = async (req, res) => {
  const { title, chapter_id, videoUrl, language, id } = req.body;

  console.log(id)

  if (!videoUrl) {
    return res.status(400).json({ error: 'No video URL was provided.' });
  }

  try {
    // Verificar si el video existe
    const existingVideo = await Video.findOne({
      where: {
        id: id
      }
    });

    if (!existingVideo) {
      return res.status(404).json({ error: 'Video not found.' });
    }

    // Construir la URL del video en S3 (en este caso, el enlace de video proporcionado)
    const videoS3Url = videoUrl;

    // Actualizar el video con los datos proporcionados
    await existingVideo.update({
      videoUrl: videoS3Url,
      title,
      chapter_id,
      language
    });

    console.log(existingVideo, "existen")

    res.json({ message: 'Video updated successfully', updated: 'ok' });
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Error updating video' });
  }
};