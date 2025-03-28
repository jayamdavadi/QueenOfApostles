import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Calendar, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">Retreat Center</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {
              !isAdmin && (
                <>
                  <Link to="/programs" className="text-gray-600 hover:text-gray-900">Programs</Link>
                  <Link to="/facilities" className="text-gray-600 hover:text-gray-900">Facilities</Link>
                  <Link to="/about" className="text-gray-600 hover:text-gray-900">
                    About Us
                  </Link>
                </>
              )
            }

            {user ? (
              <>
                {
                  isAdmin ? (
                    <>
                      <Link to="/admin/programs" className="text-gray-600 hover:text-gray-900">Programs</Link>
                      <Link to="/admin/bookings" className="text-gray-600 hover:text-gray-900 flex items-center">
                        <Calendar className="inline-block w-4 h-4 mr-1" />
                        Program Bookings
                      </Link>
                      <Link to="/admin/room-bookings" className="text-gray-600 hover:text-gray-900 flex items-center">
                        <Home className="inline-block w-4 h-4 mr-1" />
                        Room Bookings
                      </Link>
                      <Link to="/admin/facility" className="text-gray-600 hover:text-gray-900">Facilities</Link>
                      <Link to="/admin/contacts" className="text-gray-600 hover:text-gray-900">Contact Reports</Link>
                    </>
                  ) :
                    <Link to="/my-bookings" className="text-gray-600 hover:text-gray-900">My Bookings</Link>
                }
                <Link to="/donate" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Donate
                </Link>
              </>
            ) :
              <>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
                <Link to="/donate" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Donate
                </Link>
              </>
            }

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-bold">
                  <User className="inline-block w-4 h-4 mr-1" />
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                <Link to="/signup" className="text-gray-600 hover:text-gray-900">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAdmin ? (
              <>
                <Link
                  to="/admin/programs"
                  className="flex px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 items-center"
                >
                  Programs
                </Link>
                <Link
                  to="/admin/bookings"
                  className="flex px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 items-center"
                >
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  Program Bookings
                </Link>
                <Link
                  to="/admin/room-bookings"
                  className="flex px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 items-center"
                >
                  <Home className="inline-block w-4 h-4 mr-1" />
                  Room Bookings
                </Link>
                <Link
                  to="/admin/facility"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Facilities
                </Link>
                <Link
                  to="/admin/contacts"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Contact Reports
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/programs"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Programs
                </Link>
                <Link
                  to="/facilities"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Facilities
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 items-center"
                >
                  About Us
                </Link>
                {user && (
                  <Link
                    to="/my-bookings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    My Bookings
                  </Link>
                )}
                <Link
                  to="/contact"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Contact
                </Link>
              </>
            )}
            <Link
              to="/donate"
              className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Donate
            </Link>

            {user ? (
              <>
                <div className="px-3 py-2 text-base font-medium text-gray-700">
                  <User className="inline-block w-4 h-4 mr-1" />
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <LogOut className="inline-block w-4 h-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};