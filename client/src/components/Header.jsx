import { Link, useNavigate, useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { Button } from '@mui/material';

// Application Header
// all links are hidden by default; activate them based on the specific page
// Profile and Dashboard are shown for authenticated users only
// SignIn and SingUp are shown for unauthenticated users only

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

    const navigate = useNavigate();

    const { currentUser } = useSelector(state => {
        return state.user;
    });


    return (
        <div className='bg-primary text-secondary'>
            <div className="flex justify-between items-center max-w-6xl p-3 mx-auto">
                <Link to="/">
                    <h1 className="font-bold ">Agile Project Manager</h1>
                </Link>
                <ul className='flex gap-4'>
                    {isShowHome &&
                        <Link to="/">
                            <li>Home</li>
                        </Link>
                    }
                    {isShowBack &&
                        <Button onClick={() => navigate(-1)} color="inherit">
                            Back
                        </Button>
                    }
                    {isShowAdmin &&
                        <Link to="/admin">
                            <li>Admin</li>
                        </Link>
                    }
                    {isShowAbout &&
                        <Link to="/about">
                            <li>About</li>
                        </Link>}

                    {/* Links for authenticated users */}
                    {currentUser && isShowDashboard &&
                        <Link to="/dashboard">
                            <li>Dashboard</li>
                        </Link>
                    }
                    {currentUser && isShowProfile &&
                        <Link to="/profile">
                            <img src={currentUser.profilePicture} className="h-7 w-7 rounded-full object-cover" alt="Profile picture" />
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
