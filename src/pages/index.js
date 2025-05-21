import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home({ session }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>KomposKita - Solusi Kompos Terbaik</title>
        <meta
          name="description"
          content="Platform rekomendasi kompos dan komunitas composting"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar initialSession={session} />

      <main>
        {/* Banner Utama - Rekomendasi Kompos */}
        <section className="relative bg-amber-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">
                  Dapatkan Rekomendasi Kompos Terbaik
                </h1>
                <p className="text-xl mb-8">
                  Temukan solusi komposting yang tepat untuk kebutuhan Anda
                  dengan rekomendasi yang dipersonalisasi
                </p>
                <Link
                  href="/rekomendasi"
                  className="bg-white text-amber-800 px-8 py-3 rounded-full font-semibold hover:bg-amber-700 hover:border-amber-950 hover:text-neutral-50 transition duration-300"
                >
                  Dapatkan Rekomendasi
                </Link>
              </div>
              <div className="md:w-1/2">
                <div className="relative h-64 md:h-96 w-full">
                  <Image
                    src="/images/composting-banner.png"
                    alt="Composting Illustration"
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Banner Kedua - Forum Komunitas */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Bergabung dengan Komunitas
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Diskusikan pengalaman composting Anda, ajukan pertanyaan, dan
                  berbagi pengetahuan dengan komunitas komposting Indonesia
                </p>
                <Link
                  href="/forum"
                  className="bg-amber-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 hover:border-amber-950 transition duration-300"
                >
                  Masuk Forum
                </Link>
              </div>
              <div className="md:w-1/2">
                <div className="relative h-64 md:h-96 w-full">
                  <Image
                    src="/images/community-banner.png"
                    alt="Community Forum Illustration"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
