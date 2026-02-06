import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, RefreshCw } from 'lucide-react';

interface QRGeneratorProps {
  onGenerateSession: (sessionData: { id: string; name: string; createdAt: string }) => void;
}

export function QRGenerator({ onGenerateSession }: QRGeneratorProps) {
  const [sessionName, setSessionName] = useState('');
  const [currentSession, setCurrentSession] = useState<{
    id: string;
    name: string;
    createdAt: string;
  } | null>(null);

  const generateSession = () => {
    if (!sessionName.trim()) {
      alert('Please enter a session name');
      return;
    }

    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const sessionData = {
      id: sessionId,
      name: sessionName,
      createdAt: new Date().toISOString(),
    };

    setCurrentSession(sessionData);
    onGenerateSession(sessionData);
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `attendance-${currentSession?.name || 'qr'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Generate QR Code</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="session-name" className="block text-sm font-medium text-gray-700 mb-2">
            Session Name
          </label>
          <input
            id="session-name"
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="e.g., Monday Morning Class"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <button
          onClick={generateSession}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Generate QR Code
        </button>
      </div>

      {currentSession && (
        <div className="border-t pt-6 space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Session: {currentSession.name}</p>
            <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
              <QRCodeSVG
                id="qr-code-svg"
                value={JSON.stringify(currentSession)}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          <button
            onClick={downloadQR}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </button>

          <div className="text-xs text-gray-500 text-center">
            <p>Session ID: {currentSession.id}</p>
            <p>Created: {new Date(currentSession.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
