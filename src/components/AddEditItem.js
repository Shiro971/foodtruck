import React, { useState, useEffect } from "react";

function AddEditItem({ onSave, itemToEdit, cancelEdit }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState("");

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setPrice(itemToEdit.price);
      setIngredients(itemToEdit.ingredients.join(", "));
    }
  }, [itemToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: itemToEdit?.id || Date.now(),
      name,
      price: parseFloat(price),
      ingredients: ingredients.split(",").map((i) => i.trim())
    };
    onSave(newItem);
    setName("");
    setPrice("");
    setIngredients("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        {itemToEdit ? "Modifier un plat" : "Ajouter un plat"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Nom du plat</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Burger Classic"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Prix (€)</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="8.50"
          required
          type="number"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Ingrédients</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="pain, steak, fromage, salade"
          required
        />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow transition duration-200"
          type="submit"
        >
          {itemToEdit ? "Enregistrer" : "Ajouter"}
        </button>
        {itemToEdit && (
          <button
            onClick={cancelEdit}
            type="button"
            className="text-gray-600 hover:text-gray-900 underline"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

export default AddEditItem;
