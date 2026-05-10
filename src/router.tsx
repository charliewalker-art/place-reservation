import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import { VoituresPage } from './pages/VoituresPage';
import { ClientsPage } from './pages/ClientsPage';
import ReservationsPage from './pages/ReservationsPage';
import LoginPage from './pages/LoginPage';
import { authService } from './api/authService';

const ProtectedLayout = () => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />
            <div className="container mx-auto p-4">
                <Outlet />
            </div>
        </div>
    );
};

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: <ProtectedLayout />,
        children: [
            {
                index: true,
                element: <ReservationsPage />,
            },
            {
                path: 'voitures',
                element: <VoituresPage />,
            },
            {
                path: 'clients',
                element: <ClientsPage />,
            },
            {
                path: 'reservations',
                element: <ReservationsPage />,
            },
        ],
    },
]);