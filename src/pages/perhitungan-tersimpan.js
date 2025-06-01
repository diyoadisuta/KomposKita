import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function PerhitunganTersimpan() {
  const [savedCalc, setSavedCalc] = useState([]);

  useEffect(() => {
    const fetchSavedCalc = async () => {
      const response = await fetch('/api/saved-calculations');
      const responseJson = await response.json();
      setSavedCalc(responseJson.data);
    };
    fetchSavedCalc();
  }, []);

  console.log(savedCalc)

  return (
    <>
      <Head>
        <title>Perhitungan tersimpanmu</title>
      </Head>

      <div className="min-h-[120vh]">
        <div className=" min-h-[220px] flex items-center justify-center p-6">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Perhitungan tersimpanmu
          </h1>
        </div>
        <div className="container mx-auto md:min-w-4xl sm:max-w-md border-2 border-gray-100 shadow-sm rounded-sm">
          
        </div>
      </div>
    </>
  );
}
