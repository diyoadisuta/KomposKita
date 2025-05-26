import '@/styles/globals.css';
import FlyonuiScript from '../components/FlyonuiScript';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

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
