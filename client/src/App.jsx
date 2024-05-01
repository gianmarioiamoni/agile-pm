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


export default function App() {
  const { currentUser } = useSelector((state) => state.user);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      const projectsListFromDB = await getAllProjects();
      const projectsList = projectsListFromDB.map((p) => ({ ...p, id: p._id }));

      setProjects(projectsList);
    }
    getProjects();
  } , []);

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
          <Route path="/dashboard" element={<Dashboard projects={projects} setProjects={setProjects} />} > </Route>
        </Route>
        <Route path="/sign-in" element={currentUser ? <Home /> : <SignIn />} > </Route>
        <Route path="/sign-up" element={currentUser ? <Home /> : <SignUp />} > </Route>
        <Route path="/admin" element={currentUser && currentUser.role === 0 ? <AdminPage /> : <SignIn />} > </Route>
        <Route path="/team-assignments/:projectId" element={<TeamAssignmentsPage projects={projects} />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

