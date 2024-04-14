
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";



const ProfileCard = ({ userInfo, rankNames, referred }) => {

  const totalNodos = useSelector((state) => state?.nodes)


  let amount;
  if (userInfo.idPaidPlan === 1) {
    amount = "Basic";
  } else if (userInfo.idPaidPlan === 2) {
    amount = "Pro";
  } else if (userInfo.idPaidPlan === 3) {
    amount = "Sonic";
  } else {
    amount
  }

  const today = new Date();
  const day = today.getDay();

  // Si hoy es viernes, el viernes pasado es hoy
  const previousFriday = day === 5 ? new Date(today) : getPreviousFriday(today);
  const nextFriday = getNextFriday(previousFriday);

  const formatDate = (date) => {
    const options = { day: "numeric", month: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  function getPreviousFriday(date) {
    const previousFriday = new Date(date);
    previousFriday.setDate(date.getDate() - (date.getDay() + 2) % 7); // Previous Friday
    return previousFriday;
  }

  function getNextFriday(date) {
    const nextFriday = new Date(date);
    nextFriday.setDate(nextFriday.getDate() + 7); // Next Friday
    return nextFriday;
  }
  if (totalNodos) {
    return (
      <div className='card bg-gradient-to-br from-gray-700 to-black text-white p-4 shadow-md rounded-lg'>
        <div className='p-4 w-full'>
          <h2 className='text-2xl font-bold text-center'>{userInfo.UserName}</h2>
          <p className='text-center pt-4 pb-4'>Your next payment</p>
          <p className="m-auto text-center p-2 text-2xl font-bold mt-2 border border-gray-300 rounded-full w-1/3" style={{ boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)' }}>${userInfo.payAmount || 0}</p>
          <p className="text-center pt-4">Details</p>
        </div>
        <div className="p-4 text-white text-xl font-bold ">
          <ul className="list-none p-0 m-0">
            <li className="flex p-2 justify-between items-center py-2 border-b border-gray-300">
              <span>AIQ ID number:</span>
              <span>{userInfo.UserCode}</span>
            </li>
            <li className="flex p-2 py-4 justify-between items-center py-2 border-b border-gray-300">
              <span>Commission Week:</span>
              <span>{formatDate(previousFriday)} - {formatDate(nextFriday)}</span>
            </li>
            <li className="flex p-2 py-4 justify-between items-center py-2 border-b border-gray-300">
              <span>Status:</span>
              <span style={{ color: userInfo.status === 1 ? 'green' : 'red' }}>
                {userInfo.status === 1 ? 'active' : 'inactive'}
              </span>
            </li>
            <li className="flex p-2 py-4 justify-between items-center py-2 border-b border-gray-300">
              <span>Distributor Eligibility:</span>
              <span className="text-red-500">False</span>
            </li>
            <li className="flex p-2 py-4 justify-between items-center py-2 border-b border-gray-300">
              <span>Total Active Members:</span>
              {totalNodos !== 0 && (<span>{totalNodos.total}</span>) || (<span>0</span>)}
            </li>
            <li className="flex p-2 py-4 justify-between items-center py-2 border-b border-gray-300">
              <span>Highest Rank:</span>
              <span>{rankNames.highestRankId || "-"}</span>
            </li>
            <li className="flex p-2 py-4 justify-between items-center py-2 border-b border-gray-300">
              <span>Subscription:</span>
              <span>{amount}</span>
            </li>
            <li className="flex p-2 py-4 justify-between items-center py-2 border-b border-gray-300">
              <span>AIQ-ADU Token:</span>
              <span>0</span>
            </li>
            <li className="flex p-2 py-4 justify-between items-center py-2 border-b border-gray-300">
              <span>Enroller's Name:</span>
              <span>{referred ? referred.UserName : "-"}</span>
            </li>
            <li className="flex p-2 py-4 justify-between items-center py-2 border-b border-gray-300">
              <span>Enroller's Phone:</span>
              <span>{referred ? referred.Phone : "-"}</span>
            </li>
            <li className="flex p-2 py-4 justify-between items-center py-2 border-b border-gray-300">
              <span>Enroller's Email:</span>
              <span className="text-sm">{referred ? referred.Email : "-"}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  } else {
    return <p>Cargando</p>
  }

}

export default ProfileCard;
