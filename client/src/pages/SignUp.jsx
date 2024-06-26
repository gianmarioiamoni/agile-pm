import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { resetState, signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js";

import OAuth from "../components/OAuth";

import Header from "../components/Header.jsx";

import { getCurrentRoles } from '../services/roleServices.js';

const registerImage = "/backgrounds/signup-01.jpg"


export default function SignUp() {
  const [formData, setFormData] = useState({ role: "" }); // add role field to formData
  const { isLoading, isError } = useSelector((state) => state.user);

  const [selectedRole, setSelectedRole] = useState(3);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    dispatch(resetState());

    const getRoles = async () => {
      const r = await getCurrentRoles()
      setRoles(r);
    };
    getRoles();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

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
  };


  return (
    <>
      <Header isShowHome={true} isShowSignIn={true} />
      <div p-3="+true" className='text-text max-w-xl mx-auto'>
        <div className="flex flex-col">
          <h1 className="text-3xl text-title text-center font-semibold my-7">Sign Up</h1>
          <img className="self-center" src={registerImage} alt="Register Image" style={{ maxWidth: '60%', height: 'auto' }} />
        </div>
        {/* Role selection */}
        <h3 className='text-title font-bold mt-3'>Role</h3>
        <select
          id="role"
          value={formData.role}
          onChange={handleChange}
          className='bg-input-bg border-border border-2 p-2 rounded-lg'>
          <option value="" disabled>Select Role</option>
          {roles.map((role, index) => (
            <option key={index} value={role._id}>{role.roleDescription}</option>
          ))}
        </select>
        {/* Sign up section  */}
        <div className='flex justify-between'>
          {/* Sing up with usernme and password */}
          <div>
            <h3 className='text-title font-bold mt-5'>Sign Up with Username and Password</h3>
            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
              <input
                type='text'
                placeholder='Username'
                id='username'
                style={{ padding: "2" }}
                className='bg-input-bg border-border border-2 p-2 rounded-lg'
                onChange={handleChange}
              ></input>
              <input
                type='email'
                placeholder='Email'
                id='email'
                style={{ padding: "2" }}
                className='bg-input-bg border-border border-2 p-2 rounded-lg'
                onChange={handleChange}
              ></input>
              <input
                type='password'
                placeholder='Password'
                id='password'
                style={{ padding: "2" }}
                className='bg-input-bg border-border border-2 p-2 rounded-lg'
                onChange={handleChange}
              ></input>
              <button
                disabled={isLoading}
                className='bg-primary text-secondary p-2 rounded-lg uppercase hover:opacity-75 disabled:opacity-50'
              >
                {isLoading ? "Loading..." : "Sign Up"}
              </button>

            </form>
          </div>
          {/* Sing up with Google */}
          <div>
            <h3 className='text-title font-semibold mt-5'>Sign Up with Socials</h3>
            <OAuth role={formData.role} />
          </div>
        </div>
        {/* Link to Sign In */}
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
