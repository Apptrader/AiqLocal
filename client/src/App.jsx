import { Routes, Route } from 'react-router-dom';
import LogInUser from './views/LogInUser.jsx'
import PaidPlansRegister from './views/PaidPlansRegister.jsx';
import PaidPlansList from './views/PaidPlansList.jsx';
import RegisterUser from './views/RegisterUser.jsx';
import PaymentSuccesComponent from './components/PaymentSuccesComponent.jsx';
import Home from './views/Home.jsx';
import UserProfileComponent from './views/UserProfileComponent.jsx';
import Videos from './views/Videos.jsx';
import AiqBonusPlan from './views/AiqBonusPlan.jsx';
import About from './views/About.jsx';
import Contact from './views/Contact.jsx';
import NodeProfile from './views/NodeProfileComponent.jsx';

import getParamsEnv from './functions/getParamsEnv.js';
import UsersView from './views/UsersView.jsx';
import VideosPanelView from './views/VideoPanelView.jsx';
import PlansPanelView from './views/PlansPanelView.jsx';
import NeoTechAIRobot from './views/NeoTechAIRobot.jsx';
import ChaptersPanelView from './views/ChapterPanelView.jsx';
import PaidPlanPanelView from './views/PaidPlansPanelView.jsx'
import TermsAndConditions from './views/TermsAndCondition.jsx';
import UserControlPanel from './views/UserControlPaner.jsx';
import PaymentSuccessSubComponent from './components/PaymentSuccesSub.jsx';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './redux/actions.js';



const {API_URL_BASE,VITE_PAYMENT_SUCCES_SUB, VITE_USER_PANEL, VITE_LOGIN_USER, VITE_HOME, VITE_PAID_PLANS_REGISTER, VITE_PAID_PLAN_LIST,
  VITE_REGISTER_USER, VITE_PROFILE, VITE_PAYMENT_SUCCES, VITE_ALL_VIDEOS,
  VITE_AIQ_BONUS_PLAN, VITE_ABOUT, VITE_CONTACT, VITE_NODE_PROFILE, VITE_ROOT, VITE_REGISTER, VITE_USERS, VITE_VIDEOS_PANEL, VITE_PLANS_PANEL, VITE_NEO_TECH_AI_ROBOT, VITE_CHAPTERS_PANEL, VITE_TERMS_AND_CONDITION} = getParamsEnv()



function App() {

const token = useSelector((state) => state.user.token)
const dispatch = useDispatch()



useEffect(() => {
  const getActualUser = async () => {
    try {
      const response = await axios.get(
        `${API_URL_BASE}/apiUser/getUserById`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data)
      dispatch(setUser({
        userFound: response.data.userFound,
        token
      }));
    } catch (error) {
      console.log(error);
    }
  };

  if (token) {
    getActualUser();
  }
}, [token]);


  return (
    <>
      <Routes>
        <Route path={VITE_HOME} element={<Home/>}></Route>
        <Route path={VITE_LOGIN_USER} element={<LogInUser />}></Route>
        <Route path={VITE_PAID_PLANS_REGISTER} element={<PaidPlansRegister />}></Route>
        <Route path={VITE_PAID_PLAN_LIST} element={<PaidPlansList />}></Route>
        <Route path={VITE_REGISTER_USER} element={<RegisterUser />}></Route>
        <Route path={VITE_PROFILE} element={<UserProfileComponent />}></Route>
        <Route path={VITE_PAYMENT_SUCCES} element={<PaymentSuccesComponent />}></Route>
        <Route path={VITE_PAYMENT_SUCCES_SUB} element={<PaymentSuccessSubComponent />}></Route>
        <Route path={VITE_ALL_VIDEOS} element={<Videos/>}></Route>
        {/*  <Route path='/payment/cancel' element={<PaymentCancelComponent />}></Route> */}
        <Route path={VITE_AIQ_BONUS_PLAN} element={<AiqBonusPlan />}></Route>
        <Route path={VITE_ABOUT} element={<About/>}></Route>
        <Route path={VITE_CONTACT} element={<Contact/>}></Route>
        <Route path={VITE_NODE_PROFILE} element={<NodeProfile/>}></Route>
        <Route path={VITE_ROOT} element={<Home/>}></Route>
        <Route path={VITE_REGISTER} element={<RegisterUser/>}></Route>
        <Route path={VITE_USERS} element={<UsersView/>}></Route>
        <Route path={VITE_VIDEOS_PANEL} element={<VideosPanelView/>}></Route>
        
        <Route path={VITE_CHAPTERS_PANEL} element={<ChaptersPanelView/>}></Route>
        <Route path={VITE_PLANS_PANEL} element={<PaidPlanPanelView/>}></Route>
        <Route path={VITE_NEO_TECH_AI_ROBOT} element={<NeoTechAIRobot/>}></Route>
        <Route path={VITE_TERMS_AND_CONDITION} element={<TermsAndConditions/>}></Route>
        <Route path={VITE_USER_PANEL} element={<UserControlPanel/>}></Route>
      </Routes>
    </>
  )
}

export default App
