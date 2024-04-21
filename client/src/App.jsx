import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

import { defaultRolesMap, defaultRolePermissionsMap } from './Authorizations'; 

import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminPage from './pages/AdminPage';
import NotFoundPage from "./pages/NotFoundPage";
import PrivateRoute from "./components/PrivateRoute";

import { getDefaultRoles, getDefaultPermissions, createNewRoles, createNewPermissions } from './services/userServices';


export default function App() {
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // set default configurations for roles and authorizations
    const setDefaultConfig = async () => {
      // set default roles consfiguration
      const defaultRoles = await getDefaultRoles();

      if (!defaultRoles) {
        // default roles map is not available; create it and add to the DB
        const defaultRolesObj = { name: "default", roles: [...defaultRolesMap] };
        await createNewRoles(defaultRolesObj);

      } 

      // set permissions default configuration
      const defaultPermissions = await getDefaultPermissions();

      if (!defaultPermissions) {
        const defaultPermissionsObj = { name: "default", permissions: [...defaultRolePermissionsMap] };
        await createNewPermissions(defaultPermissionsObj);

      } 
      
    };
    setDefaultConfig();


  }, []);

  return (
    <BrowserRouter>
      
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} > </Route>
        <Route path="/about" element={<About />} > </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} > </Route>
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} > </Route>
        </Route>
        <Route path="/sign-in" element={currentUser ? <Home /> : <SignIn />} > </Route>
        <Route path="/sign-up" element={currentUser ? <Home /> : <SignUp />} > </Route>
        <Route path="/admin" element={currentUser && currentUser.role === 0 ? <AdminPage /> : <SignIn />} > </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

