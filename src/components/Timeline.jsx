import Link from 'next/link';
import Image from 'next/image';

export const Timeline = () => {
  return (
    <>
      <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical timeline-centered">
        <li>
          <div className="timeline-middle h-16">
            <span className="bg-info/20 flex size-8 items-center justify-center rounded-full font-semibold">
              1
            </span>
          </div>
          <div className="timeline-start me-4 mt-8 max-md:pt-2"></div>
          <div className="timeline-end ms-4 mb-8">
            <div className="card">
              <div className="card-body gap-4">
                <h5 className="card-title text-lg">
                  Menuju halaman periksa kelayakan dan kalkulator
                </h5>
                <div className="card-actions">
                  <Link href="/periksa-bahan" className="btn btn-sm btn-soft">
                    Klik disini
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </li>

        <li className="timeline-shift">
          <div className="timeline-middle h-16">
            <span className="bg-info/20 flex size-8 items-center justify-center rounded-full font-semibold">
              2
            </span>
          </div>
          <div className="timeline-start me-4 mb-8">
            <div className="card">
              <div className="card-body gap-4">
                <h5 className="card-title text-lg">
                  Upload foto sampahmu dan tunggu hasil kelayakannya
                </h5>
                <div className="flex flex-wrap gap-4">
                  <Image
                    src="/images/guide-ss1.jpg"
                    width={400}
                    height={400}
                    alt="foto guide step 1"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
        </li>

        <li>
          <div className="timeline-middle h-16">
            <span className="bg-info/20 flex size-8 items-center justify-center rounded-full font-semibold">
              3
            </span>
          </div>
          <div className="timeline-end ms-4 mb-8">
            <div className="card">
              <div className="card-body gap-4">
                <h5 className="card-title text-lg">
                  Masukkan data sampah yang layak
                </h5>
                <p>
                  Setelah mendapatkan hasil kelayakan, masukkan data sampah
                  tersebut dan klik tombol hitung. Setelah itu kamu akan
                  mendapatkan rekomendasi berat untuk bahan kompos jika hasil
                  kalkulasi berat kurang optimal.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Image
                    src="/images/guide-ss2.jpg"
                    width={400}
                    height={400}
                    alt="foto guide step 1"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
        </li>

        <li className="timeline-shift">
          <div className="timeline-middle h-16">
            <span className="bg-info/20 flex size-8 items-center justify-center rounded-full font-semibold">
              4
            </span>
          </div>
          <div className="timeline-start me-4 mb-8 w-full">
            <div className="card">
              <div className="card-body gap-4">
                <h5 className="card-title text-lg">Simpan hasil rekomendasi</h5>
                <p>
                  Belum memutuskan untuk komposting sekarang? tidak perlu
                  khawatir! kamu dapat menyimpannya untuk nanti.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Image
                    src="/images/guide-ss3.jpg"
                    width={400}
                    height={400}
                    alt="foto guide step 1"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
        </li>

        <li>
          <div className="timeline-middle h-16">
            <span className="bg-info/20 flex size-8 items-center justify-center rounded-full font-semibold">
              5
            </span>
          </div>
          <div className="timeline-end ms-4">
            <div className="card">
              <div className="card-body gap-4">
                <h5 className="card-title text-lg">Informasi lainnya</h5>
                <p>
                  Kami memiliki informasi lebih untuk kamu jika sudah memutuskan
                  untuk memulai. Klik dibawah ini!
                </p>
                <div className="card-actions">
                  <Link href="/informasi" className="btn btn-soft btn-sm">
                    Informasi
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </li>
      </ul>
    </>
  );
};
