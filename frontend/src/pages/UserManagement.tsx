import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive';
}

const users: User[] = [
  {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Editor',
    status: 'Inactive',
  },
  {
    id: '3',
    name: 'Clara Lopez',
    email: 'clara@example.com',
    role: 'Viewer',
    status: 'Active',
  },
  {
    id: '4',
    name: 'David Chen',
    email: 'david@example.com',
    role: 'Admin',
    status: 'Active',
  },
];

const UserManagement: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [roleInput, setRoleInput] = useState<
    'All' | 'Admin' | 'Editor' | 'Viewer'
  >('All');
  const [filters, setFilters] = useState<{
    searchTerm: string;
    roleFilter: 'All' | 'Admin' | 'Editor' | 'Viewer';
  }>({
    searchTerm: '',
    roleFilter: 'All',
  });

  const handleSearch = () => {
    setFilters({
      searchTerm: searchInput,
      roleFilter: roleInput,
    });
  };

  const handleClear = () => {
    setSearchInput('');
    setRoleInput('All');
    setFilters({ searchTerm: '', roleFilter: 'All' });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesRole =
      filters.roleFilter === 'All' || user.role === filters.roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className='p-6 bg-gray-50 min-h-screen text-gray-800 dark:text-gray-100 dark:bg-gray-900'>
      <h2 className='text-2xl text-gray-800 dark:text-gray-50 font-semibold mb-4'>
        User Management
      </h2>

      {/* Search & Filter Controls */}
      <div className='flex flex-col md:flex-row md:items-center gap-4 mb-6'>
        <input
          type='text'
          placeholder='Search by name or email'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className='w-full md:w-1/3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
          bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <select
          value={roleInput}
          onChange={(e) =>
            setRoleInput(
              e.target.value as 'All' | 'Admin' | 'Editor' | 'Viewer'
            )
          }
          className='w-full md:w-1/4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md
          bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value='All'>All Roles</option>
          <option value='Admin'>Admin</option>
          <option value='Editor'>Editor</option>
          <option value='Viewer'>Viewer</option>
        </select>

        <button
          onClick={handleSearch}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
        >
          Search
        </button>

        <button
          onClick={handleClear}
          className='px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition'
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md'>
          <thead className='bg-gray-300 dark:bg-gray-700 text-left text-sm text-gray-600 dark:text-gray-200'>
            <tr>
              <th className='py-3 px-4'>Name</th>
              <th className='py-3 px-4'>Email</th>
              <th className='py-3 px-4'>Role</th>
              <th className='py-3 px-4'>Status</th>
              <th className='py-3 px-4 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className='border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition'
              >
                <td className='py-3 px-4'>{user.name}</td>
                <td className='py-3 px-4'>{user.email}</td>
                <td className='py-3 px-4'>{user.role}</td>
                <td className='py-3 px-4'>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-300 dark:text-green-900'
                        : 'bg-red-100 text-red-800 dark:bg-red-300 dark:text-red-900'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className='py-3 px-4 flex justify-end gap-2'>
                  <button className='text-blue-600 hover:underline dark:text-blue-400'>
                    Edit
                  </button>
                  <button className='text-red-600 hover:underline dark:text-red-400'>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className='py-4 px-4 text-center text-gray-500 dark:text-gray-400'
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
