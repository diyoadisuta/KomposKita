import Image from 'next/image';
import { Timeline } from '@/components/Timeline';
import Link from 'next/link';
import Head from 'next/head';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function Home() {
  const { user, isLoading } = useCurrentUser();

  return (
    <>
      <Head>
        <title>KomposKita - Beranda</title>
      </Head>

      <div className="min-h-120 bg-cover bg-amber-800 bg-center flex items-center p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-[1200px]">
          <div className="flex flex-col self-center text-white">
            {user ? (
              <>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  Selamat datang, {user.fullName}!
                </h1>
                <p className="text-xl">
                  Ayo mulai berkontribusi dalam pelestarian lingkungan dengan
                  membuat kompos dari sampah dapurmu. Dapatkan rekomendasi
                  komposisi terbaik untuk bahan komposmu sekarang!
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  Ayo Membuat Kompos!
                </h1>
                <p className="text-xl">
                  Semua sisa sampah dapur tidak sepenuhnya tidak bermanfaat, ada
                  beberapa sampah dapurmu masih dapat didaur ulang dengan
                  komposting yang menghasilkan kompos yang bermanfaat untuk
                  menyuburkan tanah.
                </p>
              </>
            )}

            <Link
              href="/rekomendasi-komposting"
              className="bg-white text-amber-800 w-fit px-6 py-2 rounded-full font-semibold hover:bg-amber-700 hover:border-amber-950 hover:text-neutral-50 transition duration-300 mt-4"
            >
              Dapatkan Rekomendasi
            </Link>
          </div>

          <Image
            src="/images/composting-banner.png"
            alt="People composting"
            width={500}
            height={500}
            aria-hidden="true"
            className="mx-auto rounded-xl"
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] my-10 p-8">
        <h2 className="text-base-content text-3xl text-center pb-8 italic">
          Apa itu komposting?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Image
            src="/images/people-ask.png"
            alt="People asking"
            width={350}
            height={350}
            aria-hidden="true"
            className="mx-auto"
          />

          <div className="flex flex-col self-center">
            <p className="text-lg">
              Proses alami mendaur ulang bahan organik dan non organik, seperti
              daun, kertas dan sisa makanan, menjadi pupuk berharga (kompos)
              yang dapat menyuburkan tanah dan tanaman. Dengan rasio kedua jenis
              bahan yang tepat akan menghasilkan kompos yang baik. Tidak yakin
              apakah sisa sampahmu layak dikompos? <strong>KomposKita</strong>{' '}
              disini membantumu!
            </p>
          </div>
        </div>

        <h2 className="text-base-content text-3xl text-center py-8 italic">
          Bagaimana langkah-langkahnya?
        </h2>
        <Timeline />

        <h2 className="text-base-content text-3xl text-center py-8 italic border-t-2 border-gray-100 mt-10"></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Image
            src="/images/community-banner.png"
            alt="People asking"
            width={500}
            height={500}
            aria-hidden="true"
            className="mx-auto rounded-xl"
          />

          <div className="flex flex-col self-center">
            <h2 className="text-3xl font-medium text-gray-800 mb-6">
              Bergabung dengan Komunitas
            </h2>
            <p className="text-lg">
              Diskusikan pengalaman komposting Anda, ajukan pertanyaan, dan
              berbagi pengetahuan dengan sesama anggota.
            </p>
            <Link
              href="/forum"
              className="text-white bg-amber-800 w-fit px-6 py-2 rounded-full font-semibold hover:bg-amber-700 transition duration-300 mt-4"
            >
              Forum
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
