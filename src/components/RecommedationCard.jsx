export const RecommendationCard = ({ recommendations, onClick, isSaving }) => {
  return (
    <div className="card sm:max-w-sm">
      <div className="card-header">
        <h5 className="card-title">Hasil Perhitungan</h5>
      </div>
      <div className="card-body">
        <div>
          <p className="font-semibold">
            Berat: {recommendations.details.totalWeight}
          </p>
          <p className="font-semibold">
            Jumlah Karbon: {recommendations.details.totalCarbon}
          </p>
          <p className="font-semibold">
            Jumlah Nitrogen: {recommendations.details.totalNitrogen}
          </p>
          <p className="font-semibold">
            Rasio:{' '}
            {recommendations.cnRatio
              ? `${recommendations.cnRatio.toFixed(2)}:1`
              : 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-2">Target ideal: 25-35:1</p>

          {recommendations.isRecommended ? (
            <p className="text-green-500 font-semibold">✅ Direkomendasikan</p>
          ) : (
            <p className="text-red-500 font-semibold">⚠️ Tidak disarankan</p>
          )}
        </div>

        <p className="font-medium mb-2">{recommendations.message}</p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onClick}
            disabled={isSaving}
            className="btn btn-primary"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Perhitungan'}
          </button>
        </div>
      </div>
    </div>
  );
};
