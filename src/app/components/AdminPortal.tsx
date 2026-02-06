import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'motion/react';
import { Scan, Users, Clock, CheckCircle, Download, Calendar } from 'lucide-react';
import { toast } from 'sonner';

type AttendanceRecord = {
  name: string;
  id: string;
  department: string;
  generatedAt: string; // Time the QR was generated
  scannedAt: string;   // Full ISO string of when it was scanned
};

export function AdminPortal() {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [manualId, setManualId] = useState('');
  
  // Default to today's date formatted as YYYY-MM-DD for the input
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleScan = (result: any) => {
    // @yudiel/react-qr-scanner returns an array of results
    if (result && result.length > 0) {
      const data = result[0].rawValue;
      if (data && data !== scannedData) {
        processScan(data);
      }
    }
  };

  const processScan = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      
      if (!parsed.name || !parsed.id) {
        throw new Error("Invalid QR Code format");
      }

      const now = new Date();
      const newRecord: AttendanceRecord = {
        name: parsed.name,
        id: parsed.id,
        department: parsed.department || 'N/A',
        generatedAt: parsed.timestamp,
        scannedAt: now.toISOString(),
      };

      // Check for recent duplicates (within 5 seconds)
      const lastRecord = history[0];
      if (lastRecord && 
          lastRecord.id === newRecord.id && 
          (now.getTime() - new Date(lastRecord.scannedAt).getTime() < 5000)) {
         return; 
      }

      setScannedData(data);
      setHistory(prev => [newRecord, ...prev]);
      toast.success(`Attendance recorded for ${newRecord.name}`);
      
      setIsScanning(false);
      setTimeout(() => setIsScanning(true), 2000);

    } catch (e) {
        // Only show error toast if it's likely a QR we care about but failed
        // We don't want to spam toasts for random QR codes
      if (data.includes('{')) {
          toast.error("Invalid QR Code: Not an Amicus ID");
      }
      console.error(e);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId) return;
    
    // Create a date object based on the selected date filter
    const entryDate = new Date(selectedDate);
    const now = new Date();
    entryDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

    const newRecord: AttendanceRecord = {
      name: "Manual Entry",
      id: manualId,
      department: "Manual",
      generatedAt: entryDate.toISOString(),
      scannedAt: entryDate.toISOString(),
    };
    
    setHistory(prev => [newRecord, ...prev]);
    toast.success(`Manual attendance recorded for ID: ${manualId}`);
    setManualId('');
  };

  // Filter history based on selected date
  const filteredHistory = history.filter(record => {
    const recordDate = record.scannedAt.split('T')[0];
    return recordDate === selectedDate;
  });

  const downloadCSV = () => {
    if (filteredHistory.length === 0) {
      toast.error("No records to download for this date.");
      return;
    }

    // CSV Header
    const headers = ["Name,ID,Department,Scan Time,Scan Date"];
    
    // CSV Rows
    const rows = filteredHistory.map(record => {
      const dateObj = new Date(record.scannedAt);
      const time = dateObj.toLocaleTimeString();
      const date = dateObj.toLocaleDateString();
      // Escape commas in data to avoid breaking CSV
      const cleanName = record.name.replace(/,/g, '');
      const cleanDept = record.department.replace(/,/g, '');
      
      return `${cleanName},${record.id},${cleanDept},${time},${date}`;
    });

    const csvContent = headers.concat(rows).join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_log_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Admin Portal</h2>
            <p className="text-slate-500">Scan QR codes to record attendance.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 px-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-sm text-slate-700 focus:outline-none font-medium"
                />
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <button 
                onClick={downloadCSV}
                className="flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-md hover:bg-slate-800 transition-colors"
            >
                <Download className="w-3 h-3" />
                Download CSV
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <div className="space-y-4">
          <motion.div 
            className="bg-black rounded-2xl overflow-hidden shadow-xl aspect-square relative flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {isScanning ? (
              <div className="w-full h-full relative">
                <Scanner
                  onScan={handleScan}
                  allowMultiple={true}
                  scanDelay={500}
                  components={{
                    audio: false,
                    onOff: false,
                    torch: false,
                    zoom: false,
                    finder: false,
                  }}
                  styles={{
                    container: { width: "100%", height: "100%" },
                    video: { width: "100%", height: "100%", objectFit: "cover" }
                  }}
                />
                
                {/* Custom Overlay */}
                <div className="absolute inset-0 border-2 border-white/20 pointer-events-none z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-green-500 rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm z-10">
                    Scanning for Amicus ID...
                </div>
              </div>
            ) : (
                <div className="flex flex-col items-center text-green-500 space-y-2">
                    <CheckCircle className="w-16 h-16" />
                    <span className="text-white font-medium">Scanned Successfully</span>
                </div>
            )}
          </motion.div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
             <p className="text-xs font-semibold uppercase text-slate-400 mb-2">Manual Entry</p>
             <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input 
                    type="text" 
                    placeholder="Enter ID Manually" 
                    className="flex-1 text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                />
                <button type="submit" className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-800">
                    Log
                </button>
             </form>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <h3 className="font-semibold text-slate-900">Attendance Log</h3>
            </div>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-medium">
                {filteredHistory.length}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <AnimatePresence>
                {filteredHistory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                        <Scan className="w-8 h-8 opacity-50" />
                        <p className="text-sm">No scans for {selectedDate}.</p>
                    </div>
                ) : (
                    filteredHistory.map((record, index) => (
                        <motion.div
                            key={`${record.id}-${record.scannedAt}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                    {record.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 text-sm">{record.name}</p>
                                    <p className="text-xs text-slate-500">{record.id} • {record.department}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 font-mono bg-white px-2 py-1 rounded border border-slate-100">
                                <Clock className="w-3 h-3" />
                                {new Date(record.scannedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
