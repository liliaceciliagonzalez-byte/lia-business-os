import './globals.css';

export const metadata = {
  title: 'LIA Business OS',
  description: 'Directora IA para crear campañas, contenido y estrategias de venta.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
