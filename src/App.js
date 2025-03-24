import React, { useState, useEffect, useMemo } from 'react';
// import MenuList from './components/MenuList'; // Supprimé car non utilisé
import Cart from './components/Cart';
// import OrderTracking from './components/OrderTracking'; // Supprimé car non utilisé
import AddToCartModal from './components/AddToCartModal';
import { validateMenu } from './utils/menuValidation';
import transformedMenu from './utils/menuTransform';
import { BarChart3, Sandwich, ShoppingCart, LayoutDashboard, History } from "lucide-react";
import AddEditItem from "./components/AddEditItem";
import MenuItem from './components/MenuItem';
import Notification from './components/Notification';
import OrderHistory from './components/OrderHistory';
import { PROMOTION_TYPES } from './utils/constants';
import { applyPromotions } from './utils/promotions';
import { v4 as uuidv4 } from 'uuid';

const getStatusLabel = (status) => {
  const labels = {
    'PENDING': '🕒 En attente',
    'PREPARING': '👨‍🍳 En préparation',
    'READY': '✅ Prêt',
    'DELIVERED': '🚚 Livré',
    'CANCELLED': '❌ Annulé'
  };
  return labels[status] || status;
};

function App() {
  const [menu, setMenu] = useState([]);
  const [menuErrors, setMenuErrors] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeView, setActiveView] = useState("menu");
  const [notifications, setNotifications] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  useEffect(() => {
    const errors = validateMenu(transformedMenu);
    if (errors.length > 0) {
      console.error('Erreurs dans le menu:', errors);
      setMenuErrors(errors);
    }
  }, []);

  const filteredMenu = useMemo(() => {
    if (activeView === 'menu') {
      return transformedMenu;
    }
    const category = activeView.replace('category-', '').toUpperCase();
    return transformedMenu.filter(item => item.category === category);
  }, [activeView]);

  const categories = useMemo(() => {
    return Array.from(new Set(transformedMenu.map(item => item.category)));
  }, []);

  const handleAddToCart = (item, hasOptions) => {
    if (hasOptions) {
      setShowModal(true);
      setSelectedItem(item);
    } else {
      const existingItem = cart.find(cartItem => 
        cartItem.id === item.id && !cartItem.selectedOptions
      );
      
      let newCart;
      if (existingItem) {
        newCart = cart.map(cartItem =>
          cartItem.id === item.id && !cartItem.selectedOptions
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
      } else {
        newCart = [...cart, { ...item, quantity: 1 }];
      }

      const { cart: cartWithPromos, promotions } = applyPromotions(newCart);
      setCart(cartWithPromos);

      promotions.forEach(promo => {
        let message;
        switch (promo.type) {
          case PROMOTION_TYPES.FREE_DRINK:
            message = "🎁 Une boisson offerte a été ajoutée à votre panier !";
            break;
          case PROMOTION_TYPES.MENU_DEAL:
            message = `🍔 Menu complet : -${promo.saving}€ !`;
            break;
          case PROMOTION_TYPES.DISCOUNT_PERCENTAGE:
            message = `💰 -${promo.percentage}% sur votre commande !`;
            break;
          default:
            return;
        }
        addNotification(message, 'success');
      });
    }
  };

  const handleCustomizedAdd = (customizedItem) => {
    const customId = `${customizedItem.id}-${Date.now()}`;
    const newCart = [...cart, { ...customizedItem, customId }];
    
    // Appliquer les promotions
    const { cart: cartWithPromos, promotions } = applyPromotions(newCart);
    setCart(cartWithPromos);
    
    // Afficher les notifications de promotions
    promotions.forEach(promo => {
      let message;
      switch (promo.type) {
        case PROMOTION_TYPES.FREE_DRINK:
          message = "🎁 Une boisson offerte a été ajoutée à votre panier !";
          break;
        case PROMOTION_TYPES.DISCOUNT_PERCENTAGE:
          message = `💰 -${promo.percentage}% sur votre commande !`;
          break;
        case PROMOTION_TYPES.MENU_DEAL:
          message = "🍔 Réduction menu appliquée !";
          break;
        default:
          return;
      }
      addNotification(message, 'success');
    });

    setShowModal(false);
    setSelectedItem(null);
  };

  const handleRemoveFromCart = (itemId) => {
    const newCart = cart.filter(item => (item.customId || item.id) !== itemId);
    // Réappliquer les promotions après la suppression
    const { cart: cartWithPromos } = applyPromotions(newCart);
    setCart(cartWithPromos);
  };

  const handleUpdateQuantity = (itemId, newQuantity, forceAdd = false) => {
    if (newQuantity <= 0 && !forceAdd) {
      handleRemoveFromCart(itemId);
    } else {
      let newCart;
      const existingItemIndex = cart.findIndex(item => 
        (item.customId || item.id) === itemId
      );

      if (existingItemIndex !== -1) {
        newCart = cart.map(item => 
          (item.customId || item.id) === itemId
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else if (forceAdd) {
        newCart = [...cart, { ...itemId, quantity: newQuantity }];
      }

      // Appliquer les promotions après la mise à jour de la quantité
      const { cart: cartWithPromos, promotions } = applyPromotions(newCart);
      setCart(cartWithPromos);

      // Notification si une nouvelle promotion est appliquée
      promotions.forEach(promo => {
        if (promo.type === PROMOTION_TYPES.FREE_DRINK) {
          addNotification("🎁 Une boisson offerte a été ajoutée à votre panier !", "success");
        }
      });
    }
  };

  const handleOrderSuccess = (orderData) => {
    const newOrder = {
      ...orderData,
      status: 'PENDING',
      date: new Date(),
      number: `CMD${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000)}`
    };
    setOrders([...orders, newOrder]);
    setCart([]);
  };

  const addNotification = (message, type = 'success') => {
    const id = uuidv4();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleStatusChange = (orderNumber, newStatus) => {
    setOrders(orders.map(order => {
      if (order.number === orderNumber) {
        addNotification(`Commande #${orderNumber} ${getStatusLabel(newStatus).toLowerCase()}`, 'info');
        return { ...order, status: newStatus };
      }
      return order;
    }));
  };

  const handleReorder = (order) => {
    const newCart = order.items.map(item => ({
      ...item,
      customId: `${item.id}-${Date.now()}`
    }));
    setCart(newCart);
    addNotification('Commande ajoutée au panier', 'success');
    setShowHistory(false);
  };

  const handleCancelOrder = (orderNumber) => {
    setOrders(orders.map(order =>
      order.number === orderNumber
        ? { ...order, status: 'CANCELLED' }
        : order
    ));
  };

  const handleSave = (newItem) => {
    const updatedMenu = [...menu];
    
    if (itemToEdit) {
      // Modification d'un article existant
      const categoryIndex = updatedMenu.findIndex(cat => cat.category === newItem.category);
      
      if (categoryIndex === -1) {
        // Si la catégorie n'existe pas, on la crée
        updatedMenu.push({
          category: newItem.category,
          items: [newItem]
        });
      } else {
        // Mise à jour de l'article dans sa catégorie
        const itemIndex = updatedMenu[categoryIndex].items.findIndex(item => item.id === newItem.id);
        if (itemIndex !== -1) {
          updatedMenu[categoryIndex].items[itemIndex] = newItem;
        } else {
          updatedMenu[categoryIndex].items.push(newItem);
        }
      }
    } else {
      // Ajout d'un nouvel article
      const categoryIndex = updatedMenu.findIndex(cat => cat.category === newItem.category);
      
      if (categoryIndex === -1) {
        // Nouvelle catégorie
        updatedMenu.push({
          category: newItem.category,
          items: [newItem]
        });
      } else {
        // Ajout à une catégorie existante
        updatedMenu[categoryIndex].items.push(newItem);
      }
    }
    
    setMenu(updatedMenu);
    setItemToEdit(null);
  };

  const handleEdit = (item) => {
    setItemToEdit(item);
    setActiveView("add");
  };

  const handleDelete = (itemId) => {
    setMenu(menu.map(category => ({
      ...category,
      items: category.items.filter(item => item.id !== itemId)
    })));
    addNotification('Article supprimé avec succès', 'success');
  };

  const cancelEdit = () => setItemToEdit(null);

  if (menuErrors.length > 0) {
    console.error('Erreurs de menu:', menuErrors);
    // Affichez les erreurs dans l'interface utilisateur si nécessaire
  }

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Navbar supérieure */}
      <header className="fixed top-0 w-full bg-red-600 text-white shadow-lg z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Sandwich className="h-8 w-8" />
              <span className="text-2xl font-bold">Le Resto</span>
            </div>
            
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => setActiveView("menu")}
                className={`flex items-center space-x-2 hover:text-yellow-300 ${
                  activeView === "menu" ? "text-yellow-300" : ""
                }`}
              >
                <LayoutDashboard size={20} />
                <span>Menu</span>
              </button>

              <button
                onClick={() => setActiveView("add")}
                className={`flex items-center space-x-2 hover:text-yellow-300 ${
                  activeView === "add" ? "text-yellow-300" : ""
                }`}
              >
                <BarChart3 size={20} />
                <span>Ajouter un plat</span>
              </button>

              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center space-x-2 hover:text-yellow-300"
              >
                <History size={20} />
                <span>Historique</span>
              </button>

              <button
                onClick={() => setActiveView("cart")}
                className={`flex items-center space-x-2 hover:text-yellow-300 relative ${
                  activeView === "cart" ? "text-yellow-300" : ""
                }`}
              >
                <ShoppingCart size={20} />
                <span>Panier</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-4">
        {notifications.map(({ id, message, type }) => (
          <Notification
            key={id}
            id={id}
            message={message}
            type={type}
            onClose={removeNotification}
          />
        ))}
      </div>

      {/* Modal Historique */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Historique des commandes</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <OrderHistory
              orders={orders}
              onReorder={handleReorder}
              onStatusChange={handleStatusChange}
              onCancel={handleCancelOrder}
            />
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="flex-1 mt-16 p-6">
        {activeView === "menu" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Catégories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveView(`category-${category.toLowerCase()}`)}
                  className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{category}</h3>
                  <p className="text-gray-600">
                    {filteredMenu.filter(item => item.category === category).length} articles
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeView.startsWith("category-") && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveView("menu")}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Retour aux catégories
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {activeView.replace("category-", "")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenu.map((item) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {activeView === "add" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ajouter un plat</h2>
            <AddEditItem onSave={handleSave} itemToEdit={itemToEdit} cancelEdit={cancelEdit} />
          </div>
        )}

        {activeView === "cart" && (
          <div className="max-w-2xl mx-auto">
            <Cart
              cart={cart}
              orders={orders}
              onRemove={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onOrderSuccess={handleOrderSuccess}
              onStatusChange={handleStatusChange}
              onCancel={handleCancelOrder}
            />
          </div>
        )}
      </main>

      {/* Modal de personnalisation */}
      {showModal && selectedItem && (
        <AddToCartModal
          item={selectedItem}
          onAdd={handleCustomizedAdd}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}

export default App;