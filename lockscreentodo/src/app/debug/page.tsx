export default function DebugPage() {
  return (
    <html>
      <body>
        <h1>V2 System Debug: If you see this, Next.js is working!</h1>
        <p>Path: /debug</p>
        <p>Time: {new Date().toISOString()}</p>
      </body>
    </html>
  );
}
