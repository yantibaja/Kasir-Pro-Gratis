import React, { useState } from 'react';
import AttendancePage from './AttendancePage.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('attendance');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-lg font-bold">Aplikasi Kasir & Bisnis</h1>
        <div className="space-x-2">
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${activeTab === 'attendance' ? 'bg-blue-800' : 'bg-blue-500'}`}
          >
            Absensi
          </button>
          <button 
            onClick={() => setActiveTab('pos')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${activeTab === 'pos' ? 'bg-blue-800' : 'bg-blue-500'}`}
          >
            Kasir (POS)
          </button>
        </div>
      </header>
      <main className="flex-1 p-6 flex justify-center items-center">
        {activeTab === 'attendance' ? (
          <AttendancePage />
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
            <h2 className="text-xl font-bold mb-2">Modul Kasir (POS)</h2>
            <p className="text-gray-500 text-sm">Segera hadir.</p>
          </div>
        )}
      </main>
    </div>
  );
}
