import Image from 'next/image';
import clsx from 'clsx';

type Props = {
  src?: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function PhoneScreenshot({
  src = '/images/screens/home.png',
  alt,
  priority = false,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        'relative mx-auto w-[280px] aspect-[1206/2622] rounded-phone overflow-hidden border border-border-default shadow-ring-glow bg-navy',
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="280px"
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
