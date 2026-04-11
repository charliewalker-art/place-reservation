import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, AlertTriangle, Car, Users, CalendarCheck, Truck } from 'lucide-react';
import { authService } from '../../api/authService';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const activeLink = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-700 font-bold'
        : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
    }`;

  const mobileActiveLink = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-600 text-white font-bold'
        : 'text-slate-600 hover:bg-slate-50'
    }`;

  return (
    <>
      <nav className="bg-white border-b border-slate-200 px-4 py-3 md:px-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Bloc Logo + Titre : Alignés horizontalement */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md shadow-blue-200/50">
              <Truck size={18} />
            </div>
            <span className="text-blue-700 font-black text-xl tracking-tight">
              Places Cooperative
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2 font-medium">
            <NavLink to="/voitures" className={activeLink}>
              <Car size={18} />
              Voitures
            </NavLink>
            <NavLink to="/clients" className={activeLink}>
              <Users size={18} />
              Clients
            </NavLink>
            <NavLink to="/reservations" className={activeLink}>
              <CalendarCheck size={18} />
              Réservations
            </NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
              title="Se déconnecter"
            >
              <LogOut size={20} />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 space-y-1 pb-4 animate-in slide-in-from-top duration-200">
            <NavLink to="/voitures" className={mobileActiveLink} onClick={() => setIsMenuOpen(false)}>
              <Car size={20} />
              Voitures
            </NavLink>
            <NavLink to="/clients" className={mobileActiveLink} onClick={() => setIsMenuOpen(false)}>
              <Users size={20} />
              Clients
            </NavLink>
            <NavLink to="/reservations" className={mobileActiveLink} onClick={() => setIsMenuOpen(false)}>
              <CalendarCheck size={20} />
              Réservations
            </NavLink>
            <hr className="my-2 border-slate-100" />
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setShowLogoutConfirm(true);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium text-left"
            >
              <LogOut size={20} />
              Se déconnecter
            </button>
          </div>
        )}
      </nav>

      {/* Modal de Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Déconnexion</h3>
            <p className="text-slate-500 mb-8">Souhaitez-vous vraiment quitter votre session actuelle ?</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Annuler</button>
              <button onClick={handleLogout} className="px-4 py-3 bg-red-600 text-white font-bold hover:bg-red-700 rounded-xl shadow-lg shadow-red-200 transition-colors">Quitter</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;