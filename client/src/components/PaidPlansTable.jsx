import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import getParamsEnv from "../functions/getParamsEnv";
import { IoIosAddCircle } from "react-icons/io";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import CreatePlanModal from "./modals/createPlanModal";
import ToasterConfig from "./Toaster";
import toast from "react-hot-toast";
import EditPlanModal from "./modals/EditPlanModal";


const { API_URL_BASE } = getParamsEnv();

const PaidPlansTable = () => {
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paidPlans, setPaidPlans] = useState([]); // Cambia chapters por paidPlans
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [aux, setAux] = useState(true)
  const [deletePlan, setDeletePlan] = useState(null)
  const [planEdit, setPlanEdit] = useState(null)
  const token = useSelector((state) => state?.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPaidPlans = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_URL_BASE}/apiPaidPlans/paidplans`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
          }
        );
        // Guarda los datos de los planes pagados en el estado
        setPaidPlans(response.data);
        
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    getPaidPlans();
  }, [aux]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_URL_BASE}/apiPaidPlans//deletePaidPlan/${deletePlan}`
      );
      if (response.data.deleted === "ok") {
        setAux(!aux);
        toast.success("Plan deleted successfully");
        setDeletePlan(null);
      } else {
        toast.error("There was a problem deleting the plan");
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : "An error has occurred";
      toast.error(`${errorMessage}`);
    }
  };

  const handleDeleteModal = (id) => {
   
    setDeletePlan(id)
    setShowConfirmation(true)
  }

 const deleteConfirmed = (confirmed) => {
    if (confirmed) {
      setShowConfirmation(false);
      handleDelete();
    } else {
      setShowConfirmation(false);
    }
  };

  const handleEditModal = (plan) => {
    setPlanEdit(plan)
    setShowEditPlanModal(true)
  }

  const handleShowCreateModal = () => {
    setShowCreatePlanModal(true);
  };
 
  if (!isLoading) {
    return (
      <>
        <div className="mx-auto">
          <div className="overflow-auto max-h-[700px] relative overflow-x-auto shadow-md sm:rounded-lg ">
            <table className="w-full text-left rtl:text-right text-white dark:text-beige dark:border-beige dark:border">
              <thead className="bg-gray-900 text-white text-left dark:bg-darkPrimary dark:text-darkText dark:border-secondaryColor">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Plan Cost
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Bonus
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Renewal
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <button
                      className="flex flex-row gap-1 p-2 rounded-full hover:bg-primaryPink hover:text-gray-500"
                      onClick={handleShowCreateModal}
                    >
                      <IoIosAddCircle size={20} /> Agregar
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paidPlans.map((plan, index) => (
                  <tr
                    key={index}
                    className="border text-center font-bold border-secondaryColor hover:bg-gray-200 hover:text-black hover:font-bold transition-colors duration-700 dark:hover:bg-gray-200 dark:hover:text-black"
                  >
                    <td className="px-4 py-4">{plan.planName}</td>
                    <td className="px-4 py-4">$ {plan.planCost}</td>
                    <td className="px-4 py-4">$ {plan.bonus}</td>
                    <td className="px-4 py-4">$ {plan.renewal}</td>
                    {/* Agrega más celdas según necesites */}
                    <td className="px-4 py-4">
                        <button
                          className="hover:bg-blue-700 text-black px-2 py-1 rounded mr-2"
                          onClick={() => handleEditModal(plan)}
                        >
                          <MdEdit size={25} className="dark:text-darkText group-hover:text-black dark:group-hover:text-black" />
                        </button>
                        <button
                          className="hover:bg-red-700 text-black px-2 py-1 rounded"
                          onClick={() => handleDeleteModal(plan.idPaidPlan)}
                        >
                          <MdDeleteForever size={25} className="dark:text-darkText group-hover:text-black dark:group-hover:text-black" />
                        </button>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showCreatePlanModal && (
          <CreatePlanModal
          aux={aux}
          setAux={setAux}
          setShowCreatePlanModal={setShowCreatePlanModal}
          />
        )}
        {showEditPlanModal && (
          <EditPlanModal
          aux={aux}
          setAux={setAux}
          setShowEditPlanModal={setShowEditPlanModal}
          planEdit={planEdit}
          />
        )}
        {showConfirmation && deletePlan && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div
              className={`bg-white p-6 rounded-lg shadow-lg text-center sm:flex sm:flex-col ${
                window.innerWidth < 340 ? "max-w-sm" : "max-w-md"
              }`}
            >
              <p className="mb-4  sm:text-base">
                ¿Estás seguro de que deseas eliminar este plan?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => deleteConfirmed(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600  sm:text-base"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => deleteConfirmed(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600  sm:text-base"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        <ToasterConfig />
      </>
    );
  } else {
    return <p>Cargando...</p>;
  }
};

export default PaidPlansTable;
