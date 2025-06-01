import { useState } from 'react';
import { CustomButton } from './CustomButton';
import { faPenToSquare, faMinus } from '@fortawesome/free-solid-svg-icons';

export function SelectedList({ material, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editWeight, setEditWeight] = useState(material.weight);

  const handleSave = () => {
    if (!editWeight || parseFloat(editWeight) <= 0) {
      alert('Berat harus lebih dari 0');
      return;
    }
    onEdit(material.id, editWeight);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditWeight(material.weight);
    setIsEditing(false);
  };

  return (
    <tr>
      <td>{material.name}</td>
      <td>
        {isEditing ? (
          <input
            type="number"
            value={editWeight}
            onChange={(e) => setEditWeight(e.target.value)}
            className="input input-sm rounded-sm max-w-20"
            step="0.1"
            min="0.1"
          />
        ) : (
          `${material.weight} kg`
        )}
      </td>
      <td>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="btn btn-sm btn-success rounded-sm"
              title="Simpan"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="btn btn-sm btn-outline rounded-sm"
              title="Batal"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <CustomButton
              onClick={() => setIsEditing(true)}
              icon={faPenToSquare}
            />
            <CustomButton
              onClick={() => onDelete(material.id)}
              icon={faMinus}
            />
          </div>
        )}
      </td>
    </tr>
  );
}
