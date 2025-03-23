import React, { useState } from "react";
import menuData from "./data/menu.json";
import MenuList from "./components/MenuList";
import AddEditItem from "./components/AddEditItem";
import Cart from "./components/Cart";
import AddToCartModal from "./components/AddToCartModal";
import { applyPromotions } from "./utils/promotions";
import { BarChart3, Sandwich, ShoppingCart, LayoutDashboard } from "lucide-react";

function App() {
  const [menu, setMenu] = useState(menuData);
  const [cart, setCart] = useState([]);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [itemToAdd, setItemToAdd] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");

  const handleAddToCart = (item) => {
    setItemToAdd(item);
    setShowModal(true);
  };

  const handleConfirmAdd = (itemWithOptions) => {
    const updatedCart = [...cart, itemWithOptions];
    const newCart = applyPromotions(updatedCart);
    setCart(newCart);
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    const newCart = applyPromotions(updatedCart);
    setCart(newCart);
  };

  const handleSave = (newItem) => {
    if (itemToEdit) {
      setMenu(menu.map((item) => (item.id === newItem.id ? newItem : item)));
      setItemToEdit(null);
    } else {
      setMenu([...menu, newItem]);
    }
  };

  const handleEdit = (item) => setItemToEdit(item);
  const handleDelete = (id) => setMenu(menu.filter((item) => item.id !== id));
  const cancelEdit = () => setItemToEdit(null);

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-red-600 text-white flex flex-col p-6 space-y-6">
        <div className="flex items-center space-x-2 text-2xl font-bold">
          <Sandwich />
          <span>Foodtruck Admin</span>
        </div>
        <nav className="flex flex-col space-y-4 text-base">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`text-left hover:text-yellow-300 flex items-center space-x-2 ${activeView === "dashboard" ? "text-yellow-300" : ""}`}
          >
            <LayoutDashboard size={18} /> <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView("add")}
            className={`text-left hover:text-yellow-300 flex items-center space-x-2 ${activeView === "add" ? "text-yellow-300" : ""}`}
          >
            <BarChart3 size={18} /> <span>Ajouter un plat</span>
          </button>
          <button
            onClick={() => setActiveView("menu")}
            className={`text-left hover:text-yellow-300 flex items-center space-x-2 ${activeView === "menu" ? "text-yellow-300" : ""}`}
          >
            <Sandwich size={18} /> <span>Menu</span>
          </button>
          <button
            onClick={() => setActiveView("cart")}
            className={`text-left hover:text-yellow-300 flex items-center space-x-2 ${activeView === "cart" ? "text-yellow-300" : ""}`}
          >
            <ShoppingCart size={18} /> <span>Panier</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 space-y-10 overflow-y-auto">
        {(activeView === "dashboard" || activeView === "cart") && (
          <section className="bg-yellow-100 border-2 border-yellow-400 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">🛒 Panier</h2>
            <Cart cart={cart} onRemove={handleRemoveFromCart} />
          </section>
        )}

        {(activeView === "dashboard" || activeView === "add") && (
          <section className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Ajouter / Modifier un plat</h2>
            <AddEditItem onSave={handleSave} itemToEdit={itemToEdit} cancelEdit={cancelEdit} />
          </section>
        )}

        {(activeView === "dashboard" || activeView === "menu") && (
          <section className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Menu</h2>
            <MenuList menu={menu} onEdit={handleEdit} onDelete={handleDelete} onAddToCart={handleAddToCart} />
          </section>
        )}
      </main>

      {/* Modal */}
      {showModal && itemToAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <AddToCartModal
              item={itemToAdd}
              onAdd={handleConfirmAdd}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;