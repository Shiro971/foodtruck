import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from 'react';
import MenuItem from "../../components/MenuItem";
import AddToCartModal from "../../components/AddToCartModal";
import Cart from "../../components/Cart";
import { CATEGORIES } from "../../utils/constants";

function TestWrapper() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Burger Classic",
      price: 8.50,
      category: "BURGER",
      quantity: 1,
      originalPrice: 8.50
    },
    {
      id: 2,
      name: "Frites",
      price: 3.50,
      category: "FRIES",
      quantity: 1,
      originalPrice: 3.50
    },
    {
      id: 3,
      name: "Coca-Cola",
      price: 2.00,
      category: "DRINK",
      quantity: 1,
      originalPrice: 2.00
    }
  ]);

  return (
    <Cart
      cart={cart}
      onUpdateQuantity={(id, qty) => {
        setCart(prev => prev.map(item => 
          item.id === id ? { ...item, quantity: qty } : item
        ));
      }}
      onRemove={(id) => setCart(prev => prev.filter(item => item.id !== id))}
      onOrderSuccess={() => {}}
    />
  );
}

describe('Integration Cart + Promotions', () => {
  it('affiche le menu complet avec la promotion appliquée', () => {
    render(<TestWrapper />);

    // Vérifie que tous les articles sont présents
    expect(screen.getByText(/burger classic/i)).toBeInTheDocument();
    expect(screen.getByText(/frites/i)).toBeInTheDocument();
    expect(screen.getByText(/coca-cola/i)).toBeInTheDocument();

    // Vérifie le total (avec promotion menu)
    expect(screen.getByText(/14[.,]00/)).toBeInTheDocument();
  });

  it('met à jour les promotions quand on modifie les quantités', () => {
    render(<TestWrapper />);

    // Augmente la quantité du burger
    const plusButtons = screen.getAllByText('+');
    fireEvent.click(plusButtons[0]); // Premier bouton + (pour le burger)

    // Vérifie le nouveau total avec promotion
    expect(screen.getByText(/22[.,]50/)).toBeInTheDocument();
  });

  it('supprime la promotion quand on retire un article du menu', () => {
    render(<TestWrapper />);

    // Supprime les frites
    const removeButtons = screen.getAllByText('Retirer');
    fireEvent.click(removeButtons[1]); // Second bouton Retirer (pour les frites)

    // Vérifie le total sans promotion
    expect(screen.getByText(/10[.,]50/)).toBeInTheDocument();
  });

  it('applique la promotion boisson gratuite pour commande > 20€', () => {
    render(<TestWrapper />);

    // Augmente la quantité du burger pour dépasser 20€
    const plusButton = screen.getAllByText('+')[0];
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);

    // Vérifie le total avec boisson gratuite
    expect(screen.getByText(/31[.,]00/)).toBeInTheDocument();
  });
}); 