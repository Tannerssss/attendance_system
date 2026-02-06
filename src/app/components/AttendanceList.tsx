import { Users, Calendar, Clock, Trash2, Download } from 'lucide-react';

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  sessionName: string;
  name: string;
  email: string;
  timestamp: string;
}

interface AttendanceListProps {
  records: AttendanceRecord[];
  onDelete: (id: string) => void;
  onExport: () => void;
}

export function AttendanceList({ records, onDelete, onExport }: AttendanceListProps) {
  const groupedRecords = records.reduce((acc, record) => {
    const sessionKey = record.sessionId;
    if (!acc[sessionKey]) {
      acc[sessionKey] = {
        sessionName: record.sessionName,
        records: [],
      };
    }
    acc[sessionKey].records.push(record);
    return acc;
  }, {} as Record<string, { sessionName: string; records: AttendanceRecord[] }>);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Attendance Records</h2>
        </div>
        {records.length > 0 && (
          <button
            onClick={onExport}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No attendance records yet</p>
          <p className="text-sm mt-2">Scan QR codes to start tracking attendance</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Total Attendance: <span className="font-semibold">{records.length}</span> records
            </p>
          </div>

          {Object.entries(groupedRecords).map(([sessionId, { sessionName, records: sessionRecords }]) => (
            <div key={sessionId} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{sessionName}</h3>
                  <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                    {sessionRecords.length} {sessionRecords.length === 1 ? 'person' : 'people'}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {sessionRecords.map((record) => (
                  <div
                    key={record.id}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-gray-900">{record.name}</p>
                      <p className="text-sm text-gray-600">{record.email}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(record.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(record.timestamp)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDelete(record.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
