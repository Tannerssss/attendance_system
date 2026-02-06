import { useState } from 'react';
import { LogIn, User, Shield, ClipboardList } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'user' | 'admin', username: string, fullName: string, course: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [course, setCourse] = useState('');
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert('Please enter username and password');
      return;
    }

    if (!fullName.trim() || !course.trim()) {
      alert('Please enter your full name and course');
      return;
    }

    if (!selectedRole) {
      alert('Please select a role');
      return;
    }

    // Simple demo authentication
    // User credentials: username: user, password: user123
    // Admin credentials: username: admin, password: admin123
    if (selectedRole === 'user' && username === 'user' && password === 'user123') {
      onLogin('user', username, fullName, course);
    } else if (selectedRole === 'admin' && username === 'admin' && password === 'admin123') {
      onLogin('admin', username, fullName, course);
    } else {
      alert('Invalid credentials. Try:\nUser: user/user123\nAdmin: admin/admin123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ClipboardList className="w-12 h-12 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">QR Attendance</h1>
          </div>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Login</h2>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedRole('user')}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedRole === 'user'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <User className={`w-8 h-8 mx-auto mb-2 ${
                selectedRole === 'user' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <p className={`font-medium ${
                selectedRole === 'user' ? 'text-blue-600' : 'text-gray-700'
              }`}>
                User
              </p>
              <p className="text-xs text-gray-500 mt-1">Generate QR</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedRole === 'admin'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Shield className={`w-8 h-8 mx-auto mb-2 ${
                selectedRole === 'admin' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <p className={`font-medium ${
                selectedRole === 'admin' ? 'text-blue-600' : 'text-gray-700'
              }`}>
                Admin
              </p>
              <p className="text-xs text-gray-500 mt-1">Scan & Records</p>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <input
                  id="course"
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="CS101"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!selectedRole}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="border-t pt-4">
            <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-medium">User:</p>
                <p>Username: <code className="bg-white px-1">user</code></p>
                <p>Password: <code className="bg-white px-1">user123</code></p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="font-medium">Admin:</p>
                <p>Username: <code className="bg-white px-1">admin</code></p>
                <p>Password: <code className="bg-white px-1">admin123</code></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}