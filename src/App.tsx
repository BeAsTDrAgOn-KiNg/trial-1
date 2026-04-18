
import React, { useState, useEffect } from 'react';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  Navigate 
} from 'react-router-dom';
import { 
  LayoutDashboard, 
  BriefcaseMedical, 
  Pill, 
  HandHeart, 
  PawPrint, 
  Users, 
  BarChart3, 
  LogOut, 
  Bell, 
  Search, 
  Menu, 
  X,
  FileSignature,
  History,
  Bird,
  Dna,
  Sparkles
} from 'lucide-react';

import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import InventoryPage from './pages/InventoryPage';
import DonationsPage from './pages/DonationsPage';
import AdoptionsPage from './pages/AdoptionsPage';
import StaffPage from './pages/StaffPage';
import ReportsPage from './pages/ReportsPage';
import NewCasePage from './pages/NewCasePage';
import EditCasePage from './pages/EditCasePage';
import ABCPage from './pages/ABCPage';
import NewClinicalEntryPage from './pages/NewClinicalEntryPage';
import NewMedicinePage from './pages/NewMedicinePage';
import WildlifePage from './pages/WildlifePage';
import HousekeepingPage from './pages/HousekeepingPage';
import AnimalDeclarationPage from './pages/AnimalDeclarationPage';
import CensusReportPage from './pages/CensusReportPage';
import HistoryPage from './pages/HistoryPage';

import { User } from './types';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';

interface SidebarLinkProps {
  to: string;
  icon: any;
  label: string;
  collapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-[#005F54] text-white shadow-md' 
          : 'text-gray-600 hover:bg-emerald-50 hover:text-[#005F54]'
      }`}
    >
      <Icon size={20} />
      {!collapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Check local session
    const savedUser = localStorage.getItem('pfa_user_session');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('pfa_user_session');
      }
    }
    setIsAuthLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('pfa_user_session');
    setUser(null);
  };

  const allNavigation = [
    { to: '/', icon: LayoutDashboard, label: 'Home', roles: ['Admin', 'Doctor', 'Data Entry'] },
    { to: '/cases', icon: BriefcaseMedical, label: 'Rescues', roles: ['Admin', 'Doctor'] },
    { to: '/declaration', icon: FileSignature, label: 'Declaration Form', roles: ['Admin', 'Data Entry'] },
    { to: '/inventory', icon: Pill, label: 'Medicines', roles: ['Admin', 'Doctor', 'Data Entry'] },
    { to: '/housekeeping', icon: Sparkles, label: 'Housekeeping', roles: ['Admin', 'Data Entry'] },
    { to: '/staff', icon: Users, label: 'Staff List', roles: ['Admin'] },
    { to: '/wildlife', icon: Bird, label: 'Wildlife', roles: ['Admin', 'Doctor', 'Data Entry'] },
    { to: '/abc', icon: Dna, label: 'Birth Control', roles: ['Admin', 'Doctor', 'Data Entry'] },
    { to: '/donations', icon: HandHeart, label: 'Donations', roles: ['Admin'] },
    { to: '/adoptions', icon: PawPrint, label: 'Adoptions', roles: ['Admin'] },
    { to: '/analytics', icon: BarChart3, label: 'Reports', roles: ['Admin', 'Doctor'] },
    { to: '/history-logs', icon: History, label: 'History', roles: ['Admin'] },
  ];

  const navigation = allNavigation.filter(item => item.roles.includes(user?.role || ''));

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005F54]"></div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <AppProvider>
        <Router>
          {!user ? (
            <Routes>
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="*" element={<LoginPage onLogin={setUser} />} />
            </Routes>
          ) : (
            <div className="flex h-screen overflow-hidden bg-[#F1F5F9]">
              <aside 
                className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-20 ${
                  collapsed ? 'w-20' : 'w-64'
                }`}
              >
                <div className="p-4 flex items-center justify-between border-b border-gray-100 h-16">
                  {!collapsed && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#005F54] rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
                      <span className="font-bold text-slate-800 text-lg tracking-tight">PFA Portal</span>
                    </div>
                  )}
                  <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                    {collapsed ? <Menu size={20} /> : <X size={20} />}
                  </button>
                </div>
                <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                  {navigation.map((item) => (
                    <SidebarLink key={item.to} to={item.to} icon={item.icon} label={item.label} collapsed={collapsed} />
                  ))}
                </nav>
                <div className="p-4 border-t border-gray-100">
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors group">
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    {!collapsed && <span className="font-medium">Sign Out</span>}
                  </button>
                </div>
              </aside>

              <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-10">
                  <button className="md:hidden p-2 -ml-2 text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu size={24} />
                  </button>
                  <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 w-1/3">
                    <Search size={16} className="text-slate-400 mr-2" />
                    <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400" />
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                    <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                      <Bell size={20} />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 leading-none mb-1">{user.fullName}</p>
                        <p className="text-[10px] text-[#005F54] font-black uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block">{user.role}</p>
                      </div>
                      <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-[#005F54] font-bold border-2 border-white shadow-sm">{(user.fullName || 'U').charAt(0)}</div>
                    </div>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                  <Routes>
                    <Route path="/" element={<DashboardPage user={user} />} />
                    <Route path="/cases" element={<CasesPage user={user} />} />
                    <Route path="/wildlife" element={<WildlifePage />} />
                    <Route path="/housekeeping" element={<HousekeepingPage />} />
                    <Route path="/declaration" element={<AnimalDeclarationPage />} />
                    <Route path="/cases/new" element={<NewCasePage />} />
                    <Route path="/cases/:caseId/edit" element={<EditCasePage />} />
                    <Route path="/cases/:caseId/clinical/new" element={<NewClinicalEntryPage />} />
                    <Route path="/abc" element={<ABCPage />} />
                    <Route path="/inventory" element={<InventoryPage user={user} />} />
                    <Route path="/inventory/new" element={<NewMedicinePage />} />
                    <Route path="/donations" element={<DonationsPage />} />
                    <Route path="/adoptions" element={<AdoptionsPage />} />
                    <Route path="/staff" element={<StaffPage />} />
                    <Route path="/analytics" element={<ReportsPage user={user} />} />
                    <Route path="/reports/census" element={<CensusReportPage />} />
                    <Route path="/history-logs" element={<HistoryPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </main>
            </div>
          )}
        </Router>
      </AppProvider>
    </NotificationProvider>
  );
};

export default App;
