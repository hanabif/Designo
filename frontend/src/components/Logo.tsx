import React, { useId } from 'react';

/**
 * Designo brand logo.
 *
 * Built from three inspirations:
 *  - "Solary": a chunky, rounded "woven plus" mark with a rounded-square
 *    counter punched out of the middle.
 *  - "astro": a soft, geometric lowercase wordmark.
 *  - "miracle": a four-point sparkle accent trailing the wordmark.
 *
 * The wordmark is set in Zodiak (the brand display face) so it must only be
 * rendered inside the app bundle where `css/zodiak.css` is loaded.
 */

/** Plus mark with rounded outer + inner corners and a rounded-square counter (64×64). */
export const LOGO_MARK_PATH =
  'M26 4H38A6 6 0 0 1 44 10V14A6 6 0 0 0 50 20H54A6 6 0 0 1 60 26V38A6 6 0 0 1 54 44H50A6 6 0 0 0 44 50V54A6 6 0 0 1 38 60H26A6 6 0 0 1 20 54V50A6 6 0 0 0 14 44H10A6 6 0 0 1 4 38V26A6 6 0 0 1 10 20H14A6 6 0 0 0 20 14V10A6 6 0 0 1 26 4Z' +
  'M30 26H34A4 4 0 0 1 38 30V34A4 4 0 0 1 34 38H30A4 4 0 0 1 26 34V30A4 4 0 0 1 30 26Z';

/** Four-point sparkle (24×24). */
export const SPARKLE_PATH = 'M12 2Q13 9 20 10Q13 11 12 18Q11 11 4 10Q11 9 12 2Z';

export type LogoVariant = 'brand' | 'mono' | 'onDark';

interface LogoMarkProps {
  /** Mark size in px (square). */
  size?: number;
  /** "brand" = purple gradient, "mono" = currentColor. */
  variant?: 'brand' | 'mono';
  className?: string;
}

export const LogoMark: React.FC<LogoMarkProps> = ({ size = 24, variant = 'brand', className }) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const gradientId = `designo-mark-grad-${uid}`;
  const isBrand = variant === 'brand';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isBrand && (
        <defs>
          <linearGradient id={gradientId} x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6b38d4" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      )}
      <path
        d={LOGO_MARK_PATH}
        fillRule="evenodd"
        clipRule="evenodd"
        fill={isBrand ? `url(#${gradientId})` : 'currentColor'}
      />
    </svg>
  );
};

interface LogoWordmarkProps {
  /** Tailwind/text classes for the wordmark (size, color…). */
  className?: string;
  showSparkle?: boolean;
}

/** Lowercase "designo" wordmark set in Zodiak, with the sparkle accent. */
export const LogoWordmark: React.FC<LogoWordmarkProps> = ({ className = '', showSparkle = true }) => (
  <span
    className={`font-display lowercase leading-none tracking-[-0.02em] text-[#0a0a0f] ${className}`}
  >
    designo
    {showSparkle && (
      <svg
        viewBox="0 0 24 24"
        width="0.44em"
        height="0.44em"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className="ml-[0.12em] inline-block -translate-y-[0.52em] text-[#6b38d4]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={SPARKLE_PATH} />
      </svg>
    )}
  </span>
);

interface LogoProps {
  /** Mark size in px (square). */
  size?: number;
  /** brand = gradient mark + ink wordmark; mono = currentColor; onDark = white. */
  variant?: LogoVariant;
  /** Render the wordmark next to the mark. */
  wordmark?: boolean;
  /** Extra classes for the wordmark (e.g. text size overrides). */
  wordmarkClassName?: string;
  showSparkle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 26,
  variant = 'brand',
  wordmark = true,
  wordmarkClassName = '',
  showSparkle = true,
  className = '',
}) => {
  const onDark = variant === 'onDark';
  const mono = variant === 'mono';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark
        size={size}
        variant={mono || onDark ? 'mono' : 'brand'}
        className={onDark ? 'text-white' : undefined}
      />
      {wordmark && (
        <LogoWordmark
          showSparkle={showSparkle}
          className={`${onDark ? 'text-white' : ''} ${wordmarkClassName}`}
        />
      )}
    </span>
  );
};

export default Logo;
