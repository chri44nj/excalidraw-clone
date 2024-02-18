import "./globals.css";

export const metadata = {
  title: "Indkøbsliste",
  description: "En liste over hvad vi mangler",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
