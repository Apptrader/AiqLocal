export default function getParamsEnv() {
    const API_URL_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
    const VITE_HOME = import.meta.env.VITE_HOME || "/home"
    const VITE_LOGIN_USER = import.meta.env.VITE_LOGIN_USER || "/logInUser"
    const VITE_PAID_PLANS_REGISTER = import.meta.env.VITE_PAID_PLANS_REGISTER || "/paidPlansRegister"
    const VITE_PAID_PLAN_LIST = import.meta.env.VITE_PAID_PLAN_LIST || "/paidPlansList"
    const VITE_REGISTER_USER = import.meta.env.VITE_REGISTER_USER || "/registerUser"
    const VITE_PROFILE = import.meta.env.VITE_PROFILE || "/profile"
    const VITE_PAYMENT_SUCCES = import.meta.env.VITE_PAYMENT_SUCCES || "/payment/success"
    const VITE_ALL_VIDEOS = import.meta.env.VITE_ALL_VIDEOS || "/allvideos"
    const VITE_AIQ_BONUS_PLAN = import.meta.env.VITE_AIQ_BONUS_PLAN || "/aiqBonusPlan"
    const VITE_ABOUT = import.meta.env.VITE_ABOUT || "/about"
    const VITE_CONTACT = import.meta.env.VITE_CONTACT || "/contact"
    const VITE_NODE_PROFILE = import.meta.env.VITE_NODE_PROFILE || "/nodeProfile"
    const VITE_ROOT = import.meta.env.VITE_ROOT || "/"
    const VITE_REGISTER = import.meta.env.VITE_REGISTER || "/register"
    const VITE_USERS = import.meta.env.VITE_USERS || "/users"
    const VITE_VIDEOS_PANEL = import.meta.env.VITE_VIDEOS_PANEL || "/videosPanel"
    const VITE_PLANS_PANEL = import.meta.env.VITE_PLANS_PANEL || "/plansPanel"
    
    return {
        API_URL_BASE, VITE_LOGIN_USER, VITE_HOME, VITE_PAID_PLANS_REGISTER,VITE_PAID_PLAN_LIST,
        VITE_REGISTER_USER, VITE_PROFILE, VITE_PAYMENT_SUCCES, VITE_ALL_VIDEOS,
        VITE_AIQ_BONUS_PLAN, VITE_ABOUT, VITE_CONTACT, VITE_NODE_PROFILE, VITE_ROOT, VITE_REGISTER, VITE_USERS,VITE_PLANS_PANEL, VITE_VIDEOS_PANEL
    };
  }
  




