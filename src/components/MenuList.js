import React from "react";

function MenuList({ menu, onAddToCart }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🍽️ Menu</h2>

      {menu.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-gray-200 rounded-xl shadow p-6 space-y-3"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {item.name}
            </h3>
            <span className="text-green-600 font-medium">
              {item.price.toFixed(2)}€
            </span>
          </div>

          <p className="text-gray-600 text-sm">
            <strong>Ingrédients :</strong> {item.ingredients.join(", ")}
          </p>

          {item.options && item.options.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Suppléments :
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {item.options.map((opt, index) => (
                  <li key={index}>
                    {opt.label} (+{opt.price.toFixed(2)}€)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => onAddToCart(item)}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition duration-200"
          >
            🛒 Ajouter au panier
          </button>
        </div>
      ))}
    </div>
  );
}

export default MenuList;
