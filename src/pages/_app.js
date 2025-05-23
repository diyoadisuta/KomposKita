import '@/styles/globals.css';
import dynamic from 'next/dynamic';
import FlyonuiScript from '../components/FlyonuiScript';
import Footer from '@/components/Footer';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });

export default function App({ Component, pageProps }) {
  return (
    <>
      <FlyonuiScript />
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}
