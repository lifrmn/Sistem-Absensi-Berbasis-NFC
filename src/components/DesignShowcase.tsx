import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Nfc, 
  CheckCircle, 
  Users, 
  BookOpen, 
  FileText,
  Smartphone,
  Monitor,
  Sparkles,
  Shield,
  Zap,
  BarChart3,
  Brain
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface DesignShowcaseProps {
  onClose: () => void;
}

export function DesignShowcase({ onClose }: DesignShowcaseProps) {
  const features = [
    {
      icon: Nfc,
      title: 'NFC Technology',
      description: 'Absensi cepat dengan teknologi NFC contactless',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Real-time Sync',
      description: 'Data kehadiran tersinkronisasi secara real-time',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Sistem keamanan tinggi untuk data mahasiswa',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Visualisasi data kehadiran yang komprehensif',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const colorPalette = [
    { name: 'Primary Blue', hex: '#0052CC', usage: 'Brand Color, CTAs' },
    { name: 'Dark Blue', hex: '#003D99', usage: 'Gradient, Hover States' },
    { name: 'Accent Yellow', hex: '#FFC107', usage: 'Highlights, Icons' },
    { name: 'Background', hex: '#F5F7FA', usage: 'Page Background' },
    { name: 'Success Green', hex: '#10B981', usage: 'Success States' },
    { name: 'Error Red', hex: '#EF4444', usage: 'Error States' },
  ];

  const components = [
    { name: 'Splash Screen', type: 'Intro', platform: 'All' },
    { name: 'Login/Register', type: 'Auth', platform: 'All' },
    { name: 'Dosen Dashboard', type: 'Main', platform: 'Desktop' },
    { name: 'Mahasiswa Dashboard', type: 'Main', platform: 'Mobile' },
    { name: 'NFC Scan Overlay', type: 'Interactive', platform: 'Mobile' },
    { name: 'Active Session', type: 'Management', platform: 'Desktop' },
    { name: 'Attendance Report', type: 'Analytics', platform: 'Desktop' },
    { name: 'Settings', type: 'Config', platform: 'All' },
    { name: 'AI Analytics Engine', type: 'AI Features', platform: 'All', highlight: true },
    { name: 'AI Chatbot Assistant', type: 'AI Features', platform: 'All', highlight: true },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] overflow-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0052CC] via-[#0052CC] to-[#003D99] text-white relative overflow-hidden">
        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-64 h-64 bg-[#FFC107]/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <GraduationCap className="w-20 h-20" />
              <Nfc className="w-16 h-16 text-[#FFC107] animate-pulse-nfc" />
            </div>
            <h1 className="text-6xl mb-4 tracking-tight">UNISMUH NFC Attendance</h1>
            <p className="text-2xl text-white/90 mb-6">Sistem Absensi Cerdas Berbasis NFC</p>
            <div className="flex justify-center gap-3">
              <Badge className="bg-white/20 hover:bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                Informatika
              </Badge>
              <Badge className="bg-[#FFC107] hover:bg-[#FFC107] text-[#0052CC] px-4 py-2 text-sm">
                Design Showcase
              </Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Button
              onClick={onClose}
              size="lg"
              className="bg-[#FFC107] text-[#0052CC] hover:bg-[#FFD54F] px-8"
            >
              Tutup Showcase
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl text-center mb-12 text-gray-900">Fitur Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-[#0052CC]/20">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Color Palette */}
      <section className="max-w-7xl mx-auto px-6 py-16 bg-white rounded-3xl my-8">
        <h2 className="text-4xl text-center mb-12 text-gray-900">Color Palette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colorPalette.map((color, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
            >
              <div
                className="w-20 h-20 rounded-xl shadow-md"
                style={{ backgroundColor: color.hex }}
              />
              <div>
                <h3 className="text-gray-900 mb-1">{color.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{color.hex}</p>
                <p className="text-xs text-gray-500">{color.usage}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Components Overview */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl text-center mb-12 text-gray-900">Komponen Sistem</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {components.map((component, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {component.platform === 'Desktop' ? (
                        <Monitor className="w-10 h-10 text-[#0052CC]" />
                      ) : component.platform === 'Mobile' ? (
                        <Smartphone className="w-10 h-10 text-[#FFC107]" />
                      ) : component.type === 'AI Features' ? (
                        <Brain className="w-10 h-10 text-purple-500" />
                      ) : (
                        <Sparkles className="w-10 h-10 text-purple-500" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg text-gray-900">{component.name}</h3>
                          {component.highlight && (
                            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                              NEW
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{component.type}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {component.platform}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Design Principles */}
      <section className="max-w-7xl mx-auto px-6 py-16 mb-16">
        <h2 className="text-4xl text-center mb-12 text-gray-900">Design Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-t-4 border-t-[#0052CC]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-[#0052CC]" />
                User-Centric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Desain yang intuitif dan mudah digunakan untuk dosen dan mahasiswa
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-[#FFC107]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6 text-[#FFC107]" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Optimasi kecepatan dan efisiensi untuk pengalaman yang lancar
              </p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Accessibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Desain yang accessible dan responsif di berbagai perangkat
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}