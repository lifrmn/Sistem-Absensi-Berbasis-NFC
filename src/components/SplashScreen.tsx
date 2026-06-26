import { GraduationCap, Nfc, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onStart: () => void;
}

export function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0052CC] via-[#0052CC] to-[#003D99] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background circles */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFC107]/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div 
        className="text-center space-y-8 max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo Area */}
        <motion.div 
          className="flex items-center justify-center gap-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        >
          <div className="relative">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <GraduationCap className="w-24 h-24 text-white drop-shadow-2xl" />
            </motion.div>
            <motion.div 
              className="absolute -bottom-2 -right-2 bg-[#FFC107] rounded-full p-3 shadow-2xl"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Nfc className="w-7 h-7 text-[#0052CC]" />
            </motion.div>
            <motion.div
              className="absolute -top-2 -left-2"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-6 h-6 text-[#FFC107]" />
            </motion.div>
          </div>
        </motion.div>

        {/* University Name */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1 className="text-white text-5xl tracking-tight drop-shadow-lg">UNISMUH</h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-[#FFC107]"></div>
            <p className="text-white/90 text-xl tracking-wide">Informatika</p>
            <div className="h-px w-8 bg-[#FFC107]"></div>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-white/95 text-2xl">Sistem Absensi Cerdas</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Nfc className="w-4 h-4 text-[#FFC107]" />
            <p className="text-white/90 text-sm">Berbasis NFC Technology</p>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button 
            onClick={onStart}
            size="lg"
            className="bg-[#FFC107] text-[#0052CC] hover:bg-[#FFD54F] px-10 py-6 text-lg shadow-2xl hover:shadow-[#FFC107]/50 transition-all duration-300 hover:scale-105"
          >
            Mulai Sekarang
          </Button>
        </motion.div>

        {/* Decorative dots */}
        <div className="flex justify-center gap-2 pt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white/40 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
