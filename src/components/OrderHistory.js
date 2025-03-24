import React from 'react';

function OrderHistory({ orders, onReorder, onStatusChange, onCancel }) {
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

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PREPARING': 'bg-blue-100 text-blue-800',
      'READY': 'bg-green-100 text-green-800',
      'DELIVERED': 'bg-gray-100 text-gray-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'PENDING': 'PREPARING',
      'PREPARING': 'READY',
      'READY': 'DELIVERED'
    };
    return statusFlow[currentStatus];
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {orders.slice().reverse().map((order) => (
          <div key={order.number} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold">Commande #{order.number}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>

            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-gray-700">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{((item.finalPrice || item.price) * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
              {order.items.some(item => item.selectedOptions?.length > 0) && (
                <div className="text-sm text-gray-500 ml-4">
                  {order.items.map((item, index) => (
                    item.selectedOptions?.map((opt, optIndex) => (
                      <div key={`${index}-${optIndex}`}>
                        • {opt.label} (+{opt.price.toFixed(2)}€)
                      </div>
                    ))
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{order.total.toFixed(2)}€</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-4">
                {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                  <button
                    onClick={() => onStatusChange(order.number, getNextStatus(order.status))}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {order.status === 'PENDING' && 'Commencer la préparation'}
                    {order.status === 'PREPARING' && 'Marquer comme prêt'}
                    {order.status === 'READY' && 'Marquer comme livré'}
                  </button>
                )}
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => onCancel(order.number)}
                    className="text-red-600 hover:text-red-800 px-4 py-2"
                  >
                    Annuler
                  </button>
                )}
              </div>
              <button
                onClick={() => onReorder(order)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Commander à nouveau
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistory; 