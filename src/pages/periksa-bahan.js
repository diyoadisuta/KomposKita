import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { imageUrlToBlob } from '@/utils';
import { SelectedList } from '@/components/SelectedList';
import { CustomAlert } from '@/components/CustomAlert';
import { useAlert } from '@/hooks/useAlert';
import { RecommendationCard } from '@/components/RecommedationCard';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function Rekomendasi() {
  const { user } = useCurrentUser();
  const [materials, setMaterials] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [tempMaterial, setTempMaterial] = useState(null);
  const [tempWeight, setTempWeight] = useState('');

  const imageInput = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [showCamera, setShowCamera] = useState(false);

  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successAlert, setSuccessAlert] = useAlert();
  const [messageAlert, setMessageAlert] = useAlert();
  const [userAlert, setUserAlert] = useAlert();

  useEffect(() => {
    const fetchMaterials = async () => {
      const response = await fetch('/api/materials');
      const responseJson = await response.json();
      setMaterials(responseJson.data);
    };
    fetchMaterials();
  }, []);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  async function onPredictionSubmit(event) {
    event.preventDefault();
    setIsPredicting(true);

    try {
      const input = imageInput.current;
      let file = input.files[0];

      if (!file && imageUrl.startsWith('data:')) {
        const blob = imageUrlToBlob(imageUrl);
        file = new File(
          [blob],
          `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          { type: blob.type }
        );
      }

      const formData = new FormData();
      formData.append('image', file, file.name);

      const response = await fetch('/api/predicts', {
        method: 'POST',
        body: formData,
      });

      const responseJson = await response.json();
      setPredictionResult(responseJson.result.label);
    } catch (error) {
      console.error('prediction: error:', error);
    } finally {
      setIsPredicting(false);
    }
  }

  const handleImageUpload = () => {
    const input = imageInput.current;
    const file = input.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }

    return;
  };

  const handleCameraClick = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      setImageUrl(canvas.toDataURL('image/jpeg'));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const selectedTempMaterialHandler = (event) => {
    const materialId = event.target.value;

    if (materialId) {
      const current = materials.find((material) => material.id == materialId);
      setTempMaterial(current);
    } else {
      setTempMaterial(null);
    }
  };

  const addTempMaterialToList = () => {
    if (!tempMaterial || !tempWeight) return;

    const newEntry = { ...tempMaterial, weight: tempWeight };
    setSelectedMaterials((previous) => [...previous, newEntry]);

    setTempMaterial(null);
    setTempWeight('');
    setImageUrl('');
    setPredictionResult('');

    if (imageInput.current) {
      imageInput.current.value = null;
    }
  };

  const getMaterialsByCategory = () => {
    let filteredMaterials = materials;
    const currentResult = predictionResult;

    if (currentResult == 'Sampah Organik Basah (LAYAK KOMPOS)') {
      filteredMaterials = materials.filter(
        (material) => material.category == 'wet organic'
      );
    } else if (currentResult == 'Sampah Organik Kering (LAYAK KOMPOS)') {
      filteredMaterials = materials.filter(
        (material) => material.category == 'dry organic'
      );
    } else {
      filteredMaterials = [];
    }

    return filteredMaterials;
  };

  const deleteListHandler = (materialId) => {
    setSelectedMaterials((currentMaterial) =>
      currentMaterial.filter((material) => material.id !== materialId)
    );

    setRecommendations(null);
  };

  const editListHandler = (materialId, newWeight) => {
    setSelectedMaterials((currentMaterial) =>
      currentMaterial.map((material) =>
        material.id == materialId
          ? { ...material, weight: newWeight }
          : material
      )
    );

    setRecommendations(null);
  };

  const calculationHandler = (event) => {
    event.preventDefault();

    if (!selectedMaterials || selectedMaterials.length === 0) {
      setMessageAlert('error', 'Silahkan tambah list dahulu');
      return;
    }

    let totalCarbon = 0;
    let totalNitrogen = 0;
    let totalWeight = 0;

    selectedMaterials.forEach((material) => {
      const weight = parseFloat(material.weight);
      const carbon = parseFloat(material.carbon);
      const nitrogen = parseFloat(material.nitrogen);

      totalCarbon += carbon * weight;
      totalNitrogen += nitrogen * weight;
      totalWeight += weight;
    });

    const cnRatio = totalNitrogen > 0 ? totalCarbon / totalNitrogen : null;

    const idealCNRatio = 30;
    const minCNRatio = 25;
    const maxCNRatio = 35;

    let recommendation = {
      isRecommended: false,
      status: '',
      message: '',
      cnRatio: cnRatio,
      idealRatio: idealCNRatio,
      details: {
        totalWeight: totalWeight.toFixed(2),
        totalCarbon: totalCarbon.toFixed(2),
        totalNitrogen: totalNitrogen.toFixed(2),
      },
    };

    if (cnRatio >= minCNRatio && cnRatio <= maxCNRatio) {
      recommendation.isRecommended = true;
      recommendation.status = 'ideal';
      recommendation.message = `Rasio C:N ideal (${cnRatio.toFixed(
        2
      )}:1). Berada dalam rentang ideal untuk komposting!`;
    } else if (cnRatio < minCNRatio) {
      recommendation.isRecommended = false;
      recommendation.status = 'too_low';
      recommendation.message = `Rasio C:N terlalu rendah (${cnRatio.toFixed(
        2
      )}:1) Kemungkinan kompos akan berbau dan proses akan lambat.`;
    } else {
      recommendation.isRecommended = false;
      recommendation.status = 'too_high';
      recommendation.message = `Rasio C:N terlalu tinggi (${cnRatio.toFixed(
        2
      )}:1) Kemungkinan dapat dikompos namun proses akan lebih lambat.`;
    }

    setRecommendations(recommendation);
  };

  const handleSave = async () => {
    if (!user) {
      setUserAlert('error', 'Silahkan masuk terlebih dahulu!');
      return;
    }

    if (!recommendations || !selectedMaterials) {
      return;
    }

    setIsSaving(true);

    try {
      const details = selectedMaterials.map((material) => ({
        materialId: material.id,
        weight: parseFloat(material.weight),
        calculatedCn: recommendations.cnRatio
          ? parseFloat(recommendations.cnRatio.toFixed(2))
          : 0,
      }));

      const response = await fetch('/api/saved-calculations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          details: details,
        }),
      });

      const responseJson = await response.json();

      if (response.ok) {
        setSuccessAlert('success', 'Berhasil disimpan');
      } else {
        throw new Error(responseJson.message || 'Failed to save calculation');
      }
    } catch (error) {
      console.error('Error saving calculation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>Periksa kelayakan dan Hitung Bahan</title>
      </Head>

      <div className="min-h-[100vh]">
        <div className=" bg-amber-800 min-h-[220px] flex items-center justify-center p-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Periksa kelayakan dan Hitung Bahan Komposting
          </h1>
        </div>

        <section>
          <div className="container mx-auto px-4 py-12">
            {/* Photo Upload Section */}
            <div className="card sm:max-w-xl md:max-w-4xl mx-auto shadow-md">
              <div className="card-body">
                <h2 className="text-xl font-semibold mb-4">Upload Foto</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={() => imageInput.current?.click()}
                    className="btn btn-primary rounded-md"
                  >
                    Upload foto
                  </button>
                  <button
                    onClick={handleCameraClick}
                    className="btn btn-primary rounded-md"
                  >
                    Buka kamera
                  </button>
                </div>

                {imageUrl && (
                  <div className="mt-4">
                    <Image
                      src={imageUrl}
                      alt="Uploaded waste"
                      width={400}
                      height={300}
                      name="image"
                      className="rounded-lg"
                    />
                  </div>
                )}

                <form onSubmit={onPredictionSubmit}>
                  <input
                    type="file"
                    ref={imageInput}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {imageUrl && (
                    <button
                      className="btn btn-outline rounded-md mt-2"
                      type="submit"
                    >
                      {isPredicting ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        ''
                      )}
                      Dapatkan hasil prediksi
                    </button>
                  )}
                </form>

                {predictionResult && (
                  <div>
                    <p
                      className={`font-bold ${
                        predictionResult == 'Sampah Tidak Layak Kompos'
                          ? 'text-red-500'
                          : 'text-green-500'
                      }`}
                    >
                      {predictionResult}
                    </p>
                  </div>
                )}

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
                        onClick={captureImage}
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

                <div className="flex flex-row flex-wrap gap-4">
                  <div className="md:max-w-sm">
                    <label className="label-text" htmlFor="materials">
                      Jenis sisa sampah
                    </label>
                    <select
                      className="select rounded-sm md:min-w-xs"
                      id="materials"
                      value={tempMaterial?.id || ''}
                      onChange={(e) => {
                        selectedTempMaterialHandler(e);
                      }}
                    >
                      <option value="">— Pilih nama sisa sampah —</option>
                      {getMaterialsByCategory().map((material) => (
                        <option key={material.id} value={material.id}>
                          {material.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:max-w-sm">
                    <label className="label-text" htmlFor="weight">
                      Berat (kg)
                    </label>
                    <input
                      type="number"
                      placeholder="0.5"
                      className="input rounded-sm sm:max-w-20"
                      id="weight"
                      value={tempWeight}
                      onChange={(e) => {
                        setTempWeight(e.target.value);
                      }}
                    />
                  </div>
                  <div className=" flex items-end">
                    <button
                      className="btn btn-soft item rounded-sm"
                      onClick={addTempMaterialToList}
                    >
                      Tambah ke list
                    </button>
                  </div>

                  <div className="border-base-content/25 w-full overflow-x-auto border">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Jenis Sisa Sampah</th>
                          <th>Berat</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedMaterials &&
                          selectedMaterials.map((material) => (
                            <SelectedList
                              key={material.id}
                              material={material}
                              onDelete={deleteListHandler}
                              onEdit={editListHandler}
                            />
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {messageAlert.type && (
                    <CustomAlert
                      type={messageAlert.type}
                      message={messageAlert.message}
                    />
                  )}

                  <div className="flex flex-col gap-4">
                    <button
                      className="btn btn-soft"
                      onClick={calculationHandler}
                    >
                      Dapatkan hasil perhitungan
                    </button>
                    {recommendations && (
                      <RecommendationCard
                        recommendations={recommendations}
                        onClick={handleSave}
                        isSaving={isSaving}
                      />
                    )}

                    {userAlert.type && (
                      <CustomAlert
                        type={userAlert.type}
                        message={userAlert.message}
                      />
                    )}

                    {successAlert.type && (
                      <CustomAlert
                        type={successAlert.type}
                        message={successAlert.message}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
