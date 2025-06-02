import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function PerhitunganTersimpan() {
  const [savedCalc, setSavedCalc] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchSavedCalc = async () => {
      try {
        const response = await fetch('/api/saved-calculations');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseJson = await response.json();
        setSavedCalc(responseJson.data || []);
      } catch (err) {
        console.error('Error fetching calculations:', err);
        setError(err.message || 'Failed to fetch calculations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedCalc();
  }, []);

  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/saved-calculations/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete calculation');
      }

      // Remove the deleted calculation from the state
      setSavedCalc((prev) => prev.filter((calc) => calc.id !== deleteId));
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Error deleting calculation:', err);
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[120vh] flex items-center justify-center">
        <div className="text-center py-4">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[120vh] flex items-center justify-center">
        <div className="text-red-500 text-center py-4">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Perhitungan tersimpanmu</title>
      </Head>

      <div className="min-h-[120vh] bg-gray-50">
        <div className="min-h-[220px] flex items-center justify-center p-6 bg-amber-800 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Perhitungan Tersimpanmu
          </h1>
        </div>
        <div className="container mx-auto max-w-3xl py-8 px-4">
          {!Array.isArray(savedCalc) || savedCalc.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Belum ada perhitungan
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Mulai hitung komposisi bahan kompos anda
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedCalc.map((calc) => (
                <details
                  key={calc.id}
                  className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Perhitungan{' '}
                          {new Date(calc.createdAt).toLocaleDateString('id-ID')}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {calc.calculationDetails.length} bahan kompos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(calc.id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Hapus perhitungan"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <svg
                        className="w-5 h-5 text-gray-500 transform transition-transform duration-200 group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </summary>
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className="space-y-2">
                      {calc.calculationDetails.map((item) => (
                        <div
                          key={item.materialId}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-green-200 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="font-medium text-gray-900">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded-full text-sm">
                              {item.weight} kg
                            </span>

                            {item.calculatedCn < 25 ||
                            item.calculatedCn > 35 ? (
                              <span className="px-2.5 py-0.5 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                                C/N: {item.calculatedCn}
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                C/N: {item.calculatedCn}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Konfirmasi Penghapusan
            </h3>
            <p className="text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus perhitungan ini? Tindakan ini
              tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
