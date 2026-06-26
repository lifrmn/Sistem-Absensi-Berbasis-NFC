import { GraduationCap } from 'lucide-react';

interface UnismuhLogoProps {
  /** Tailwind size class – e.g. "w-24 h-24" */
  size?: string;
  /** Extra Tailwind classes */
  className?: string;
}

/**
 * Menampilkan logo resmi Universitas Muhammadiyah Makassar.
 * File gambar harus diletakkan di  public/logo-unismuh.png
 * (Vite menyajikannya di-root: /logo-unismuh.png).
 *
 * Fallback otomatis ke ikon GraduationCap bila gambar belum tersedia.
 */
export function UnismuhLogo({ size = 'w-24 h-24', className = '' }: UnismuhLogoProps) {
  return (
    <img
      src="/logo-unismuh.png"
      alt="Logo Universitas Muhammadiyah Makassar"
      className={`${size} object-contain drop-shadow-2xl ${className}`}
      onError={(e) => {
        // Fallback: sembunyikan gambar yang gagal dimuat
        const target = e.currentTarget;
        target.style.display = 'none';
        const fallback = target.nextElementSibling as HTMLElement | null;
        if (fallback) fallback.style.display = '';
      }}
    />
  );
}

/**
 * Wrapper yang menyertakan fallback ikon bila logo.png belum ada.
 * Dipakai di semua lokasi branding.
 */
export function UnismuhLogoWithFallback({
  size = 'w-24 h-24',
  className = '',
  fallbackClassName = '',
}: UnismuhLogoProps & { fallbackClassName?: string }) {
  return (
    <>
      <img
        src="/logo-unismuh.png"
        alt="Logo Universitas Muhammadiyah Makassar"
        className={`${size} object-contain drop-shadow-2xl ${className}`}
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = '';
        }}
      />
      {/* Fallback ditampilkan hanya ketika logo.png gagal dimuat */}
      <GraduationCap
        className={`${size} text-white drop-shadow-2xl ${fallbackClassName}`}
        style={{ display: 'none' }}
      />
    </>
  );
}
