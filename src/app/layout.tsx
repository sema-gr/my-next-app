import { Geist, Geist_Mono } from 'next/font/google';
import './styles/globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from './providers/AuthProvider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uk">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <AuthProvider>
                    <Toaster position="top-center" richColors />
                    <main>{children}</main>
                </AuthProvider>
            </body>
        </html>
    );
}
