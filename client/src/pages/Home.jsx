import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from "../components/Header";

const backgroundImage = "/backgrounds/background-02.jpg"

export default function Home() {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);

  return (
    <>
      {/* Header */}
      <Header
        isShowAbout={true}
        isShowProfile={true}
        isShowDashboard={true}
        isShowSignIn={true}
        isShowSignUp={true}
        isShowAdmin={currentUser && currentUser.role.roleKey == 0}
      />
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="max-w-md text-right  bg-white bg-opacity-75 p-8 rounded-lg">
          <h1 className='text-3xl font-bold mb-4 text-slate-800'>Welcome to Agile Project Manager</h1>
          <p className='mb-4 text-3xl text-slate-700'>
            Empower Your Team,
          </p>
          <p className='mb-4 text-3xl text-slate-700'>
            Accelerate Your Success.
          </p>
          {/* Link to Sign In or to Dashboard */}
          {currentUser ? (
            <button
              className='bg-primary text-secondary py-2 px-4 rounded-lg uppercase hover:opacity-75 disabled:opacity-50 mt-4'
              type='button'
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                className='bg-primary text-secondary py-2 px-4 rounded-lg uppercase hover:opacity-75 disabled:opacity-50 mt-4'
                type='button'
                onClick={() => navigate("/sign-in")}
              >
                Sign In
              </button>
              <div className="flex justify-end gap-2 mt-5">
                <p>Do not have an account? </p>
                <Link to="/sign-up">
                  <span className='text-blue-500'>Sign up</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

