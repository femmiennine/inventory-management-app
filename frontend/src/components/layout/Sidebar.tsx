import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ArchiveBoxIcon,
  AdjustmentsHorizontalIcon,
  BellIcon,
  TruckIcon,
  ChartBarIcon,
  UsersIcon,
  PowerIcon,
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

const Sidebar = () => {
  return (
    <aside className='w-64 h-screen flex flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-700'>
      <div className='p-6 text-xl font-bold text-gray-800 dark:text-white'>
        FoodStock
      </div>

      {/* Navigation Links */}
      <nav className='flex-1 px-4 space-y-1'>
        {navItems.map(({ path, label, icon, badge }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            {icon}
            <span className='flex-1'>{label}</span>
            {badge && (
              <span className='bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full'>
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className='p-4 border-t dark:border-gray-700'>
        <button className='flex items-center gap-2 text-red-500 hover:underline font-medium text-sm'>
          <PowerIcon className='w-5 h-5' />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
