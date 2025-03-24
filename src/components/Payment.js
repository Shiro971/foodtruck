import React, { useState } from 'react';

function Payment({ total, onPaymentSuccess, onCancel }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simuler un appel API de paiement
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onPaymentSuccess(paymentMethod);
    } catch (error) {
      alert('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Paiement</h2>
      <div className="mb-6">
        <p className="text-lg font-semibold">Total à payer : {total.toFixed(2)}€</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Mode de paiement</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="card">Carte bancaire</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        {paymentMethod === 'card' && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Numéro de carte</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border rounded-lg"
                maxLength="19"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Date d'expiration</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/AA"
                  className="w-full p-2 border rounded-lg"
                  maxLength="5"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full p-2 border rounded-lg"
                  maxLength="3"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
          >
            {isProcessing ? 'Traitement...' : 'Payer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Payment;
