import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';

import { FaGoogle } from 'react-icons/fa';

import { app } from "../firebase";

import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

import { useNavigate } from 'react-router-dom';

/**
 * Component for OAuth sign in with Google.
 * @param {Object} props - Component props.
 * @param {number} props.role - Role of the user signing in. Defaults to 3.
 * @returns {JSX.Element} - The rendered component.
 */
export default function OAuth({role = 3}) {
    // Redux dispatch function
    const dispatch = useDispatch();

    // React Router navigate function
    const navigate = useNavigate();

    /**
     * Handles the click event for the Google sign in button.
     * Sends a POST request to the server with user information,
     * then dispatches the user data to Redux.
     * Navigates to the home page.
     * @returns {Promise<void>}
     */
    const handleGoogleClick = async () => {
        try {
            // Create Google auth provider and get auth instance from app
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            // Sign in with Google popup
            const result = await signInWithPopup(auth, provider);

            // Send user data to server
            const res = await fetch("/server/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                    role
                })
            });

            // Get user data from server response
            const data = await res.json();

            // Dispatch user data to Redux
            dispatch(signInSuccess(data));

            // Navigate to home page
            navigate("/");

        } catch (error) {
            console.log("Could not login in with Google", error)
        }
    };

    return (
        // Render Google sign in button
        <button
            type="button"
            onClick={handleGoogleClick}
            className='bg-red-700 text-white rounded-lg p-3 hover:opacity-75 flex items-center justify-center'>
            <FaGoogle
                style={{
                    color: "white",
                    marginRight: "8px", // right margin to separate icon from text 
                }}
            />
            <span>Continue with Google</span>
        </button>
    )
}
