import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import getParamsEnv from "../../functions/getParamsEnv";
import Loader from "../Loader";

const { API_URL_BASE } = getParamsEnv();

const CreateChapterModal = ({
    aux,
    setAux,
    setShowCreateChapterModal,
    languages,
}) => {
    const [chapter, setChapter] = useState({
        name: "",
        language_id: ""
    });
    
    
    const [errors, setErrors] = useState({});
    const [submitLoader, setSubmitLoader] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);

    useEffect(() => {
        const close = (e) => {
            if (e.keyCode === 27) {
                setShowCreateChapterModal(false);
            }
        };
        window.addEventListener("keydown", close);
        return () => window.removeEventListener("keydown", close);
    }, []);

    const closeModal = () => {
        setShowCreateChapterModal(false);
        setChapter({
            name: "",
            language_id: ""
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChapter(prevState => ({
            ...prevState,
            [name]: value
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
            name: chapter.name.trim() === "" ? "This field is required": "",
            language_id: chapter.language_id === "" ? "Please select a language": "",
        };

        setErrors(validationErrors);

        const hasErrors = Object.values(validationErrors).some((error) => error !== "");
        if (!hasErrors) {
            try {
                setDisableSubmit(true);
                setSubmitLoader(true);

                const data = {
                    name: chapter.name,
                    language_id: chapter.language_id
                }

                const response = await axios.post(`${API_URL_BASE}/apiChapters/createChapter`, data);
                if (response.data.created === "ok") {
                    closeModal()
                    setSubmitLoader(false);
                    setAux(!aux);
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

    console.log(chapter)

    return (
        <>
            <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full" style={{ background: "rgba(0, 0, 0, 0.70)" }}>
                <div>
                    <div className="w-4/5 mx-auto bg-gray-900 text-white shadow rounded-lg p-6 md:w-full dark:bg-darkBackground">
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-semibold mb-4 text-white font-bold dark:text-darkText">Add New Chapter</h1>
                            <IoClose onClick={closeModal} className="cursor-pointer mt-2 w-5 h-5 hover:scale-125 dark:text-darkText" />
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                <div>
                                    <label className="pl-1 font-bold dark:text-darkText">Chapter Title</label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        name="name"
                                        value={chapter.name}
                                        placeholder="Title"
                                        className={`border border-black p-2 text-black font-bold bg-gray-300 rounded w-full dark:text-darkText dark:bg-darkPrimary`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 font-bold">{errors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="pl-1 font-bold dark:text-darkText">Language</label>
                                    <select
                                        onChange={handleChange}
                                        name="language_id"
                                        value={chapter.language_id}
                                        className={`border border-black p-2 rounded text-black font-bold bg-gray-300  w-full dark:text-darkText dark:bg-darkPrimary`}
                                    >
                                        <option className="text-black font-bold" value="">Select Language</option>
                                        {languages.map(language => (
                                            <option  className="text-black font-bold" key={language.id} value={language.id}>{language.name}</option>
                                        ))}
                                    </select>
                                    {errors.language_id && (
                                        <p className="text-red-500 font-bold">{errors.language_id}</p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-8 mb-2">
                                {/* Más campos de video pueden agregarse aquí si es necesario */}
                            </div>
                            <div className="flex justify-center items-center">
                                <button
                                    type="submit"
                                    disabled={disableSubmit}
                                    className="mt-2 px-4 py-2 w-fit rounded bg-gray-800 hover:bg-gray-400  hover:text-black hover:font-bold shadow shadow-black text-white hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                                >
                                    {submitLoader ? <Loader /> : "Create Chapter"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateChapterModal;
