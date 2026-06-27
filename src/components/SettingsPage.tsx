import { useState } from 'react';
import { ArrowLeft, User, Lock, Bell, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';
import { UserRole } from '../App';

interface SettingsPageProps {
  userName: string;
  userRole: UserRole;
  onBack: () => void;
}

export function SettingsPage({ userName, userRole, onBack }: SettingsPageProps) {
  const [profileData, setProfileData] = useState({
    nama: userName,
    email: userRole === 'dosen' ? 'dosen@unismuh.ac.id' : 'mahasiswa@student.unismuh.ac.id',
    phone: '081234567890',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
    push: false,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profil berhasil diperbarui');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Semua field password harus diisi');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Password baru tidak cocok');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password minimal 8 karakter');
      return;
    }

    toast.success('Password berhasil diubah');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleSaveNotifications = () => {
    toast.success('Preferensi notifikasi berhasil disimpan');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(14,116,144,0.1),transparent_30%),radial-gradient(circle_at_85%_5%,rgba(59,130,246,0.12),transparent_30%),#f5f9ff] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Pengaturan</h1>
          <p className="text-gray-600">Kelola profil dan preferensi akun Anda</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Edit Profil
              </CardTitle>
              <CardDescription>
                Perbarui informasi profil Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-gradient-to-br from-[#0052CC] to-[#003D99] text-white text-2xl font-display">{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button type="button" variant="outline" size="sm">
                      Ubah Foto
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG. Max 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input
                      id="nama"
                      value={profileData.nama}
                      onChange={(e) => setProfileData({ ...profileData, nama: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={userRole === 'dosen' ? 'Dosen/Admin' : 'Mahasiswa'}
                      disabled
                    />
                  </div>
                </div>

                <Button type="submit" className="bg-[#0052CC] hover:bg-[#003D99]">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Ubah Password
              </CardTitle>
              <CardDescription>
                Pastikan password Anda kuat dan aman
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Password Saat Ini</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>

                <Button type="submit" className="bg-[#0052CC] hover:bg-[#003D99]">
                  <Lock className="w-4 h-4 mr-2" />
                  Ubah Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          {userRole === 'dosen' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Preferensi Notifikasi
                </CardTitle>
                <CardDescription>
                  Pilih cara Anda ingin menerima notifikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">Terima notifikasi via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">WhatsApp</p>
                    <p className="text-sm text-gray-600">Terima notifikasi via WhatsApp</p>
                  </div>
                  <Switch
                    checked={notifications.whatsapp}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, whatsapp: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">Push Notification</p>
                    <p className="text-sm text-gray-600">Terima notifikasi push di browser</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>

                <Button 
                  onClick={handleSaveNotifications}
                  className="bg-[#0052CC] hover:bg-[#003D99]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Preferensi
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
