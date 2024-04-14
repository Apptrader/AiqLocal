import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setNodes } from '../redux/actions';
import { useNavigate } from 'react-router-dom';
import getParamsEnv from '../functions/getParamsEnv';

const {API_URL_BASE} = getParamsEnv()

const ReferralTree = () => {
  const [treeData, setTreeData] = useState()
  const user = useSelector((state)=> state?.user);
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()


  useEffect(() => {
    const fetchTreeData = async () => {
      try {
        const tree = await axios.get(`${API_URL_BASE}/apiUser/referralTree`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });


        setTreeData(tree.data.referralTree);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchTreeData();
  }, [user.token])

  const dataTree = [
   { children: treeData,
    referent: user,}
  ]

  useEffect(() => {

    let cantidadTotalNodos = 0;
  let cantidadNodosLeft = 0;
  let cantidadNodosRight = 0;
  
  treeData && treeData.forEach((elemento) => {
    const contarNodos = (objeto, visitados = new Set()) => {
    
      if (visitados.has(objeto)) {
        return 0;
      }
      
      visitados.add(objeto);
    
      let cantidadNodos = 1;
    
      if (objeto.children && objeto.children.length > 0) {
        objeto.children.forEach((hijo) => {
          cantidadNodos += contarNodos(hijo, visitados);
        });
      }
    
      return cantidadNodos;
    };
  
    cantidadTotalNodos += contarNodos(elemento);
  
    
    if (elemento.referent.position === "left") {
      cantidadNodosLeft += contarNodos(elemento);
    } else if (elemento.referent.position === "right") {
      cantidadNodosRight += contarNodos(elemento);
    }
  });
  
  const resultado = {
    left: cantidadNodosLeft,
    right: cantidadNodosRight,
    total: cantidadTotalNodos,
  };

 

  dispatch(setNodes(resultado))


  },[treeData])
  

 const addNameToNode = (node) => {
    if (node.referent) {
      node.name = node.referent.UserName;
    }
    if (node.children) {
      node.children.forEach((child) => addNameToNode(child));
    }
  };

  if (treeData && treeData.length > 0) {
    const modifiedTreeData = JSON.parse(JSON.stringify(dataTree));
    addNameToNode(modifiedTreeData[0]);

    const handleNodeClick = (node) => {
      navigate("/NodeProfile", {state: {user: node.data.referent}})
    } 

    return (
      <div className="w-full h-full bg-gray-800">
        <Tree
          data={modifiedTreeData[0]}
          orientation="vertical"
          translate={{ x: 300, y: 50 }}
          onNodeClick={handleNodeClick}
          nodeSvgShape={{
            shape: 'circle',
            shapeProps: {
              className: 'fill-bg-green-500 stroke-border-green-600 stroke-width-2',
            },
          }}
          nodeLabelComponent={{
            render: <text className="text-white text-sm" />,
          }}
          styles={{
            links: 'stroke-red-500 stroke-width-2',
          }}
        />
      </div>
    );
  }

  return null;
};

export default ReferralTree;