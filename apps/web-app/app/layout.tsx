import type { Metadata } from 'next'
import './globals.css'
import '@monorepo/web-ui/styles.css'

export const metadata: Metadata = {
  title: 'Web App - 用户注册',
  description: 'A Next.js web app for user registration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="m-0 font-sans min-h-screen grid place-items-center p-8 px-4 text-web-ui-ink">
        <div className="fixed inset-0 -z-10 bg-gradient-radial" />
        {children}
      </body>
    </html>
  )
}
