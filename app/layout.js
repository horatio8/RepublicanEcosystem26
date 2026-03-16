import './styles/globals.css'

export const metadata = {
  title: 'NDIS Operations Map - Australia',
  description: 'Interactive map of NDIS providers and operations across Australia. Search by postcode to find disability services near you.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
