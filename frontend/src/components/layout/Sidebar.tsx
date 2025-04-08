import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  HomeIcon,
  ArchiveBoxIcon,
  AdjustmentsHorizontalIcon,
  BellIcon,
  TruckIcon,
  ChartBarIcon,
  UsersIcon,
  PowerIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: <HomeIcon className='w-5 h-5' />,
  },
  {
    path: '/inventory',
    label: 'Inventory',
    icon: <ArchiveBoxIcon className='w-5 h-5' />,
  },
  {
    path: '/stock-adjustment',
    label: 'Stock Adjustment',
    icon: <AdjustmentsHorizontalIcon className='w-5 h-5' />,
  },
  {
    path: '/alerts',
    label: 'Alerts',
    icon: <BellIcon className='w-5 h-5' />,
    badge: 3,
  },
  {
    path: '/suppliers',
    label: 'Suppliers',
    icon: <TruckIcon className='w-5 h-5' />,
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: <ChartBarIcon className='w-5 h-5' />,
  },
  {
    path: '/user-management',
    label: 'User Management',
    icon: <UsersIcon className='w-5 h-5' />,
  },
];

const bottomNavItems = [
  {
    label: 'Theme',
    icon: <SunIcon className='w-5 h-5' />,
    onClick: () => {
      // your theme toggle logic
    },
  },
  {
    label: 'Logout',
    icon: <PowerIcon className='w-5 h-5' />,
    onClick: () => {
      // your logout logic
    },
  },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const MobileMenu = () => (
    <button
      onClick={toggleSidebar}
      className={`md:hidden fixed top-7 right-4 z-50 p-1 rounded-md ${
        isMobileOpen
          ? 'bg-gray-800 text-white hover:bg-gray-600'
          : 'bg-white text-gray-800 hover:bg-gray-200 shadow-md'
      }`}
      aria-label='Toggle menu'
    >
      {isMobileOpen ? (
        <XMarkIcon className='w-5 h-5' />
      ) : (
        <Bars3Icon className='w-5 h-5' />
      )}
    </button>
  );

  return (
    <>
      <MobileMenu />

      <aside
        className={`
          flex flex-col justify-between
          ${isMobile ? 'fixed inset-0 z-40' : 'relative'}
          ${
            isMobile
              ? isMobileOpen
                ? 'translate-x-0'
                : '-translate-x-full'
              : ''
          }
          ${!isMobile && isCollapsed ? 'w-20' : 'w-64'}
          ${isMobile ? 'h-full w-full' : 'h-screen'}
          bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out transform
          overflow-hidden border-r border-gray-400 dark:border-gray-700 rounded-r-lg
        `}
      >
        <div
          className={`
          flex items-center justify-between
          ${isMobile ? 'p-8' : 'p-6'}
          text-xl font-bold text-gray-800 dark:text-white
        `}
        >
          {(!isCollapsed || isMobile) && <span>FoodStock</span>}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className='p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800'
              aria-label='Toggle sidebar'
            >
              {isCollapsed ? (
                <ChevronRightIcon className='w-5 h-5' />
              ) : (
                <ChevronLeftIcon className='w-5 h-5' />
              )}
            </button>
          )}
        </div>

        <nav className='flex-1 px-4 space-y-2 overflow-y-auto'>
          {navItems.map(({ path, label, icon, badge }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-md font-medium transition
                ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
                ${isMobile ? 'text-lg' : 'text-base'}
                `
              }
              onClick={() => isMobile && setIsMobileOpen(false)}
            >
              {icon}
              {(!isCollapsed || isMobile) && (
                <>
                  <span className='flex-1'>{label}</span>
                  {badge && (
                    <span className='bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full'>
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className='px-4 py-2 border-t dark:border-gray-700 space-y-2'>
          {bottomNavItems.map(({ label, icon, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className={`
        flex items-center gap-3 w-full py-3 px-3 rounded-md font-medium transition
        text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-800
        ${isMobile ? 'text-lg' : 'text-base'}
      `}
            >
              {icon}
              {(!isCollapsed || isMobile) && <span>{label}</span>}
            </button>
          ))}
        </div>
      </aside>

      {isMobile && (
        <div
          className={`
            fixed inset-0 bg-gray-900 z-30
            transition-opacity duration-300 ease-in-out
            ${isMobileOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setIsMobileOpen(false)}
          aria-hidden='true'
        />
      )}
    </>
  );
};

export default Sidebar;
