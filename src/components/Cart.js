import React from "react";

function Cart({ cart, onRemove }) {
  const total = cart.reduce((sum, item) => {
    const base = item.price;
    const supplements = item.selectedOptions?.reduce((s, opt) => s + opt.price, 0) || 0;
    return sum + base + supplements;
  }, 0);

  return (
    <div className="border-t border-gray-300 pt-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Panier</h2>

      {cart.length === 0 ? (
        <p className="text-gray-600 italic">Votre panier est vide.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((item, index) => (
            <li
              key={index}
              className="bg-gray-100 rounded-lg p-4 shadow-sm flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{item.name}</span>
                <span>{item.price.toFixed(2)}€</span>
              </div>

              {item.selectedOptions && item.selectedOptions.length > 0 && (
                <ul className="text-sm text-gray-700 ml-4">
                  {item.selectedOptions.map((opt, i) => (
                    <li key={i}>
                      + {opt.label} ({opt.price.toFixed(2)}€)
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => onRemove(index)}
                className="self-start text-sm text-red-600 hover:underline mt-2"
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Total :</h3>
        <span className="text-xl font-bold text-green-600">{total.toFixed(2)}€</span>
      </div>

      {cart.length > 0 && (
        <button
          onClick={() => alert("Commande validée !")}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow transition duration-200"
        >
          ✅ Valider la commande
        </button>
      )}
    </div>
  );
}

export default Cart;
