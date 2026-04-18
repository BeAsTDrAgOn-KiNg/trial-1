
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Stethoscope, 
  Save, 
  Clock, 
  Calendar, 
  Pill, 
  Activity, 
  User, 
  AlertCircle,
  ChevronDown,
  PlusCircle,
  Trash2,
  Package
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Case, ClinicalEntry } from '../types';

const NewClinicalEntryPage: React.FC = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { cases, medicines, addClinicalEntry, isLoading } = useAppContext();
  const [targetCase, setTargetCase] = useState<Case | null>(null);

  const createInitialEntry = () => ({
    date: new Date().toISOString().split('T')[0],
    symptoms: '',
    diagnosis: '',
    treatment: '',
    doctor_name: 'Dr. Anita Desai'
  });

  const [entry, setEntry] = useState(createInitialEntry());

  useEffect(() => {
    const found = cases.find(c => c.id === caseId);
    if (found) {
      setTargetCase(found);
    }
  }, [caseId, cases]);

  const handleUpdateEntry = (field: string, value: string) => {
    setEntry(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetCase) {
      if (!entry.diagnosis || !entry.treatment) {
        alert("Please provide diagnosis and treatment.");
        return;
      }

      const newEntry: ClinicalEntry = {
        id: `ce-${Date.now()}`,
        case_id: targetCase.id,
        date: entry.date,
        symptoms: entry.symptoms,
        diagnosis: entry.diagnosis,
        treatment: entry.treatment,
        doctor_name: entry.doctor_name,
        created_at: new Date().toISOString()
      };

      addClinicalEntry(newEntry);
      alert("Clinical entry saved.");
      
      navigate('/cases', { state: { openCaseId: caseId } });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005F54]"></div>
      </div>
    );
  }

  if (!targetCase) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <AlertCircle size={48} className="mb-4" />
        <p className="font-black uppercase tracking-[0.2em] text-xs">Case not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all text-slate-500 shadow-sm">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Add Treatments</h1>
          <p className="text-slate-500 font-medium">Add medicines given to {targetCase.id.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-[#005F54] p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <Stethoscope size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Case</p>
              <h3 className="text-xl font-black tracking-tight">{targetCase.id.slice(0, 8).toUpperCase()} • {targetCase.title}</h3>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Status</p>
            <p className="text-xs font-black bg-white/20 px-4 py-1.5 rounded-xl mt-1 uppercase tracking-wider">{targetCase.status}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
          <div className="space-y-8 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#005F54] flex items-center justify-center text-xs font-black border border-emerald-100">
                  1
                </div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Clinical Record</h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Calendar size={12} /> Date
                </label>
                <input 
                  type="date"
                  required
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-[#005F54]/5 focus:border-[#005F54] focus:bg-white focus:outline-none transition-all text-sm font-bold text-black shadow-inner"
                  value={entry.date}
                  onChange={e => handleUpdateEntry('date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <User size={12} /> Attending Doctor
                </label>
                <input 
                  type="text"
                  required
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-[#005F54]/5 focus:border-[#005F54] focus:bg-white focus:outline-none transition-all text-sm font-bold text-black shadow-inner"
                  value={entry.doctor_name}
                  onChange={e => handleUpdateEntry('doctor_name', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                  <Activity size={12} /> Symptoms
                </label>
                <textarea 
                  rows={2}
                  placeholder="Describe observed symptoms..."
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-[#005F54]/5 focus:border-[#005F54] focus:bg-white focus:outline-none transition-all text-sm font-medium text-black shadow-inner"
                  value={entry.symptoms}
                  onChange={e => handleUpdateEntry('symptoms', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diagnosis</label>
                <textarea 
                  rows={2}
                  required
                  placeholder="Enter clinical diagnosis..."
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-[#005F54]/5 focus:border-[#005F54] focus:bg-white focus:outline-none transition-all text-sm font-medium text-black shadow-inner"
                  value={entry.diagnosis}
                  onChange={e => handleUpdateEntry('diagnosis', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Treatment Plan</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Describe medicines and procedures..."
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:ring-4 focus:ring-[#005F54]/5 focus:border-[#005F54] focus:bg-white focus:outline-none transition-all text-sm font-medium text-black shadow-inner"
                  value={entry.treatment}
                  onChange={e => handleUpdateEntry('treatment', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4">
            <button 
              type="submit"
              className="flex-1 py-5 bg-[#005F54] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/10 hover:bg-[#004a42] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Save size={18} />
              Save Clinical Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClinicalEntryPage;
