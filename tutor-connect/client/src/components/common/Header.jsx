import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

export default function Header() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <h1 className="text-xl font-bold text-indigo-600">TutorConnect</h1>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/tutors"
                className={({ isActive }) => 
                  `border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive ? 'border-indigo-500' : 'border-transparent hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                Find Tutors
              </NavLink>
              {currentUser?.role === 'tutor' && (
                <NavLink
                  to="/tutor/dashboard"
                  className={({ isActive }) => 
                    `border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive ? 'border-indigo-500' : 'border-transparent hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  Tutor Dashboard
                </NavLink>
              )}
              {currentUser?.role === 'admin' && (
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) => 
                    `border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive ? 'border-indigo-500' : 'border-transparent hover:border-gray-300 hover:text-gray-700'
                    }`
                  }
                >
                  Admin Dashboard
                </NavLink>
              )}
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    {currentUser.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu icon */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <NavLink
            to="/tutors"
            className={({ isActive }) => 
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive 
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`
            }
          >
            Find Tutors
          </NavLink>
          {currentUser?.role === 'tutor' && (
            <NavLink
              to="/tutor/dashboard"
              className={({ isActive }) => 
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`
              }
            >
              Tutor Dashboard
            </NavLink>
          )}
          {currentUser?.role === 'admin' && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => 
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`
              }
            >
              Admin Dashboard
            </NavLink>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {currentUser ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                  {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {currentUser.firstName} {currentUser.lastName}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {currentUser.email}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-1">
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Register
              </Link>
            </div>
          )}
          {currentUser && (
            <div className="mt-3 space-y-1">
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}