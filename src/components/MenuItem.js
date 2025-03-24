import React from "react";
import { Pencil, Trash2 } from 'lucide-react';

function MenuItem({ item, onAddToCart, onEdit, onDelete }) {
  const hasOptions = item.options && item.options.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg relative group">
      {/* Actions administrateur */}
      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          className="p-2 bg-yellow-100 rounded-full hover:bg-yellow-200 text-yellow-600"
          title="Modifier"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
              onDelete(item.id);
            }
          }}
          className="p-2 bg-red-100 rounded-full hover:bg-red-200 text-red-600"
          title="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
        
        <div className="text-sm text-gray-600 mb-4">
          {item.ingredients && item.ingredients.join(', ')}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-red-600">
            {item.price.toFixed(2)}€
          </span>
          
          <button
            onClick={() => onAddToCart(item, hasOptions)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItem;
