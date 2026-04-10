import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeLink = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'px-1 text-blue-600 border-b-2 border-blue-600 pb-1 font-bold'
      : 'px-1 text-slate-500 hover:text-blue-600 transition-colors';

  const mobileActiveLink = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'block px-4 py-2 text-blue-600 bg-blue-50 font-bold'
      : 'block px-4 py-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-colors';

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-4 md:px-8">
      <div className="flex items-center justify-between">
        <span className="text-blue-700 font-extrabold text-xl tracking-tight">Places Cooperative</span>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <NavLink to="/dashboard" className={activeLink}>
            Dashboard
          </NavLink>
          <NavLink to="/voitures" className={activeLink}>
            Voitures
          </NavLink>
          <NavLink to="/clients" className={activeLink}>
            Clients
          </NavLink>
          <NavLink to="/reservations" className={activeLink}>
            Réservations
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-slate-500 hover:text-slate-700 transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 border-t border-slate-200 pt-4">
          <div className="flex flex-col space-y-2">
            <NavLink to="/dashboard" className={mobileActiveLink} onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/voitures" className={mobileActiveLink} onClick={() => setIsMenuOpen(false)}>
              Voitures
            </NavLink>
            <NavLink to="/clients" className={mobileActiveLink} onClick={() => setIsMenuOpen(false)}>
              Clients
            </NavLink>
            <NavLink to="/reservations" className={mobileActiveLink} onClick={() => setIsMenuOpen(false)}>
              Réservations
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;