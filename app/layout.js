import './globals.css';
export const metadata = {
  title: 'Edugame',
  description: 'A minimal Next.js app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  );
}


