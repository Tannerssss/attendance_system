import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card"; // Assuming I'll create UI components or use raw Tailwind
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { User, QrCode } from 'lucide-react';
import { motion } from 'motion/react';

export function UserPortal() {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    department: ''
  });
  const [generatedQr, setGeneratedQr] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.id) {
      // Create a JSON string of the user data
      const qrData = JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString()
      });
      setGeneratedQr(qrData);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-4 w-full max-w-md mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">User Portal</h2>
        <p className="text-slate-500">Enter your credentials to generate your attendance QR code.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
      >
        <div className="p-6 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 pl-9 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="id" className="text-sm font-medium text-slate-700">ID Number</label>
              <input
                id="id"
                name="id"
                type="text"
                placeholder="EMP-12345"
                required
                className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.id}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium text-slate-700">Department</label>
              <input
                id="department"
                name="department"
                type="text"
                placeholder="Engineering"
                className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR Code
            </button>
          </form>
        </div>
      </motion.div>

      {generatedQr && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center space-y-4"
        >
          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG value={generatedQr} size={200} level="H" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-900">{formData.name}</p>
            <p className="text-sm text-slate-500">{formData.id}</p>
            <p className="text-xs text-slate-400 mt-1">Scan this code at the kiosk</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
