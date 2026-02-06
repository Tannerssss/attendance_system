import React, { useState } from 'react';
import { UserPortal } from './components/UserPortal';
import { AdminPortal } from './components/AdminPortal';
import { Toaster } from 'sonner';
import { ShieldCheck, UserCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'home' | 'user' | 'admin'>('home');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-lg tracking-tight">Amicus<span className="font-light text-slate-400">Attendance</span></span>
          </div>
          
          {view !== 'home' && (
            <button 
              onClick={() => setView('home')}
              className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {view === 'home' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-10">
            <div className="text-center space-y-4 max-w-lg">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Attendance System
              </h1>
              <p className="text-lg text-slate-600">
                Welcome to the Amicus attendance portal. Please select your role to continue.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <button
                onClick={() => setView('user')}
                className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all duration-200 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <UserCircle className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Student / Employee</h3>
                  <p className="text-sm text-slate-500 mt-1">Generate your QR code for check-in</p>
                </div>
              </button>

              <button
                onClick={() => setView('admin')}
                className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-slate-900 hover:shadow-md transition-all duration-200 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <ShieldCheck className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Administrator</h3>
                  <p className="text-sm text-slate-500 mt-1">Scan QR codes and view logs</p>
                </div>
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mt-12">
              © {new Date().getFullYear()} Amicus Systems. All rights reserved.
            </p>
          </div>
        )}

        {view === 'user' && <UserPortal />}
        {view === 'admin' && <AdminPortal />}
      </main>
    </div>
  );
}
