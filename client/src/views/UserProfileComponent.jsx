import React from 'react';
import NavbarComponent from '../components/NavbarComponent';
import ProfileHome from '../components/ProfileHome';
import { useSelector } from 'react-redux';
import SidebarComponent from '../components/SidebarComponent';

const UserProfileComponent = () => {
  const user = useSelector((state) => state?.user);

  // Verifica si user y user.userFound no son null o undefined antes de acceder a la propiedad role
  const role = user?.userFound?.role;

  console.log(role, "usuario en profile");

  return (
    <div>
      <NavbarComponent />
      <div className='flex flex-row bg-black'>
        {role === "1" && <SidebarComponent className="flex-1" />}
        <ProfileHome user={user} className={role === 1 ? "flex-3" : "flex-4"} />
      </div>
    </div>
  );
}

export default UserProfileComponent;