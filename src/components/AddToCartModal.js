import React, { useState } from "react";

function AddToCartModal({ item, onAdd, onClose }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleToggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleAddToCart = () => {
    onAdd({ ...item, selectedOptions });
    onClose();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Ajouter {item.name}</h3>
      <p className="text-gray-600 mb-4">Prix de base : {item.price.toFixed(2)}€</p>

      {item.options?.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold text-gray-700 mb-2">Suppléments (optionnels)</p>
          <div className="space-y-2">
            {item.options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="accent-red-600"
                  checked={selectedOptions.includes(opt)}
                  onChange={() => handleToggleOption(opt)}
                />
                <span>{opt.label} (+{opt.price.toFixed(2)}€)</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Annuler
        </button>
        <button
          onClick={handleAddToCart}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow transition duration-200"
        >
          Confirmer
        </button>
      </div>
    </div>
  );
}

export default AddToCartModal;
