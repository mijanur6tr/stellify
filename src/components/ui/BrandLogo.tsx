import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({
  className = '',
  showWordmark = true,
  size = 'md',
}: BrandLogoProps) {
  const dimensions = {
    sm: { imgSize: 34, text: 'text-base sm:text-lg tracking-[0.2em]' },
    md: { imgSize: 44, text: 'text-lg sm:text-xl md:text-2xl tracking-[0.22em]' },
    lg: { imgSize: 56, text: 'text-2xl sm:text-3xl tracking-[0.24em]' },
  }[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 sm:gap-3 group focus:outline-none transition-transform duration-300 hover:scale-[1.02] ${className}`}
      aria-label="Stellify - Handcrafted with soul"
    >
      {/* Official Emblem from /logo.jpg */}
      <div className="relative rounded-full overflow-hidden border border-[#C5A059]/40 bg-[#071326] p-0.5 shadow-sm group-hover:border-[#E5C378] transition-colors flex-shrink-0">
        <Image
          src="/logo.jpg"
          alt="Stellify Logo"
          width={dimensions.imgSize}
          height={dimensions.imgSize}
          priority
          className="object-contain rounded-full filter contrast-[1.12] brightness-[1.04]"
        />
      </div>

      {showWordmark && (
        <span className={`font-serif ${dimensions.text} text-[#E5C378] font-normal uppercase select-none group-hover:text-[#FAF7F2] transition-colors leading-none`}>
          Stellify
        </span>
      )}
    </Link>
  );
}

export default BrandLogo;

