
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import getParamsEnv from "../../functions/getParamsEnv";
import Loader from "../Loader";

const { API_URL_BASE } = getParamsEnv();

const CreateVideoModal = ({
    aux,
    setAux,
    setShowCreateVideoModal,
    token,
}) => {
    const [video, setVideo] = useState({
        chapter_id: "",
        title: "",
        videoUrl: "", // Cambio de video a videoUrl
        language: "",
    });

    const [errors, setErrors] = useState({});
    const [submitLoader, setSubmitLoader] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        const close = (e) => {
            if (e.keyCode === 27) {
                setShowCreateVideoModal(false);
            }
        };
        window.addEventListener("keydown", close);
        return () => window.removeEventListener("keydown", close);
    }, []);

    useEffect(() => {
        const getAllChapters = async () => {
            try {
                const response = await axios.get(`${API_URL_BASE}/apiVideos/chapterVideos`);
                // Filtrar los capítulos según el language_id seleccionado
                const filteredChapters = response.data.filter(chapter => chapter.language_id === parseInt(video.language));
                setChapters(filteredChapters);
            } catch (error) {
                console.log(error);
            }
        };
        getAllChapters();
    }, [video.language])
    const closeModal = () => {
        setShowCreateVideoModal(false);
        setVideo({
            chapter_id: "",
            title: "",
            videoUrl: "", // Cambio de video a videoUrl
            language: false,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVideo(prevState => ({
            ...prevState,
            [name]: value,
        }));
        const validationErrors = {
            ...errors,
            [name]: value.trim() === "" ? "This field is required" : ""
        };
        setErrors(validationErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validations on submit
        const validationErrors = {
            title: video.title.trim() === "" ? "This field is required" : "",
            videoUrl: video.videoUrl.trim() === "" ? "This field is required" : "", // Cambio de video a videoUrl
            language: video.language === "" ? "Please select a language" : "",
            chapter_id: video.chapter_id === "" ? "Please select a chapter" : "",
        };

        setErrors(validationErrors);

        const hasErrors = Object.values(validationErrors).some((error) => error !== "");
        if (!hasErrors) {
            try {
                setDisableSubmit(true);
                setSubmitLoader(true);

                const response = await axios.post(`${API_URL_BASE}/apiVideos/createVideo`, video, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.created === "ok") {
                    setSubmitLoader(false);
                    setAux(!aux);
                    closeModal();
                } else {
                    setDisableSubmit(false);
                    setSubmitLoader(false);
                    // Error handling if creation was not successful
                }
            } catch (error) {
                setDisableSubmit(false);
                setSubmitLoader(false);
                // Error handling if there's any issue with the request
            }
        }
    };

    console.log(chapters)
    return (
        <>
            <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full" style={{ background: "rgba(0, 0, 0, 0.70)" }}>
                <div>
                    <div className="w-4/5 mx-auto bg-gray-900 text-white shadow rounded-lg p-6 md:w-full dark:bg-darkBackground">
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-semibold mb-4 text-white font-bold dark:text-darkText">Add New Video</h1>
                            <IoClose onClick={closeModal} className="cursor-pointer mt-2 w-5 h-5 hover:scale-125 dark:text-darkText" />
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                <div>
                                    <label className="pl-1 font-bold dark:text-darkText">Video Title</label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        name="title"
                                        value={video.title}
                                        placeholder="Title"
                                        className={`border border-black p-2 text-black font-bold bg-gray-300 rounded w-full dark:text-darkText dark:bg-darkPrimary`}
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 font-bold">{errors.title}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="pl-1 font-bold dark:text-darkText">Video URL</label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        name="videoUrl" // Cambio de video a videoUrl
                                        value={video.videoUrl} // Cambio de video a videoUrl
                                        placeholder="Video URL"
                                        className={`border border-black p-2 text-black font-bold bg-gray-300 rounded w-full dark:text-darkText dark:bg-darkPrimary`}
                                    />
                                    {errors.videoUrl && (
                                        <p className="text-red-500 font-bold">{errors.videoUrl}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="pl-1 font-bold dark:text-darkText">Language</label>
                                    <select
                                        onChange={handleChange}
                                        name="language"
                                        className={`border border-black p-2 rounded text-black font-bold bg-gray-300  w-full dark:text-darkText dark:bg-darkPrimary`}
                                    >
                                        <option className="text-black font-bold" value="">Select Language</option>
                                        <option className="text-black font-bold" value="1">English</option>
                                        <option className="text-black font-bold" value="2">Arabic</option>
                                        <option className="text-black font-bold" value="3">Spanish</option>
                                    </select>
                                    {errors.language && (
                                        <p className="text-red-500 font-bold">{errors.language}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="pl-1 font-bold dark:text-darkText">Section/chapter</label>
                                    <select
                                        onChange={handleChange}
                                        name="chapter_id"
                                        value={video.chapter_id}
                                        className={`border border-black p-2 rounded text-black font-bold bg-gray-300  w-full dark:text-darkText dark:bg-darkPrimary`}
                                    >
                                        <option value="">Select Section or Chapter</option>
                                        {chapters.map(chapter => (
                                            <option className="text-black font-bold" key={chapter.id} value={chapter.id}>{chapter.name}</option>
                                        ))}
                                    </select>
                                    {errors.chapter_id && (
                                        <p className="text-red-500 font-bold">{errors.chapter_id}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-8 mb-2">
                                {/* More video fields can be added here if necessary */}
                            </div>
                            <div className="flex justify-center items-center">
                                <button
                                    type="submit"
                                    disabled={disableSubmit}
                                    className="mt-2 px-4 py-2 w-fit rounded bg-gray-800 hover:bg-gray-400  hover:text-black hover:font-bold shadow shadow-black text-white hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                                >
                                    {submitLoader ? <Loader /> : "Create Video"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateVideoModal;