import { useState } from 'react';
import { UserPlus } from 'lucide-react';

interface AttendanceFormProps {
  sessionData: { id: string; name: string } | null;
  onSubmit: (data: { name: string; email: string }) => void;
}

export function AttendanceForm({ sessionData, onSubmit }: AttendanceFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit({ name, email });
    setName('');
    setEmail('');
  };

  if (!sessionData) {
    return (
      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-600">Scan a QR code to mark attendance</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          Session: <span className="font-semibold">{sessionData.name}</span>
        </p>
      </div>

      <h3 className="text-xl font-semibold text-gray-800">Mark Your Attendance</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="attendee-name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            id="attendee-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label htmlFor="attendee-email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="attendee-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Submit Attendance
        </button>
      </form>
    </div>
  );
}
