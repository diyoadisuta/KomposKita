import { useState, useRef } from 'react';
import Image from 'next/image';

const categories = [
  { id: 1, name: 'Sisa kulit buah/buah segar' },
  { id: 2, name: 'Sampah sisa dapur' },
  { id: 3, name: 'Kertas/kardus' },
  { id: 4, name: 'Ampas kopi' },
  { id: 5, name: 'Ampas Teh' },
  { id: 6, name: 'Sisa sayur kaya karbohidrat (brokoli/kubis)' },
  { id: 7, name: 'Sisa sayur kaya pati (kentang)' },
  { id: 8, name: 'Ranting/serbuk kayu' },
];

export default function Rekomendasi() {
  const [wasteItems, setWasteItems] = useState([
    { name: '', category: '', weight: '' },
  ]);
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleAddField = () => {
    setWasteItems([...wasteItems, { name: '', category: '', weight: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const newItems = [...wasteItems];
    newItems[index][field] = value;
    setWasteItems(newItems);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleCameraClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      setPhoto(canvas.toDataURL('image/jpeg'));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const handleCalculate = () => {
    // Mock recommendations for demonstration
    const mockRecommendations = {
      userInput: wasteItems.map((item) => ({
        ...item,
        recommended: Math.random() > 0.5,
      })),
      systemRecommendations: wasteItems.map((item) => ({
        ...item,
        recommendedWeight: (Math.random() * 5).toFixed(1),
      })),
    };
    setRecommendations(mockRecommendations);
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving recommendations:', recommendations);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Rekomendasi Komposting
        </h1>

        {/* Photo Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Foto</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Upload Foto
            </button>
            <button
              onClick={handleCameraClick}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Buka Kamera
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {showCamera && (
            <div className="mt-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md rounded-lg"
              />
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={capturePhoto}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Ambil Foto
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Tutup Kamera
                </button>
              </div>
            </div>
          )}

          {photo && (
            <div className="mt-4">
              <Image
                src={photo}
                alt="Uploaded waste"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Input Fields Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Input Sampah</h2>
          <div className="space-y-4">
            {wasteItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <input
                  type="text"
                  placeholder="Nama sampah"
                  value={item.name}
                  onChange={(e) =>
                    handleInputChange(index, 'name', e.target.value)
                  }
                  className="border rounded-md p-2"
                />
                <select
                  value={item.category}
                  onChange={(e) =>
                    handleInputChange(index, 'category', e.target.value)
                  }
                  className="border rounded-md p-2"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Berat (kg)"
                  value={item.weight}
                  onChange={(e) =>
                    handleInputChange(index, 'weight', e.target.value)
                  }
                  className="border rounded-md p-2"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleAddField}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Tambah Field
            </button>
            <button
              onClick={handleCalculate}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Hitung
            </button>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Catatan: Contoh sampah sisa dapur berupa buah/sayuran/kentang dari
              sisa makanan (menuju busuk).
            </p>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Hasil Rekomendasi</h2>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">Input Anda</h3>
              <div className="space-y-2">
                {recommendations.userInput.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span>
                      {item.name} - {item.category} ({item.weight} kg)
                    </span>
                    <span
                      className={
                        item.recommended ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {item.recommended ? '✔️' : '❌'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">Rekomendasi Kami</h3>
              <div className="space-y-2">
                {recommendations.systemRecommendations.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span>
                      {item.name} - {item.category}
                    </span>
                    <span className="text-green-600">
                      Rekomendasi: {item.recommendedWeight} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Simpan Rekomendasi
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
