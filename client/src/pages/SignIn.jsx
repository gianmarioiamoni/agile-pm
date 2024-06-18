import { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux'; // to dispatch action reducer functions
// redux action creators
import { resetState, signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice.js";

import OAuth from "../components/OAuth.jsx";
import Header from "../components/Header.jsx";
import { getCurrentRoles } from '../services/roleServices.js';

const loginImage = "/backgrounds/login-01.jpg"


/**
 * SignIn component
 * 
 * This component handles the sign in functionality of the application.
 * It uses React hooks such as useState, useEffect, and useDispatch to manage state and side effects.
 * It also uses Redux for state management by dispatching actions and using the useSelector hook to retrieve state from the Redux store.
 * 
 * @returns {JSX.Element} The SignIn component
 */
export default function SignIn() {
    // State hook to manage form data
    const [formData, setFormData] = useState({});

    // State hook to manage loading and error states
    const { isLoading, isError } = useSelector((state) => state.user); // Slice name is "user" in userSlice.js

    // Navigation hook
    const navigate = useNavigate();

    // Dispatch hook to dispatch Redux actions
    const dispatch = useDispatch();

    // Effect hook to reset Redux state on component mount
    useEffect(() => {
        dispatch(resetState());
    }, []);

    /**
     * Handles input change event
     * 
     * @param {Object} e - The event object
     */
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }

    /**
     * Handles form submission
     * 
     * @param {Object} e - The event object
     */
    const handleSubmit = async (e) => {
        // It prevents refreshing the page when we submit the form
        e.preventDefault();

        try {
            // initialize redux state - setLoading(true)
            dispatch(signInStart());

            // as we added a proxy in vite.config.js, we dont need to specify http://localhost:3000
            const res = await fetch("/server/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!data.success) {
                // error message is inside data
                // instead of setIsError(true)
                dispatch(signInFailure(data));
                return;
            }

            // Retrieve roles from the server
            const roles = await getCurrentRoles();
            // Find the role object that matches the role id in the response data
            const role = roles.find((r) => r._id === data.role)
            // Create a new object that includes the role object from the response data
            const dataFilledWithRole = {...data, role}
            
            // instead of setIsLoading(false) we change the state of redux
            dispatch(signInSuccess(dataFilledWithRole));
            // user is authenticated; navigate to /
            navigate("/");

        } catch (err) {
            dispatch(signInFailure(err));
        }
    };

    return (
        <>
            {/* Header */}
            <Header isShowHome={true} isShowSignUp={true} />
            <div p-3="+true" className='text-black max-w-lg mx-auto'>
                <div className="flex flex-col" style={{ marginBottom: "2rem" }}>
                    <h1 className="text-3xl text-title text-center font-semibold my-7">Sign In</h1>
                    <img className="self-center" src={loginImage} alt="Register Image" style={{ maxWidth: '70%', height: 'auto' }} />
                </div>
                <form onSubmit={handleSubmit} className='flex flex-col justify-center gap-4'>
                    <input
                        type='email'
                        placeholder='Email'
                        id='email'
                        style={{ padding: "3" }}
                        className='bg-input-bg border-border border-2 p-3 rounded-lg'
                        onChange={handleChange}
                    ></input>
                    <input
                        type='password'
                        placeholder='Password'
                        id='password'
                        style={{ padding: "3" }}
                        className='bg-input-bg border-border border-2 p-3 rounded-lg'
                        onChange={handleChange}
                    ></input>
                    <button
                        disabled={isLoading}
                        className='bg-primary text-secondary p-3 rounded-lg uppercase hover:opacity-75 disabled:opacity-50'
                    >
                        {isLoading ? "Loading..." : "Sign In"}
                    </button>
                    <OAuth />
                </form>
                <div className="flex gap-2 mt-5">
                    <p>Do not have an account? </p>
                    <Link to="/sign-up">
                        <span className='text-blue-500'>Sign up</span>
                    </Link>
                </div>
                <p className="text-red-700 mt-5">{isError && (isError.message || "Something went wrong")}</p>
            </div>
        </>
    )
}
