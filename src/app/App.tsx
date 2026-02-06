import { useState, useEffect } from 'react';
import { QRGenerator } from './components/QRGenerator';
import { QRScanner } from './components/QRScanner';
import { AttendanceList, AttendanceRecord } from './components/AttendanceList';
import { AttendanceForm } from './components/AttendanceForm';
import { LoginPage } from './components/LoginPage';
import { ClipboardList, LogOut, User, Shield } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [course, setCourse] = useState('');
  const [activeTab, setActiveTab] = useState<'generate' | 'scan' | 'records'>('generate');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentScannedSession, setCurrentScannedSession] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
      try {
        const { isAuthenticated, role, username, fullName, course } = JSON.parse(savedAuth);
        setIsAuthenticated(isAuthenticated);
        setUserRole(role);
        setUsername(username);
        setFullName(fullName || '');
        setCourse(course || '');
        // Set default tab based on role
        if (role === 'admin') {
          setActiveTab('scan');
        } else {
          setActiveTab('generate');
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      }
    }
  }, []);

  // Load attendance records from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('attendanceRecords');
    if (saved) {
      try {
        setAttendanceRecords(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading attendance records:', error);
      }
    }
  }, []);

  // Save authentication state to localStorage
  useEffect(() => {
    if (isAuthenticated && userRole) {
      localStorage.setItem('authState', JSON.stringify({
        isAuthenticated,
        role: userRole,
        username,
        fullName,
        course,
      }));
    }
  }, [isAuthenticated, userRole, username, fullName, course]);

  // Save attendance records to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  const handleLogin = (role: 'user' | 'admin', user: string, name: string, userCourse: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUsername(user);
    setFullName(name);
    setCourse(userCourse);
    // Set default tab based on role
    if (role === 'admin') {
      setActiveTab('scan');
    } else {
      setActiveTab('generate');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername('');
    setFullName('');
    setCourse('');
    localStorage.removeItem('authState');
  };

  const handleGenerateSession = (sessionData: { id: string; name: string; createdAt: string }) => {
    console.log('New session generated:', sessionData);
  };

  const handleScanSuccess = (decodedText: string) => {
    try {
      const sessionData = JSON.parse(decodedText);
      
      if (sessionData.id && sessionData.name) {
        setCurrentScannedSession({
          id: sessionData.id,
          name: sessionData.name,
        });
        setActiveTab('scan');
      } else {
        alert('Invalid QR code format');
      }
    } catch (error) {
      alert('Invalid QR code. Please scan a valid attendance QR code.');
    }
  };

  const handleAttendanceSubmit = (data: { name: string; email: string }) => {
    if (!currentScannedSession) return;

    const newRecord: AttendanceRecord = {
      id: `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sessionId: currentScannedSession.id,
      sessionName: currentScannedSession.name,
      name: data.name,
      email: data.email,
      timestamp: new Date().toISOString(),
    };

    setAttendanceRecords((prev) => [...prev, newRecord]);
    setCurrentScannedSession(null);
    setActiveTab('records');
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      setAttendanceRecords((prev) => prev.filter((record) => record.id !== id));
    }
  };

  const handleExportCSV = () => {
    if (attendanceRecords.length === 0) return;

    const headers = ['Session Name', 'Name', 'Email', 'Date', 'Time'];
    const rows = attendanceRecords.map((record) => {
      const date = new Date(record.timestamp);
      return [
        record.sessionName,
        record.name,
        record.email,
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Show login page if not authenticated
  if (!isAuthenticated || !userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ClipboardList className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">QR Attendance System</h1>
          </div>
          <p className="text-gray-600">Generate QR codes, scan them, and track attendance easily</p>
          
          {/* User Info & Logout */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <div className="bg-white px-4 py-2 rounded-lg shadow-md">
              <div className="flex items-center gap-2 mb-1">
                {userRole === 'admin' ? (
                  <Shield className="w-4 h-4 text-blue-600" />
                ) : (
                  <User className="w-4 h-4 text-blue-600" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {fullName}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span>Course: {course}</span>
                <span>•</span>
                <span>{userRole}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs - Show only allowed tabs based on role */}
        <div className="bg-white rounded-lg shadow-md p-2 mb-6 flex gap-2">
          {userRole === 'user' && (
            <button
              onClick={() => setActiveTab('generate')}
              className="flex-1 py-3 px-4 rounded-lg font-medium bg-blue-600 text-white"
            >
              Generate QR
            </button>
          )}
          
          {userRole === 'admin' && (
            <>
              <button
                onClick={() => setActiveTab('scan')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'scan'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Scan QR
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors relative ${
                  activeTab === 'records'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Records
                {attendanceRecords.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {attendanceRecords.length}
                  </span>
                )}
              </button>
            </>
          )}
        </div>

        {/* Content - Show only content for allowed tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userRole === 'user' && activeTab === 'generate' && (
            <>
              <QRGenerator onGenerateSession={handleGenerateSession} />
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">How to Use</h3>
                <ol className="space-y-3 text-gray-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                      1
                    </span>
                    <span>Enter a session name (e.g., "Monday Morning Class")</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                      2
                    </span>
                    <span>Click "Generate QR Code" to create a unique code</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                      3
                    </span>
                    <span>Download the QR code and display it in your venue</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                      4
                    </span>
                    <span>Attendees scan the code to mark their attendance</span>
                  </li>
                </ol>
              </div>
            </>
          )}

          {userRole === 'admin' && activeTab === 'scan' && (
            <>
              <QRScanner onScanSuccess={handleScanSuccess} />
              <AttendanceForm
                sessionData={currentScannedSession}
                onSubmit={handleAttendanceSubmit}
              />
            </>
          )}

          {userRole === 'admin' && activeTab === 'records' && (
            <div className="lg:col-span-2">
              <AttendanceList
                records={attendanceRecords}
                onDelete={handleDeleteRecord}
                onExport={handleExportCSV}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}