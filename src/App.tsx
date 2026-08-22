import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
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
  Sparkles,
  AlertCircle,
  UserLock,
} from "lucide-react";

import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import CasesPage from "./pages/CasesPage";
import InventoryPage from "./pages/InventoryPage";
import DonationsPage from "./pages/DonationsPage";
import AdoptionsPage from "./pages/AdoptionsPage";
import StaffPage from "./pages/StaffPage";
import ReportsPage from "./pages/ReportsPage";
import NewCasePage from "./pages/NewCasePage";
import EditCasePage from "./pages/EditCasePage";
import ABCPage from "./pages/ABCPage";
import NewClinicalEntryPage from "./pages/NewClinicalEntryPage";
import NewMedicinePage from "./pages/NewMedicinePage";
import WildlifePage from "./pages/WildlifePage";
import HousekeepingPage from "./pages/HousekeepingPage";
import AnimalDeclarationPage from "./pages/AnimalDeclarationPage";
import CensusReportPage from "./pages/CensusReportPage";
import HistoryPage from "./pages/HistoryPage";
import SearchResultsPage from "./pages/SearchResultsPage";

import { User } from "./types";
import { AppProvider, useAppContext } from "./context/AppContext";
import { NotificationProvider } from "./context/NotificationContext";
import AdminProfilesPage from "./pages/AdminProfilesPage";

interface SidebarLinkProps {
  to: string;
  icon: any;
  label: string;
  collapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon: Icon,
  label,
  collapsed,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-[#005F54] text-white shadow-md"
          : "text-gray-600 hover:bg-emerald-50 hover:text-[#005F54]"
      }`}
    >
      <Icon size={20} />
      {!collapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
};

const AppHeader: React.FC<{
  user: User;
  onLogout: () => void;
  onMenuClick: () => void;
}> = ({ user, onLogout, onMenuClick }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const { lowStockMedicines } = useAppContext();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-10">
      <button
        className="md:hidden p-2 -ml-2 text-slate-600"
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </button>
      <form
        onSubmit={handleSearch}
        className="hidden sm:flex items-center bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 w-1/3 group focus-within:ring-2 focus-within:ring-[#005F54]/20 focus-within:border-[#005F54] transition-all"
      >
        <Search
          size={16}
          className="text-slate-400 mr-2 group-focus-within:text-[#005F54]"
        />
        <input
          type="text"
          placeholder="Global search (cases, animals, wildlife)..."
          className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </form>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-2 rounded-full transition-colors ${isNotificationsOpen ? "bg-slate-100 text-[#005F54]" : "text-slate-500 hover:bg-slate-100"}`}
          >
            <Bell size={20} />
            {lowStockMedicines.length > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white ring-1 ring-rose-200">
                {lowStockMedicines.length}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsNotificationsOpen(false)}
              ></div>
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Alerts & Notifications
                  </h3>
                  {lowStockMedicines.length > 0 && (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg">
                      {lowStockMedicines.length} Urgent
                    </span>
                  )}
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {lowStockMedicines.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                      {lowStockMedicines.map((med) => (
                        <div
                          key={med.id}
                          className="p-4 hover:bg-slate-50 transition-colors flex gap-3"
                        >
                          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100 shrink-0">
                            <AlertCircle size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 leading-tight">
                              Low Stock: {med.name}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                              Current level:{" "}
                              <span className="text-rose-500 font-bold">
                                {med.quantity} {med.unit}
                              </span>{" "}
                              (Min: {med.minStockLevel})
                            </p>
                            <Link
                              to="/inventory"
                              onClick={() => setIsNotificationsOpen(false)}
                              className="inline-block mt-2 text-[10px] font-black text-[#005F54] uppercase tracking-widest hover:underline"
                            >
                              Restock Now →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-300">
                        <Sparkles size={24} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        All caught up!
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        No urgent stock alerts at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none mb-1">
              {user.fullName}
            </p>
            <p className="text-[10px] text-[#005F54] font-black uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block">
              {user.role}
            </p>
          </div>
          <button className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-[#005F54] font-bold border-2 border-white shadow-sm hover:scale-105 transition-transform">
            {(user.fullName || "U").charAt(0)}
          </button>
        </div>
      </div>
    </header>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  useEffect(() => {
    // Check local session
    const savedUser = localStorage.getItem("pfa_user_session");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("pfa_user_session");
      }
    }
    setIsAuthLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("pfa_user_session");
    setUser(null);
  };

  const allNavigation = [
    {
      to: "/",
      icon: LayoutDashboard,
      label: "Home",
      roles: ["Admin", "Doctor", "Data Entry"],
    },
    {
      to: "/cases",
      icon: BriefcaseMedical,
      label: "Rescues",
      roles: ["Admin", "Doctor"],
    },
    {
      to: "/declaration",
      icon: FileSignature,
      label: "Declaration Form",
      roles: ["Admin", "Data Entry"],
    },
    {
      to: "/inventory",
      icon: Pill,
      label: "Medicines",
      roles: ["Admin", "Doctor", "Data Entry"],
    },
    {
      to: "/housekeeping",
      icon: Sparkles,
      label: "Housekeeping",
      roles: ["Admin", "Data Entry"],
    },
    { to: "/staff", icon: Users, label: "Staff List", roles: ["Admin"] },
    {
      to: "/wildlife",
      icon: Bird,
      label: "Wildlife",
      roles: ["Admin", "Doctor", "Data Entry"],
    },
    {
      to: "/abc",
      icon: Dna,
      label: "Birth Control",
      roles: ["Admin", "Doctor", "Data Entry"],
    },
    { to: "/donations", icon: HandHeart, label: "Donations", roles: ["Admin"] },
    { to: "/adoptions", icon: PawPrint, label: "Adoptions", roles: ["Admin"] },
    {
      to: "/analytics",
      icon: BarChart3,
      label: "Reports",
      roles: ["Admin", "Doctor"],
    },
    { to: "/history-logs", icon: History, label: "History", roles: ["Admin"] },
    { to: "/admin", icon: UserLock, label: "Admin", roles: ["Admin"] },
  ];

  const navigation = allNavigation.filter((item) =>
    item.roles.includes(user?.role || ""),
  );

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
                  collapsed ? "w-20" : "w-64"
                }`}
              >
                <div className="p-4 flex items-center justify-between border-b border-gray-100 h-16">
                  {!collapsed && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#005F54] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        P
                      </div>
                      <span className="font-bold text-slate-800 text-lg tracking-tight">
                        PFA Portal
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                  >
                    {collapsed ? <Menu size={20} /> : <X size={20} />}
                  </button>
                </div>
                <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                  {navigation.map((item) => (
                    <SidebarLink
                      key={item.to}
                      to={item.to}
                      icon={item.icon}
                      label={item.label}
                      collapsed={collapsed}
                    />
                  ))}
                </nav>
                <div className="p-4 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <LogOut
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                    {!collapsed && (
                      <span className="font-medium">Sign Out</span>
                    )}
                  </button>
                </div>
              </aside>

              <main className="flex-1 flex flex-col overflow-hidden">
                <AppHeader
                  user={user}
                  onLogout={handleLogout}
                  onMenuClick={() => setIsMobileMenuOpen(true)}
                />

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                  <Routes>
                    <Route path="/" element={<DashboardPage user={user} />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/cases" element={<CasesPage user={user} />} />
                    <Route path="/wildlife" element={<WildlifePage />} />
                    <Route
                      path="/housekeeping"
                      element={<HousekeepingPage />}
                    />
                    <Route
                      path="/declaration"
                      element={<AnimalDeclarationPage />}
                    />
                    <Route path="/cases/new" element={<NewCasePage />} />
                    <Route
                      path="/cases/:caseId/edit"
                      element={<EditCasePage />}
                    />
                    <Route
                      path="/cases/:caseId/clinical/new"
                      element={<NewClinicalEntryPage />}
                    />
                    <Route
                      path="/cases/:caseId/clinical/:logId/edit"
                      element={<NewClinicalEntryPage />}
                    />
                    <Route path="/abc" element={<ABCPage />} />
                    <Route
                      path="/inventory"
                      element={<InventoryPage user={user} />}
                    />
                    <Route
                      path="/inventory/new"
                      element={<NewMedicinePage />}
                    />
                    <Route path="/donations" element={<DonationsPage />} />
                    <Route path="/adoptions" element={<AdoptionsPage />} />
                    <Route path="/staff" element={<StaffPage />} />
                    <Route
                      path="/analytics"
                      element={<ReportsPage user={user} />}
                    />
                    <Route
                      path="/reports/census"
                      element={<CensusReportPage />}
                    />
                    <Route path="/history-logs" element={<HistoryPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                    <Route
                      path="/admin"
                      element={<AdminProfilesPage userId={user.id} />}
                    />
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
