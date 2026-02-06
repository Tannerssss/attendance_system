import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, CheckCircle, XCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export function QRScanner({ onScanSuccess }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = 'qr-reader';

  const startScanning = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(qrCodeRegionId);
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Success callback
          setScanMessage({ type: 'success', text: 'QR Code scanned successfully!' });
          onScanSuccess(decodedText);
          
          // Auto-hide message after 2 seconds
          setTimeout(() => setScanMessage(null), 2000);
        },
        (errorMessage) => {
          // Error callback (usually just means no QR code detected)
          // We don't show these errors to avoid spam
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      setScanMessage({ 
        type: 'error', 
        text: 'Camera access denied or not available' 
      });
      setTimeout(() => setScanMessage(null), 3000);
    }
  };

  const stopScanning = async () => {
    try {
      if (scannerRef.current && isScanning) {
        await scannerRef.current.stop();
        setIsScanning(false);
      }
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Scan QR Code</h2>

      <div className="space-y-4">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Start Camera
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <CameraOff className="w-5 h-5" />
            Stop Camera
          </button>
        )}

        <div 
          id={qrCodeRegionId}
          className="w-full aspect-square max-w-md mx-auto rounded-lg overflow-hidden border-2 border-gray-300"
        />

        {scanMessage && (
          <div
            className={`p-4 rounded-lg flex items-center gap-2 ${
              scanMessage.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {scanMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{scanMessage.text}</span>
          </div>
        )}

        <div className="text-sm text-gray-600 text-center">
          <p>Position the QR code within the camera frame</p>
          <p className="text-xs mt-1">Make sure the code is well-lit and in focus</p>
        </div>
      </div>
    </div>
  );
}
