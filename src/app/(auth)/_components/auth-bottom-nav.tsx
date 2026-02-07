import Link from 'next/link';

interface AuthBottomNavProps {
  text: string;
  linkText: string;
  linkPath: string;
}

export function AuthBottomNav({ text, linkText, linkPath }: AuthBottomNavProps): React.ReactElement {
  return (
    <div className="mb-3 mt-1 flex flex-wrap items-center justify-center gap-1">
      <p className="text-sm text-muted-foreground">{text}</p>
      <Link className="text-sm font-medium underline-offset-4 hover:underline" href={linkPath}>
        {linkText}
      </Link>
    </div>
  );
}
