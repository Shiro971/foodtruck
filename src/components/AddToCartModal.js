import React, { useState } from "react";

function AddToCartModal({ item, onAdd, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleOptionToggle = (option) => {
    if (selectedOptions.find(opt => opt.label === option.label)) {
      setSelectedOptions(selectedOptions.filter(opt => opt.label !== option.label));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const calculateTotal = () => {
    const basePrice = item.price * quantity;
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0) * quantity;
    return (basePrice + optionsPrice).toFixed(2);
  };

  const handleSubmit = () => {
    const customizedItem = {
      ...item,
      quantity,
      selectedOptions,
      specialInstructions,
      finalPrice: (parseFloat(calculateTotal()) / quantity),
      customId: `${item.id}-${Date.now()}` // Pour différencier les items personnalisés
    };
    onAdd(customizedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">Ajouter au panier</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Quantité */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantité
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              -
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        {/* Options */}
        {item.options && item.options.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {item.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedOptions.some(opt => opt.label === option.label)}
                    onChange={() => handleOptionToggle(option)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="flex-1">{option.label}</span>
                  <span className="text-gray-600">+{option.price.toFixed(2)}€</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Instructions spéciales */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructions spéciales
          </label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            rows="2"
            placeholder="Ex: Sans oignon, sauce à part..."
          />
        </div>

        {/* Total et boutons */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-red-600">
              {calculateTotal()}€
            </span>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToCartModal;
