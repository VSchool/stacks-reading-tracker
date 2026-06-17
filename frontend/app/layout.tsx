import type { Metadata } from 'next';
import './globals.css';
import Nav from './components/Nav';
import DevPanel from './components/DevPanel';

export const metadata: Metadata = {
  title: 'Stacks — your reading tracker',
  description: 'Track the books you are reading, want to read, and have finished.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="container">{children}</main>
        <DevPanel />
      </body>
    </html>
  );
}
