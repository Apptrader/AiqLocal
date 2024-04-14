import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import getParamsEnv from "../../functions/getParamsEnv";
import Loader from "../Loader";
import toast from 'react-hot-toast';

const { API_URL_BASE } = getParamsEnv();

const EditUserModal = ({
    aux,
    setAux,
    setEditUserModal,
    token,
    editUser,
    userToken
}) => {
    const [user, setUser] = useState({
        UserCode: editUser.UserCode || "",
        onlySubs: editUser.onlySubs || false,
        elegibility: editUser.elegibility || false
    });
    const [originalUserCode, setOriginalUserCode] = useState(editUser.UserCode || ""); // Estado para almacenar el User Code original

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

    const closeModal = () => {
        setAux(!aux);
        setEditUserModal(false);
        setUser({
            UserCode: "",
            onlySubs: false,
            elegibility: false
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setUser(prevState => ({
            ...prevState,
            [name]: newValue,
        }));
        const validationErrors = {
            ...errors,
            [name]: newValue === "" ? "This field is required" : ""
        };
        setErrors(validationErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validations on submit
        const validationErrors = {
            UserCode: user.UserCode === "" ? "This field is required" : "",
            onlySubs: user.onlySubs === "" ? "Please select an option for Only Subs" : "",
            elegibility: user.elegibility === "" ? "Please select an option for Elegibility" : "",
            // Add more validations as needed
        };

        setErrors(validationErrors);

        const hasErrors = Object.values(validationErrors).some((error) => error !== "");
        if (!hasErrors) {
            try {
                setDisableSubmit(true);
                setSubmitLoader(true);

                const data = {
                    onlySubs: user.onlySubs,
                    elegibility: user.elegibility,
                    id: editUser.idUser
                };

                // Agregar UserCode a data solo si ha cambiado
                if (originalUserCode !== user.UserCode) {
                    data.UserCode = parseInt(user.UserCode);
                }

                const response = await axios.put(`${API_URL_BASE}/apiUser/updateByAdmin`, data, {
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                });

                if (response.data.updated === "ok") {
                    closeModal()
                    setSubmitLoader(false);
                } else {
                    toast.error("Error updating user");
                    setDisableSubmit(false);
                    setSubmitLoader(false);
                    // Error handling if creation was not successful
                }
            } catch (error) {
                toast.error("An error occurred while updating user");
                setDisableSubmit(false);
                setSubmitLoader(false);
                // Error handling if there's any issue with the request
            }
        }
    };

    return (
        <>
            <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full" style={{ background: "rgba(0, 0, 0, 0.70)" }}>
                <div>
                    <div className="w-4/5 mx-auto bg-gray-900 text-white shadow rounded-lg p-6 md:w-full dark:bg-darkBackground">
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-semibold mb-4 text-white font-bold dark:text-darkText">Edit User</h1>
                            <IoClose onClick={closeModal} className="cursor-pointer mt-2 w-5 h-5 hover:scale-125 dark:text-darkText" />
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                <div>
                                    <label className="pl-1 font-bold dark:text-darkText">User Code</label>
                                    <input
                                        onChange={handleChange}
                                        type="number"
                                        name="UserCode"
                                        value={user.UserCode}
                                        placeholder="User Code"
                                        className={`border border-black p-2 text-black font-bold bg-gray-300 rounded w-full dark:text-darkText dark:bg-darkPrimary`}
                                    />
                                    {errors.UserCode && (
                                        <p className="text-red-500 font-bold">{errors.UserCode}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="pl-1 font-bold dark:text-darkText">Only Subs</label>
                                    <select
                                        onChange={handleChange}
                                        name="onlySubs"
                                        value={user.onlySubs}
                                        className={`border border-black p-2 text-black font-bold bg-gray-300 rounded w-full dark:text-darkText dark:bg-darkPrimary`}
                                    >
                                        <option value="">Select an option</option>
                                        <option value={true}>True</option>
                                        <option value={false}>False</option>
                                    </select>
                                    {errors.onlySubs && (
                                        <p className="text-red-500 font-bold">{errors.onlySubs}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="pl-1 font-bold dark:text-darkText">Elegibility</label>
                                    <select
                                        onChange={handleChange}
                                        name="elegibility"
                                        value={user.elegibility}
                                        className={`border border-black p-2 text-black font-bold bg-gray-300 rounded w-full dark:text-darkText dark:bg-darkPrimary`}
                                    >
                                        <option value="">Select an option</option>
                                        <option value={true}>True</option>
                                        <option value={false}>False</option>
                                    </select>
                                    {errors.elegibility && (
                                        <p className="text-red-500 font-bold">{errors.elegibility}</p>
                                    )}
                                </div>
                                {/* Add more user fields as needed */}
                            </div>
                            <div className="mt-8 mb-2">
                                {/* More user fields can be added here if necessary */}
                            </div>
                            <div className="flex justify-center items-center">
                                <button
                                    type="submit"
                                    disabled={disableSubmit}
                                    className="mt-2 px-4 py-2 w-fit rounded bg-gray-800 hover:bg-gray-400  hover:text-black hover:font-bold shadow shadow-black text-white hover:bg-secondaryColor transition-colors duration-700 dark:text-darkText dark:bg-darkPrimary dark:hover:bg-blue-600"
                                >
                                    {submitLoader ? <Loader /> : "Update User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditUserModal;