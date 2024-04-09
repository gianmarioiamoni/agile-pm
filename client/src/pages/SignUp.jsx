import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { MenuItem, Select } from '@mui/material';

import { resetState, signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js";

import OAuth from "../components/OAuth";

import Header from "../components/Header.jsx";

import { RolesContext } from '../utils/RolesProvider.jsx';

const registerImage = "/backgrounds/signup-1.jpg"
// const roles = ["Product Owner", "Scrum Master", "Team Scrum Member"];


export default function SignUp() {
  const [formData, setFormData] = useState({ role: "" }); // Aggiungi il campo del ruolo nell'oggetto formData
  const { isLoading, isError } = useSelector((state) => state.user);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roles = useContext(RolesContext); 
  
  useEffect(() => {
    dispatch(resetState());
  }, []);
  
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/server/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err));
    }
  }
  
  
  return (
    <>
      <Header isShowHome={true} isShowSignIn={true} />
      <div p-3="+true" className='text-black max-w-lg mx-auto'>
        <div className="flex flex-col">
          <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
          <img className="self-center" src={registerImage} alt="Register Image" style={{ maxWidth: '70%', height: 'auto' }} />
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='text'
            placeholder='Username'
            id='username'
            style={{ padding: "3" }}
            className='bg-slate-100 border-slate-300 border-2 p-3 rounded-lg'
            onChange={handleChange}
          ></input>
          <input
            type='email'
            placeholder='Email'
            id='email'
            style={{ padding: "3" }}
            className='bg-slate-100 border-slate-300 border-2 p-3 rounded-lg'
            onChange={handleChange}
          ></input>
          <input
            type='password'
            placeholder='Password'
            id='password'
            style={{ padding: "3" }}
            className='bg-slate-100 border-slate-300 border-2 p-3 rounded-lg'
            onChange={handleChange}
          ></input>
          {/* Role selection */}
          <select id="role" value={formData.role} onChange={handleChange} className='bg-slate-100 border-slate-300 border-2 p-3 rounded-lg'>
            <option value="" disabled>Select Role</option>
            {roles.map((role, index) => (
              <option key={index} value={role.id}>{role.description}</option>
            ))}
          </select>
          <button
            disabled={isLoading}
            className='bg-slate-600 text-slate-300 p-3 rounded-lg uppercase hover:opacity-75 disabled:opacity-50'
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-5">
          <p>Have an account? </p>
          <Link to="/sign-in">
            <span className='text-blue-500'>Sign In</span>
          </Link>
        </div>
        <p className="text-red-700 mt-5">{isError && (isError.message || "Something went wrong")}</p>
      </div>
    </>
  )
}
