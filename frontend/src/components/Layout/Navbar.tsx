import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import ShoppingCart from '../Cart/ShoppingCart';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          Sweet Shop
        </Link>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setShowCart(!showCart)}
                className="btn-cart"
                title="Shopping Cart"
              >
                🛒
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
              </button>
              <Link to="/orders" className="navbar-link">
                📋 Orders
              </Link>
              <span className="navbar-user">
                {user?.email} {user?.role === 'admin' && '(Admin)'}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
        {showCart && <ShoppingCart onClose={() => setShowCart(false)} />}
      </div>
    </nav>
  );
};

export default Navbar;

