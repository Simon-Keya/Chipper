import { useEffect, useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock authentication state

  useEffect(() => {
    // In a real app, this would check for a user session
    setIsAuthenticated(true);
  }, []);

  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ${isMenuOpen ? '' : 'hidden'}`}>
            <li><a>Home</a></li>
            <li><a>Shop</a></li>
            <li><a>Contact</a></li>
            {isAuthenticated && <li><a>Profile</a></li>}
          </ul>
        </div>
        <a className="btn btn-ghost normal-case text-xl font-bold">Chipper</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a className="btn btn-ghost">Home</a></li>
          <li><a className="btn btn-ghost">Shop</a></li>
          <li><a className="btn btn-ghost">Contact</a></li>
          {isAuthenticated && <li><a className="btn btn-ghost">Profile</a></li>}
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.706.707 1.706H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
        </a>
      </div>
    </header>
  );
};

export default Header;
