import { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo! Saya AI Assistant untuk Sistem Absensi UNISMUH. Ada yang bisa saya bantu? 😊',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const replyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (replyTimerRef.current !== null) {
        clearTimeout(replyTimerRef.current);
      }
    };
  }, []);

  // Knowledge Base untuk AI Chatbot
  const knowledgeBase = [
    {
      keywords: ['cara', 'absen', 'hadir', 'nfc', 'tap'],
      response: 'Untuk melakukan absensi, mahasiswa harus:\n1. Buka aplikasi saat sesi aktif\n2. Tap tombol "Tap untuk Absen"\n3. Tempelkan kartu NFC ke perangkat\n4. Status akan otomatis terupdate! 📱'
    },
    {
      keywords: ['minimal', 'kehadiran', 'lulus', 'syarat'],
      response: 'Syarat kehadiran minimal adalah 75% dari total pertemuan. Jika kehadiran di bawah 75%, mahasiswa tidak dapat mengikuti ujian akhir. 📊'
    },
    {
      keywords: ['telat', 'terlambat', 'waktu'],
      response: 'Sistem absensi NFC memiliki batas waktu. Jika Anda terlambat lebih dari 15 menit, Anda tidak dapat melakukan absensi untuk sesi tersebut. Hubungi dosen untuk kasus khusus. ⏰'
    },
    {
      keywords: ['manual', 'tandai', 'dosen'],
      response: 'Dosen dapat menandai kehadiran mahasiswa secara manual jika ada masalah teknis atau kondisi khusus. Fitur ini tersedia di halaman "Sesi Aktif" dengan badge "MANUAL". 👨‍🏫'
    },
    {
      keywords: ['laporan', 'report', 'export', 'pdf', 'excel'],
      response: 'Dosen dapat mengunduh laporan kehadiran dalam format PDF atau Excel di menu "Laporan Kehadiran". Laporan mencakup statistik lengkap per mahasiswa dan per kelas. 📄'
    },
    {
      keywords: ['tidak', 'bisa', 'gagal', 'error'],
      response: 'Jika ada masalah teknis:\n1. Pastikan NFC aktif di perangkat\n2. Restart aplikasi\n3. Cek koneksi internet\n4. Hubungi admin IT jika masih error 🔧'
    },
    {
      keywords: ['risk', 'risiko', 'prediksi', 'ai'],
      response: 'Sistem AI kami menganalisis pola kehadiran dan memprediksi mahasiswa yang berisiko tidak memenuhi syarat minimal. Risk level ditentukan dari persentase, trend, dan konsistensi kehadiran. 🤖'
    },
    {
      keywords: ['halo', 'hi', 'hello', 'hai'],
      response: 'Halo! Senang bisa membantu Anda. Saya bisa menjawab pertanyaan tentang sistem absensi UNISMUH. Silakan tanya apapun! 👋'
    },
    {
      keywords: ['terima kasih', 'thanks', 'makasih'],
      response: 'Sama-sama! Senang bisa membantu. Jika ada pertanyaan lain, jangan ragu untuk bertanya ya! 😊'
    }
  ];

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Cari jawaban yang cocok dari knowledge base
    for (const knowledge of knowledgeBase) {
      if (knowledge.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return knowledge.response;
      }
    }
    
    // Default response jika tidak ada yang cocok
    return 'Maaf, saya belum memiliki informasi tentang itu. Anda bisa bertanya tentang:\n• Cara absen dengan NFC\n• Syarat kehadiran minimal\n• Laporan dan export data\n• Fitur AI prediksi\n• Troubleshooting masalah teknis 🤔';
  };

  const handleSendMessage = () => {
    const messageText = inputText.trim();
    if (!messageText) return;

    // Tambah pesan user
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    if (replyTimerRef.current !== null) {
      clearTimeout(replyTimerRef.current);
    }

    // Simulasi typing delay
    replyTimerRef.current = window.setTimeout(() => {
      const botResponse = generateBotResponse(messageText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      replyTimerRef.current = null;
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all p-0"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 left-6 z-50 w-[380px] h-[580px] shadow-2xl border-2 border-purple-200 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-white">AI Assistant</h3>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-xs text-purple-100">Online</p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl p-3 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-[#0052CC] to-[#003D99] text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-[#0052CC] rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ketik pertanyaan Anda..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-purple-50"
            onClick={() => setInputText('Bagaimana cara absen dengan NFC?')}
          >
            Cara absen
          </Badge>
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-purple-50"
            onClick={() => setInputText('Berapa minimal kehadiran?')}
          >
            Syarat kehadiran
          </Badge>
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-purple-50"
            onClick={() => setInputText('Bagaimana cara export laporan?')}
          >
            Export laporan
          </Badge>
        </div>
      </div>
    </Card>
  );
}