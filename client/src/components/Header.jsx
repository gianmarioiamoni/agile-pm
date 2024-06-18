import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';

// Application Header
// all links are hidden by default; activate them based on the specific page
// Profile and Dashboard are shown for authenticated users only
// SignIn and SingUp are shown for unauthenticated users only

/**
 * Application Header component
 * 
 * All links are hidden by default; activate them based on the specific page
 * Profile and Dashboard are shown for authenticated users only
 * SignIn and SignUp are shown for unauthenticated users only
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isShowHome - Show Home link
 * @param {boolean} props.isShowAbout - Show About link
 * @param {boolean} props.isShowDashboard - Show Dashboard link
 * @param {boolean} props.isShowProfile - Show Profile link
 * @param {boolean} props.isShowSignIn - Show Sign In link
 * @param {boolean} props.isShowSignUp - Show Sign Up link
 * @param {boolean} props.isShowAdmin - Show Admin link
 * @param {boolean} props.isShowBack - Show Back button
 */
export default function Header({
    isShowHome = false,
    isShowAbout = false,
    isShowDashboard = false,
    isShowProfile = false,
    isShowSignIn = false,
    isShowSignUp = false,
    isShowAdmin = false,
    isShowBack = false
}) {
    // Navigation hook
    const navigate = useNavigate();

    // Get current user from Redux store
    const { currentUser } = useSelector(state => state.user);

    // Render the header
    return (
        <div className='bg-primary text-secondary'>
            {/* Header container */}
            <div className="flex justify-between items-center max-w-6xl p-3 mx-auto">
                {/* Application title */}
                <Link to="/">
                    <h1 className="font-bold">Agile Project Manager</h1>
                </Link>

                {/* Navigation links */}
                <ul className='flex gap-4 items-center'>
                    {/* Home link */}
                    {isShowHome &&
                        <Link to="/">
                            <li>Home</li>
                        </Link>
                    }
                    {/* Back button */}
                    {isShowBack &&
                        <li>
                            <Button onClick={() => navigate(-1)} color="inherit" >
                                Back
                            </Button>
                        </li>
                    }
                    {/* Admin link */}
                    {isShowAdmin &&
                        <Link to="/admin">
                            <li>Admin</li>
                        </Link>
                    }
                    {/* About link */}
                    {isShowAbout &&
                        <Link to="/about">
                            <li>About</li>
                        </Link>
                    }
                    {/* Links for authenticated users */}
                    {currentUser && isShowDashboard &&
                        <Link to="/dashboard">
                            <li>Dashboard</li>
                        </Link>
                    }
                    {currentUser && isShowProfile &&
                        <Link to="/profile">
                            <li>
                                <img src={currentUser.profilePicture} className="h-7 w-7 rounded-full object-cover" alt="Profile picture" />
                            </li>
                        </Link>
                    }
                    {/* Links for unauthenticated users */}
                    {!currentUser && isShowSignIn &&
                        <Link to="/sign-in">
                            <li>Sign In</li>
                        </Link>
                    }
                    {!currentUser && isShowSignUp &&
                        <Link to="/sign-up">
                            <li>Sign Up</li>
                        </Link>
                    }
                </ul>
            </div>
        </div>
    )
}
