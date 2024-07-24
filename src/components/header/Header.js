import React, { useState } from 'react';
import { FaBook, FaUserPlus, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import LoginForm from '../../LoginForm';
import RegisterForm from '../../RegisterForm';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import "./Header.css"
const Header = ({ user, setUser }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginOpen = () => setShowLogin(true);
  const handleLoginClose = () => setShowLogin(false);
  const handleSignupOpen = () => setShowSignup(true);
  const handleSignupClose = () => setShowSignup(false);


  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to log out?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
      customClass: {
        container: 'custom-swal', 
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        Swal.fire(
          'Logged out!',
          'You have been logged out.',
          'success'
        ).then(() => {
          window.location.reload();
        });
      }
    });
  };
  return (
    <nav className="navbar navbar-expand-lg px-2 bg-primary fixed-top">
      <FaBook size={30} color="#fff" />
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="ml-auto d-flex">
          {user ? (
            <>
              <span className="navbar-text mr-3">{`${user.firstName}`}</span>
              <button
                className="btn btn-outline-warning m-1 text-light"
                onClick={handleLogout}
              >
                <FaSignOutAlt/> Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-outline-info text-light m-1"
                onClick={handleLoginOpen}
              >
                  <FaSignInAlt /> Login
              </button>
              <button
                className="btn btn-outline-info m-1 text-light"
                onClick={handleSignupOpen}
              >
                  <FaUserPlus /> Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {showLogin && (
        <div className="modal fade show d-block" role="dialog" data-backdrop="true" onClick={handleLoginClose}>
          <div className="modal-dialog  modal-sm" role="document" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><FaSignInAlt /> Login</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleLoginClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body ">
                <LoginForm
                  onLoginSuccess={() => {
                    handleLoginClose();
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                      setUser(JSON.parse(storedUser));
                    }
                  }}
                  onOpenRegisterModal={handleSignupOpen}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showSignup && (
        <div className="modal fade show d-block" role="dialog" data-backdrop="true" onClick={handleSignupClose}>
          <div className="modal-dialog modal-sm" role="document" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><FaUserPlus/> Sign Up</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleSignupClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <RegisterForm onRegisterSuccess={() => {
                  handleSignupClose();
                  handleLoginOpen();
                }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
