import { Link, Outlet } from 'react-router';
import { useTheme } from '../store/ThemeContext';
import { MdDashboard, MdAddCircle, MdPieChart, MdDarkMode, MdLightMode } from 'react-icons/md';

const Layout = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div 
      className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200"
    >
      <nav className="bg-blue-600 dark:bg-blue-800 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            Budget Tracker
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-blue-200 flex items-center gap-1">
              <MdDashboard /> <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link to="/add" className="hover:text-blue-200 flex items-center gap-1">
              <MdAddCircle /> <span className="hidden sm:inline">Add</span>
            </Link>
            <Link to="/summary" className="hover:text-blue-200 flex items-center gap-1">
              <MdPieChart /> <span className="hidden sm:inline">Summary</span>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
            </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
