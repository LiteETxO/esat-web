// Static-export root: meta-refresh to /en/ (middleware handles this in server deployments)
export default function RootPage() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0;url=/esat-web/en/" />
        <title>ESAT</title>
      </head>
      <body />
    </html>
  )
}
