import React, { useState } from 'react';
import MenuItem from './MenuItem';

function Dashboard({ menu, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="flex gap-6">
      {/* Sidebar des catégories */}
      <div className="w-64 bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🍽️ Catégories</h2>
        <div className="space-y-2">
          {menu.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category.category)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                selectedCategory === category.category
                  ? 'bg-red-600 text-white'
                  : 'hover:bg-red-50 text-gray-700'
              }`}
            >
              {getCategoryEmoji(category.category)} {category.category}
              <span className="float-right text-sm">
                ({category.items.length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Zone d'affichage des articles */}
      <div className="flex-1">
        {selectedCategory ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {getCategoryEmoji(selectedCategory)} {selectedCategory}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menu
                .find(cat => cat.category === selectedCategory)
                ?.items.map((item, index) => (
                  <MenuItem
                    key={item.id || index}
                    item={item}
                    onAddToCart={onAddToCart}
                  />
                ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-400">
              👈 Sélectionnez une catégorie
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

// Fonction helper pour obtenir l'emoji correspondant à chaque catégorie
function getCategoryEmoji(category) {
  const emojis = {
    'Burgers': '🍔',
    'Tacos': '🌮',
    'Wraps': '🌯',
    'Accompagnements': '🍟',
    'Boissons': '🥤',
    'Desserts': '🍰'
  };
  return emojis[category] || '🍽️';
}

export default Dashboard; 