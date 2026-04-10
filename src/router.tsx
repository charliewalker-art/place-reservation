import { createBrowserRouter, Outlet } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { VoituresPage } from './pages/VoituresPage';
import { ClientsPage } from './pages/ClientsPage';
import ReservationsPage from './pages/ReservationsPage';

const RootLayout = () => (
  <div className="min-h-screen bg-slate-50 font-sans">
    <Navbar />
    <Outlet />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
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
