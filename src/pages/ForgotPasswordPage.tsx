
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const leftSideImageUrl = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=2069";

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#EBFDFA]">
      {/* Left Side: Visuals */}
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
            Helping you regain access to the sanctuary portal. Secure and verified recovery process.
          </p>
        </div>
      </div>

      {/* Right Side: Reset Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-lg space-y-10">
          <div className="text-left mb-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Forgot Password?
            </h2>
            <p className="text-slate-500 font-medium text-lg mt-2">
              Enter your registered email to receive a verification code.
            </p>
          </div>

          <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl shadow-emerald-900/5 border border-white/50">
            {isSubmitted ? (
              <div className="text-center space-y-6 py-4 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-[#43937c]">
                  <CheckCircle2 size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Code Sent!</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">
                    We've sent a verification code to <span className="font-bold text-slate-800">{email}</span>. Please check your inbox (and spam folder).
                  </p>
                </div>
                <div className="pt-4 space-y-4">
                   <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-4 rounded-2xl">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Enter Verification Code</p>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="w-8 h-10 border-b-2 border-slate-300"></div>
                        ))}
                      </div>
                   </div>
                   <button className="w-full bg-[#005F54] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-[#004a42] transition-all">
                     Verify & Reset
                   </button>
                </div>
                <Link 
                  to="/"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 font-black text-xs uppercase tracking-widest pt-4 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-800 ml-1">Staff Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#43937c]/20 focus:border-[#43937c] transition-all text-sm font-bold text-black placeholder:text-slate-300"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#43937c] hover:bg-[#387c69] text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-900/10 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
                >
                  <KeyRound size={18} />
                  Send Verification Code
                </button>

                <div className="text-center pt-2">
                  <Link 
                    to="/"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-[#43937c] font-black text-sm uppercase tracking-widest transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex justify-between items-center opacity-40">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
              Sanctuary Security Protocol v2.8.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
