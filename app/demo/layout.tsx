import { notFound } from 'next/navigation';
import Link from 'next/link';
import './demo.css';

// Exploration routes only — never shipped. Returns a hard 404 in any
// production build/deploy so these can never leak onto memobtp.fr.
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return (
    <div className="demo-shell">
      <nav className="demo-nav">
        <Link href="/demo" className="demo-nav-home">← Index des variantes</Link>
        <div className="demo-nav-links">
          <Link href="/demo/v1">v1</Link>
          <Link href="/demo/v2">v2</Link>
          <Link href="/demo/v3">v3</Link>
          <Link href="/demo/v4">v4</Link>
          <Link href="/demo/v1-v2">v1+v2</Link>
          <Link href="/demo/v3-v4">v3+v4</Link>
          <Link href="/demo/v1-v3">v1+v3</Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
