import React, { useState, useEffect } from "react";

function AddEditItem({ onSave, itemToEdit, cancelEdit }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState({ label: "", price: "" });

  const categories = [
    "Burgers",
    "Tacos",
    "Wraps",
    "Accompagnements",
    "Boissons"
  ];

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setPrice(itemToEdit.price.toString());
      setCategory(itemToEdit.category);
      setIngredients(itemToEdit.ingredients.join(", "));
      setOptions(itemToEdit.options || []);
    }
  }, [itemToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: itemToEdit?.id || Date.now(),
      name,
      price: parseFloat(price),
      category,
      ingredients: ingredients.split(",").map(i => i.trim()).filter(i => i),
      options
    };
    onSave(newItem);
    setName("");
    setPrice("");
    setCategory("");
    setIngredients("");
    setOptions([]);
  };

  const addOption = () => {
    if (newOption.label && newOption.price) {
      setOptions([...options, { ...newOption, price: parseFloat(newOption.price) }]);
      setNewOption({ label: "", price: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
          Catégorie
        </label>
        <select
          id="category"  // Ajout de l'ID
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          required
          placeholder="Category"
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="platename">
          Nom du plat
        </label>
        <input
        id="platename"  // Ajout de l'ID
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          required
          placeholder="PlateName"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
          Prix (€)
        </label>
        <input
        id="price"  // Ajout de l'ID
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          required
          placeholder="Price"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ingredients">
          Ingrédients (séparés par des virgules)
        </label>
        <textarea
        id="ingredients"  // Ajout de l'ID
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          rows="3"
          placeholder="Ingredients"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Options</label>
        {options.map((option, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span>{option.label} (+{option.price}€)</span>
            <button
              type="button"
              onClick={() => setOptions(options.filter((_, i) => i !== index))}
              className="text-red-600 hover:text-red-800"
            >
              Supprimer
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nom de l'option"
            value={newOption.label}
            onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Prix"
            value={newOption.price}
            onChange={(e) => setNewOption({ ...newOption, price: e.target.value })}
            className="w-24 border border-gray-300 rounded-lg px-4 py-2"
          />
          <button
            type="button"
            onClick={addOption}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            +
          </button>
        </div>
      </div>
 
      <div className="flex justify-end space-x-4 pt-4">
        {itemToEdit && (
          <button
            type="button"
            onClick={cancelEdit}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          {itemToEdit ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}

export default AddEditItem;
