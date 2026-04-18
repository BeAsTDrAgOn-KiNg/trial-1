import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notify: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`
                pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-lg border min-w-[300px] max-w-md
                ${n.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : ''}
                ${n.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' : ''}
                ${n.type === 'info' ? 'bg-blue-50 border-blue-100 text-blue-800' : ''}
              `}
            >
              {n.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
              {n.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
              {n.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
              
              <p className="text-sm font-medium flex-grow">{n.message}</p>
              
              <button 
                onClick={() => removeNotification(n.id)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
