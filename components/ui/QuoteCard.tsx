import { Card } from './Card';

export function QuoteCard({ quote, name, role, image }: {
  quote: string; name: string; role: string; image?: string;
}) {
  return (
    <Card>
      <p className="text-body-lg text-white">&ldquo;{quote}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full bg-border-default"
          style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', filter: 'grayscale(1) sepia(0.2) hue-rotate(170deg)' } : undefined}
          aria-hidden="true"
        />
        <div>
          <div className="text-white text-caption font-semibold">{name}</div>
          <div className="text-steel text-caption">{role}</div>
        </div>
      </div>
    </Card>
  );
}
