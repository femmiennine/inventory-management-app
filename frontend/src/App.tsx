import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import StockAdjustment from './pages/StockAdjustment';
import Alerts from './pages/Alerts';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import DashboardLayout from './components/layout/DashboardLayout';
import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path='/' element={<Dashboard />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/inventory' element={<Inventory />} />
            <Route path='/stock-adjustment' element={<StockAdjustment />} />
            <Route path='/alerts' element={<Alerts />} />
            <Route path='/suppliers' element={<Suppliers />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/user-management' element={<UserManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
