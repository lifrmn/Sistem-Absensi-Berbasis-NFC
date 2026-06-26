import { useEffect, useRef, useState } from 'react';
import { Nfc, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface NFCScanOverlayProps {
  onSuccess: () => void;
  onBack: () => void;
}

type ScanStatus = 'scanning' | 'success' | 'error';

export function NFCScanOverlay({ onSuccess, onBack }: NFCScanOverlayProps) {
  const [status, setStatus] = useState<ScanStatus>('scanning');
  const timersRef = useRef<number[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((timerId) => clearTimeout(timerId));
    timersRef.current = [];
  };

  const startScan = () => {
    clearAllTimers();
    setStatus('scanning');

    // In production mode we avoid random outcomes for a predictable UX.
    const scanTimer = window.setTimeout(() => {
      setStatus('success');

      const successTimer = window.setTimeout(() => {
        onSuccess();
      }, 1800);

      timersRef.current.push(successTimer);
    }, 2500);

    timersRef.current.push(scanTimer);
  };

  useEffect(() => {
    startScan();

    return () => {
      clearAllTimers();
    };
  }, [onSuccess]);

  const handleRetry = () => {
    startScan();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onBack}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="text-center space-y-6">
          {status === 'scanning' && (
            <>
              <div className="relative mx-auto w-32 h-32">
                {/* Pulsing circles animation */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#0052CC]/20"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#0052CC]/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0052CC] to-[#003D99] flex items-center justify-center">
                  <Nfc className="w-16 h-16 text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl text-gray-900 mb-2">Mendeteksi NFC...</h3>
                <p className="text-gray-600">
                  Dekatkan HP Anda ke Dosen atau Tag NFC Kelas
                </p>
              </div>

              <div className="flex justify-center gap-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#0052CC]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#0052CC]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#0052CC]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mx-auto w-32 h-32 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
              <h3 className="text-2xl text-gray-900 mb-2">NFC Berhasil Terbaca!</h3>
              <p className="text-gray-600">Absensi Anda telah tercatat</p>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Mata Kuliah: Pemrograman Web<br />
                  ✓ Waktu: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}<br />
                  ✓ Status: Hadir
                </p>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mx-auto w-32 h-32 rounded-full bg-red-100 flex items-center justify-center mb-6">
                <AlertCircle className="w-16 h-16 text-red-600" />
              </div>
              <h3 className="text-2xl text-gray-900 mb-2">NFC Gagal</h3>
              <p className="text-gray-600">Tidak dapat membaca tag NFC. Silakan coba lagi.</p>
              
              <div className="mt-6 space-y-3">
                <Button 
                  onClick={handleRetry}
                  className="w-full bg-[#0052CC] hover:bg-[#003D99]"
                >
                  Coba Lagi
                </Button>
                <Button 
                  onClick={onBack}
                  variant="outline"
                  className="w-full"
                >
                  Kembali
                </Button>
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-lg text-left">
                <p className="text-sm text-orange-800">
                  <strong>Tips:</strong><br />
                  • Pastikan NFC aktif di HP Anda<br />
                  • Dekatkan HP ke tag dengan jarak {'<'}5cm<br />
                  • Jangan gerakkan HP saat scanning
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
