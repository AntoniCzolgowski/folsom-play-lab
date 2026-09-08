import type { Metadata } from 'next';
import './globals.css';


export const metadata: Metadata = {
  title: 'Folsom Play Lab — Colorado Football Simulator',
  description: 'Local 3D football play simulation in Folsom Field.',
  icons: { icon: '/favicon.svg', apple: '/app-icon.png' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="dark"
      >
        {children}
      </body>
    </html>
  );
}
