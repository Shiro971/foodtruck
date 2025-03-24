import React, { useState } from 'react';

function Cart({ cart, orders, onRemove, onUpdateQuantity, onOrderSuccess, onStatusChange, onCancel }) {
  const [showPayment, setShowPayment] = useState(false);

  const total = cart.reduce((sum, item) => {
    const itemPrice = item.isPromotional ? 0 : (item.finalPrice || item.price);
    return sum + (itemPrice * item.quantity);
  }, 0);

  const lastOrder = orders && orders.length > 0 ? orders[orders.length - 1] : null;

  // Calculer les économies totales
  const totalSavings = cart.reduce((total, item) => {
    if (item.promotionApplied) {
      return total + (item.originalPrice - item.finalPrice) * (item.quantity || 1);
    }
    return total;
  }, 0);

  console.log('Total des économies:', totalSavings);

  const activePromotions = cart
    .filter(item => item.promotionApplied)
    .map(item => ({
      name: item.promotionApplied,
      saving: (item.originalPrice - item.finalPrice) * (item.quantity || 1)
    }));

  console.log('Promotions actives:', activePromotions);

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

  const handlePayment = () => {
    const orderData = {
      items: cart,
      total: total,
      date: new Date(),
      status: 'PENDING',
      number: `CMD${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*1000)}`
    };
    onOrderSuccess(orderData);
    setShowPayment(false);
  };

  // Extract item rendering logic
  const renderCartItem = (item) => (
    <div key={item.customId || item.id} 
      className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
      <div>
        <span className="font-medium">{item.quantity}x {item.name}</span>
        {item.promotionApplied && (
          <span className="ml-2 text-sm text-green-600">
            ({item.promotionApplied})
          </span>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpdateQuantity(item.customId || item.id, item.quantity - 1)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.customId || item.id, item.quantity + 1)}
            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
          >
            +
          </button>
        </div>
        <div className="flex items-center space-x-2">
          {item.isPromotional ? (
            <>
              <span className="line-through text-gray-400">
                {(item.originalPrice * item.quantity).toFixed(2)}€
              </span>
              <span className="text-green-600 font-medium">0.00€</span>
            </>
          ) : (
            <span>{((item.finalPrice || item.price) * item.quantity).toFixed(2)}€</span>
          )}
        </div>
        <button
          onClick={() => onRemove(item.customId || item.id)}
          className="text-red-600 hover:text-red-800"
        >
          Retirer
        </button>
      </div>
    </div>
  );

  if (cart.length === 0 && lastOrder) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Dernière commande #{lastOrder.number}</h3>
          
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              lastOrder.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
              lastOrder.status === 'READY' ? 'bg-green-100 text-green-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {getStatusLabel(lastOrder.status)}
            </span>
          </div>

          <div className="space-y-2">
            {lastOrder.items.map((item, index) => (
              <div key={index} className="flex justify-between text-gray-700">
                <span>{item.quantity}x {item.name}</span>
                <span>{((item.finalPrice || item.price) * item.quantity).toFixed(2)}€</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{lastOrder.total.toFixed(2)}€</span>
            </div>
          </div>

          {lastOrder.status === 'PENDING' && (
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => onCancel(lastOrder.number)}
                className="px-4 py-2 text-red-600 hover:text-red-800"
              >
                Annuler
              </button>
              <button
                onClick={() => onStatusChange(lastOrder.number, 'PREPARING')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Confirmer
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-gray-500">
          Votre panier est vide. Ajoutez des articles pour passer une nouvelle commande.
        </p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Votre panier est vide
      </div>
    );
  }

  // Affichage du panier avec les articles
  return (
    <div className="space-y-6">
      {showPayment ? (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Confirmation de commande</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.customId || item.id} className="flex justify-between">
                  <div>
                    <span>{item.quantity}x {item.name}</span>
                    {item.promotionApplied && (
                      <span className="ml-2 text-green-600 text-sm">
                        ({item.promotionApplied})
                      </span>
                    )}
                  </div>
                  <span>{((item.finalPrice || item.price) * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200 font-bold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowPayment(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Retour
            </button>
            <button
              onClick={handlePayment}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Confirmer et payer
            </button>
          </div>
        </div>
      ) : (
        <>
          {cart.map((item) => {
            console.log('Rendu item:', item);
            return renderCartItem(item);
          })}

          {/* Promotions - Affichées une seule fois */}
          {activePromotions.length > 0 && (
            <div className="border-t pt-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">🎉 Promotions appliquées</h3>
              {activePromotions.map((promo, index) => (
                <div key={index} className="text-sm text-gray-600">
                  <p>{promo.name}</p>
                  <p className="text-green-600">Économie : {promo.saving.toFixed(2)}€</p>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>{total.toFixed(2)}€</span>
            </div>
            {totalSavings > 0 && (
              <p className="text-green-600 text-sm mt-1">
                Économie totale : {totalSavings.toFixed(2)}€
              </p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={() => setShowPayment(true)}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700"
            >
              Passer la commande
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
