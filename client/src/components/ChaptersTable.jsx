import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import getParamsEnv from "../functions/getParamsEnv";
import { IoIosAddCircle } from "react-icons/io";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import CreateChapterModal from "./modals/CreateChapterModal";
import EditChapterModal from "./modals/EditChapterModal";

const { API_URL_BASE } = getParamsEnv();


const ChaptersTable = () => {
  const [showCreateChapterModal, setShowCreateChapterModal] = useState(false);
  const [showEditChapterModal, setShowEditChapterModal] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [filters, setFilters] = useState({ name: "", language: "" });
  const [languages, setLanguages] = useState([]);
  const [editChapter, setEditChapter] = useState("")
  const [aux, setAux] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/apiChapters/chapters`);
        setChapters(response.data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchData();
  }, [aux]);

  const handleShowCreateModal = () => {
    setShowCreateChapterModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateChapterModal(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name.toLowerCase()]: value });
  };

  useEffect(() => {
    const getAllLanguages = async () => {
      try {
        const response = await axios.get(`${API_URL_BASE}/apiLanguages/languages`);
        setLanguages(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllLanguages();
  }, []);

  useEffect(() => {
    const filtered = chapters.filter(chapter => {
      const nameMatch = chapter.name.toLowerCase().includes(filters.name.toLowerCase());
      const languageMatch = filters.language ? chapter.videoLanguage.id === parseInt(filters.language) : true;
      return nameMatch && languageMatch;
    });
    setFilteredChapters(filtered);
  }, [chapters, filters]);

  const handleEditChapterModal = (chapter) => {
    setEditChapter(chapter)
    setShowEditChapterModal(true)
  }


  return (
    <>
      <div className="mx-auto">
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Nombre"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            className="p-2 text-black font-extrabold border border-gray-300 rounded mr-2"
          />
          <select
            name="language"
            value={filters.language}
            onChange={handleFilterChange}
            className="p-2 border text-black font-extrabold border-gray-300 rounded mr-2"
          >
            <option value="">Seleccione un idioma</option>
            {languages.map(language => (
              <option className="text-black font-bold" key={language.id} value={language.id}>{language.name}</option>
            ))}
          </select>
          <button
            className="p-2 bg-gray-800 text-white font-bold rounded hover:bg-gray-700"
            onClick={() => setFilteredChapters(chapters)}
          >
            Limpiar Filtros
          </button>
        </div>
        <div className="overflow-auto max-h-[700px] relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-left rtl:text-right text-white dark:text-beige dark:border-beige dark:border">
            <thead className="bg-gray-900 text-white text-left dark:bg-darkPrimary dark:text-darkText dark:border-secondaryColor">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Language ID
                </th>
                <th scope="col" className="px-4 py-3">
                  <button
                    className="flex flex-row gap-1 p-2 rounded-full bg-gray-800 hover:bg-primaryPink hover:text-gray-500"
                    onClick={handleShowCreateModal}
                  >
                    <IoIosAddCircle size={20} /> Agregar
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredChapters.map((chapter, index) => (
                <tr
                  key={index}
                  className="border text-center font-bold border-secondaryColor hover:bg-gray-200 hover:text-black hover:font-bold transition-colors duration-700 dark:hover:bg-gray-200 dark:hover:text-black"
                >
                  <td className="px-4 py-4">{chapter.name}</td>
                  <td className="px-4 py-4">{chapter.videoLanguage.name}</td>
                  <td className="px-4 py-4">
                    <button
                      className="hover:bg-blue-700 text-black px-2 py-1 rounded mr-2"
                      onClick={() => handleEditChapterModal(chapter)}
                    >
                      <MdEdit size={25} className="dark:text-darkText group-hover:text-black dark:group-hover:text-black" />
                    </button>
                    <button
                      className="hover:bg-red-700 text-black px-2 py-1 rounded"
                      onClick={() => handleDeleteModal(chapter.id)}
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
      {showCreateChapterModal && (
        <CreateChapterModal
          setShowCreateChapterModal={setShowCreateChapterModal}
          languages={languages}
        />
      )}
      {showEditChapterModal && (
        <EditChapterModal
          setShowEditChapterModal={setShowEditChapterModal}
          languages={languages}
          editChapter={editChapter}
          setAux={setAux}
          aux={aux}
        />
      )}
    </>
  );
};

export default ChaptersTable;