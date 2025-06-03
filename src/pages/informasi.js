import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';

export default function Informasi() {
  return (
    <>
      <Head>
        <title>Informasi seputar komposting</title>
      </Head>

      <div className="bg-[url(/images/jumbotron-composting.jpg)] min-h-120 bg-cover bg-local bg-center grid grid-cols-2">
        <div className="self-center ps-16 flex flex-col gap-4">
          <h1 className="text-4xl text-orange-100 font-normal">
            Informasi Seputar <strong>Komposting</strong>
          </h1>
        </div>
      </div>

      <section>
        <div className="mx-auto max-w-[1200px] my-10 p-8">
          <div className="flex flex-col gap-4">
            <Image
              src="/images/question.png"
              alt="Question mark"
              width={150}
              height={150}
              aria-hidden="true"
              className="mx-auto"
            />

            <div className="flex flex-col items-center gap-2 mb-10">
              <h2 className="text-base-content text-3xl">
                Bagaimana memulai komposting?
              </h2>
              <p>
                Jika kamu belum mengetahui apakah sampah dapurmu layak sebagai
                bahan komposting, kamu dapat memeriksanya terlebih dahulu
                <Link
                  href="/rekomendasi-komposting"
                  className="text-blue-600 font-semibold"
                >
                  {' '}
                  disini
                </Link>
              </p>
            </div>

            <div className="divider max-w-md mx-auto"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="flex flex-col self-center">
                <p className="text-lg">
                  Untuk tahap-tahap cara pembuatan, kamu dapat memeriksa video
                  berikut yang kami kutip dari akun{' '}
                  <Link
                    href="https://www.youtube.com/@SantaiBerkebun"
                    className="italic"
                  >
                    @SantaiBerkebun
                  </Link>
                </p>
              </div>

              <div className="max-w-[600px] w-full mx-auto mt-10 px-4">
                <div className="relative w-full pb-[56.25%] h-0 overflow-hidden shadow-xl">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/kwajGch9cKA"
                    title="YouTube video"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="divider max-w-md mx-auto"></div>
            <h2 className="text-base-content text-3xl text-center py-8 italic">
              Tips tambahan...
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <figure>
                <Image
                  src="/images/light-bulb.png"
                  alt="Light bulb"
                  width={300}
                  height={300}
                  aria-hidden="true"
                  className="mx-auto"
                />
                <figcaption className="text-center">
                  <Link
                    href="https://lovepik.com/images/png-bulb.html"
                    className="text-xs italic"
                  >
                    Bulb Png vectors by Lovepik.com
                  </Link>
                </figcaption>
              </figure>

              <div className="flex flex-col self-center gap-6">
                <div>
                  <h3 className="text-base-content text-xl font-semibold">
                    Jaga konsistensi rasio kompos sesuai yang direkomendasikan!
                  </h3>
                  <p>
                    Sebelum wadah penuh, kamu akan terus menambahkan sisa sampah
                    dapur (yang layak), sebaiknya tetap menjaga bahwa bahan yang
                    dimasukkan telah sama dengan perhitungan rasio komposisi
                    sebelumnya agar tidak mengganggu proses komposting yang
                    dimasukkan sebelumnya.
                  </p>
                </div>
                <div>
                  <h3 className="text-base-content text-xl font-semibold">
                    Lakukan pengadukan!
                  </h3>
                  <p>
                    Aduk minimal 1 kali seminggu, sebaiknya diaduk setiap kali
                    memasukkan sampah (yang layak).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
