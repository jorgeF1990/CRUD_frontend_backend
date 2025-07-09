import { useState, useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Layout.css";

const Layout = () => {
  const { user, setUser, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]); // Estado para los productos en el carrito

  // Ejemplo de productos (en una app real vendrían de tu API o estado global)
  const sampleProducts = [
    { id: 1, name: "Camiseta", price: 19.99, quantity: 1 },
    { id: 2, name: "Pantalón", price: 39.99, quantity: 2 },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
    if (cartOpen) setCartOpen(false);
  };

  const toggleCart = () => {
    setCartOpen(prev => !prev);
    if (menuOpen) setMenuOpen(false);
    
    // En una app real, aquí cargarías los productos del carrito
    setCartItems(sampleProducts);
  };

  // Calcular cantidad total de productos en el carrito
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calcular total del carrito
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    navigate("/checkout");
    setCartOpen(false);
  };

  return (
    <div className="layout-container">
      <header>
        <nav>
          <div className="nav-left">
            <Link to="/" onClick={() => setMenuOpen(false)} className="logo-link">
              <img src="/logo1.png" alt="Logo" className="logo" />
              <span className="home-text"></span>
            </Link>
          </div>

          <div className="nav-right">
            <div className="cart-container" onClick={toggleCart}>
              <div className="cart-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
              </div>
              
              {cartOpen && (
                <div className="cart-dropdown">
                  <h4>Tu Carrito ({cartItemCount})</h4>
                  
                  {cartItems.length === 0 ? (
                    <p className="empty-cart">Tu carrito está vacío</p>
                  ) : (
                    <>
                      <div className="cart-items">
                        {cartItems.map(item => (
                          <div key={item.id} className="cart-item">
                            <div className="item-info">
                              <span className="item-name">{item.name}</span>
                              <div className="item-details">
                                <span>{item.quantity} x ${item.price.toFixed(2)}</span>
                                <span>${(item.quantity * item.price).toFixed(2)}</span>
                              </div>
                            </div>
                            <button 
                              className="remove-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveItem(item.id);
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="cart-total">
                        <span>Total:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="cart-actions">
                        <button 
                          className="view-cart-btn"
                          onClick={() => {
                            navigate("/cart");
                            setCartOpen(false);
                          }}
                        >
                          Ver Carrito
                        </button>
                        <button 
                          className="checkout-btn"
                          onClick={handleCheckout}
                        >
                          Comprar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              className={`hamburger ${menuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li><Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link></li>

            {user ? (
              <>
                <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
                <li><button onClick={handleLogout}>Cerrar sesión</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
                <li><Link to="/register" onClick={() => setMenuOpen(false)}>Registro</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main>
        {loading ? <p>Cargando usuario...</p> : <Outlet />}
      </main>

      <footer>
        <p>© 2025 Tu Empresa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Layout;