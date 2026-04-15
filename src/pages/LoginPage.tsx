
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Role } from '../types';
import { ShieldCheck, UserCircle, HeartHandshake, Eye, EyeOff, ShieldAlert, Mail, User as UserIcon, AlertCircle, ChevronDown, CheckCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or Employee ID
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Doctor');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  const roles: Role[] = ['Admin', 'Doctor', 'Data Entry'];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    const username = name.substring(0, 4).toLowerCase() + phone.slice(-4);
    
    // Save to local registry for demo persistence
    const registry = JSON.parse(localStorage.getItem('pfa_user_registry') || '{}');
    registry[username] = { name, role, email: identifier };
    localStorage.setItem('pfa_user_registry', JSON.stringify(registry));

    setGeneratedId(username);
    setError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check registry first
    const registry = JSON.parse(localStorage.getItem('pfa_user_registry') || '{}');
    const registeredUser = registry[identifier];

    let detectedRole: Role = 'Data Entry';
    let displayName = 'User';

    if (registeredUser) {
      detectedRole = registeredUser.role;
      displayName = registeredUser.name;
    } else {
      // Fallback to string inference for default demo accounts
      const idLower = identifier.toLowerCase();
      if (idLower.includes('admin')) {
        detectedRole = 'Admin';
        displayName = 'Admin User';
      } else if (idLower.includes('doctor') || idLower.includes('employee')) {
        detectedRole = 'Doctor';
        displayName = 'Doctor User';
      } else if (idLower.includes('data entry') || idLower.includes('entry')) {
        detectedRole = 'Data Entry';
        displayName = 'Data Entry User';
      }
    }

    // Mock Login Logic
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: displayName,
      email: identifier.includes('@') ? identifier : `${identifier}@pfa.org`,
      phone: isRegistering ? phone : undefined,
      role: detectedRole,
    };
    onLogin(mockUser);
  };

  const leftSideImageUrl = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=2043";

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#EBFDFA]">
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: `url(${leftSideImageUrl})` }}
        >
          <div className="absolute inset-0 bg-[#1A3F33]/40 backdrop-blur-[0.5px]"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 lg:px-28 text-white">
          <h1 className="text-6xl font-black mb-6 leading-tight tracking-tight">
            People For Animals <br /> Mysuru
          </h1>
          <p className="text-xl font-medium max-w-lg opacity-90 leading-relaxed">
            Join us in making a difference in the lives of animals. Together, we rescue, rehabilitate, and rehome.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-lg space-y-10">
          <div className="text-left mb-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 font-medium text-lg mt-2">
              {isRegistering ? 'Sign up to join the PFA Mysuru team' : 'Login with your Email'}
            </p>
          </div>

          <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl shadow-emerald-900/5 border border-white/50">
            {generatedId ? (
              <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100">
                  <CheckCircle size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Account Created!</h3>
                  <p className="text-sm text-slate-500 font-medium mb-6">Use your email to login securely.</p>
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-4 rounded-2xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Username</p>
                    <p className="text-2xl font-black text-[#005F54] tracking-wider font-mono">{generatedId}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setIsRegistering(false); setGeneratedId(null); setIdentifier(generatedId); }}
                  className="w-full bg-[#005F54] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-[#004a42] transition-all"
                >
                  Proceed to Login
                </button>
              </div>
            ) : (
              <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} className="shrink-0" />
                    <p className="text-xs font-black uppercase tracking-tight">{error}</p>
                  </div>
                )}

                {isRegistering && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-800 ml-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter your full name"
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#43937c]/20 focus:border-[#43937c] transition-all text-sm font-bold text-black placeholder:text-slate-300"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-800 ml-1">Select Role</label>
                      <div className="relative">
                        <select
                          className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#43937c]/20 focus:border-[#43937c] transition-all text-sm font-bold text-black appearance-none cursor-pointer"
                          value={role}
                          onChange={(e) => setRole(e.target.value as Role)}
                        >
                          <option value="Admin">Admin</option>
                          <option value="Doctor">Doctor</option>
                          <option value="Data Entry">Data Entry</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-800 ml-1">
                    Username / Email
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Username or your.email@example.com"
                      className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#43937c]/20 focus:border-[#43937c] transition-all text-sm font-bold text-black placeholder:text-slate-300"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                </div>

                {isRegistering && (
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-800 ml-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      minLength={10}
                      maxLength={10}
                      placeholder="10-digit Number"
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#43937c]/20 focus:border-[#43937c] transition-all text-sm font-bold text-black placeholder:text-slate-300"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-black text-slate-800">Password</label>
                    {!isRegistering && (
                      <Link to="/forgot-password" text-size="sm" className="text-xs font-bold text-[#43937c] hover:underline">
                        Forgot Password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder={isRegistering ? "Create a strong password" : "••••••••"}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#43937c]/20 focus:border-[#43937c] transition-all text-sm font-bold text-black placeholder:text-slate-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#43937c] hover:bg-[#387c69] text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-900/10 transition-all duration-300 active:scale-[0.98] mt-6 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                >
                  {isRegistering ? 'Create Account' : 'Login Now'}
                </button>
              </form>
            )}
          </div>

          <div className="text-center">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
                setGeneratedId(null);
              }}
              className="text-base font-medium text-slate-600 transition-colors group"
            >
              {isRegistering ? (
                <span>Already have an account? <span className="text-[#43937c] font-black group-hover:underline">Log in</span></span>
              ) : (
                <span>New to PFA? <span className="text-[#43937c] font-black group-hover:underline">Create an account</span></span>
              )}
            </button>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex justify-between items-center opacity-40">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              Sanctuary Ops v2.8.0
            </p>
            <div className="flex gap-4">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
