import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminPage from './pages/AdminPage';
import NotFoundPage from "./pages/NotFoundPage";
import TeamAssignmentsPage from './pages/TeamAssignmentsPage';

import PrivateRoute from "./components/PrivateRoute";

import { getAllProjects } from "./services/projectServices";
import { getCurrentUsers } from "./services/userServices";
import { getCurrentRoles } from "./services/roleServices";

import { canAllocateProject } from './services/rolesMapServices';


export default function App() {
  const { currentUser } = useSelector((state) => state.user);

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentRolesMap, setCurrentRolesMap] = useState([]);

  const [canAllocateProjectsTeam, setCanAllocateProjectsTeam] = useState(true);

  useEffect(() => {
    

    // get current users from the DB
    const setCurrentUsers = async () => {
      const u = await getCurrentUsers();
      console.log("u: ", u)
      setUsers(u);
    };
    setCurrentUsers();

    // get current rolesMap from the DB
    const setCurrentRoles = async () => {
      const r = await getCurrentRoles();
      console.log("r: ", r)
      setCurrentRolesMap(r);
    };
    setCurrentRoles();

    

  }, []);

  useEffect(() => {
    const checkPermissions = async () => {
      setCanAllocateProjectsTeam(await canAllocateProject(currentUser))
    };
    if (currentUser != null) {
      checkPermissions();
    }
    
    const getProjects = async () => {
      const projectsListFromDB = await getAllProjects();
      const projectsList = projectsListFromDB.map((p) => ({ ...p, id: p._id }));

      setProjects(projectsList);
    }
    if (currentUser != null) {
      getProjects();
    }
    
  }, [currentUser])
  

  return (
    <BrowserRouter>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} > </Route>
        <Route path="/about" element={<About />} > </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile currentRolesMap={currentRolesMap} />} > </Route>
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard projects={projects} setProjects={setProjects} />} > </Route>
        </Route>
        <Route path="/sign-in" element={currentUser ? <Home /> : <SignIn />} > </Route>
        <Route path="/sign-up" element={currentUser ? <Home /> : <SignUp />} > </Route>
        <Route path="/admin" element={currentUser && currentUser.role.roleKey == 0 ? <AdminPage users={users} setUsers={setUsers} currentRolesMap={currentRolesMap} setCurrentRolesMap={setCurrentRolesMap} /> : <SignIn />} > </Route>
        {/* <Route path="/team-assignments/:projectId" element={canAllocateProjectsTeam && <TeamAssignmentsPage projects={projects} users={users} currentRolesMap={currentRolesMap} />} /> */}
        <Route path="/team-assignments/:projectId" element={<TeamAssignmentsPage projects={projects} users={users} currentRolesMap={currentRolesMap} />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

