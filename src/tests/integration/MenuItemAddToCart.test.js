import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from 'react';
import MenuItem from "../../components/MenuItem";
import AddToCartModal from "../../components/AddToCartModal";

function TestWrapper({ item }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleAddToCart = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <>
      <MenuItem item={item} onAddToCart={handleAddToCart} />
      {showModal && selectedItem && (
        <AddToCartModal 
          item={selectedItem}
          onAdd={jest.fn()}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

describe('Integration MenuItem + AddToCartModal', () => {
  const mockItem = {
    id: 1,
    name: "Burger Deluxe",
    price: 12,
    ingredients: ["steak", "cheddar", "bacon"],
    options: [
      { label: "Double steak", price: 3 },
      { label: "Extra fromage", price: 1 }
    ]
  };

  it('ouvre le modal avec les bonnes options', async () => {
    render(<TestWrapper item={mockItem} />);

    // Clique sur le bouton d'ajout au panier
    fireEvent.click(screen.getByText('Ajouter au panier'));

    // Vérifie que le modal s'ouvre avec les bonnes options
    expect(screen.getByText('Double steak')).toBeInTheDocument();
    expect(screen.getByText('+3.00€')).toBeInTheDocument();
    expect(screen.getByText('Extra fromage')).toBeInTheDocument();
    expect(screen.getByText('+1.00€')).toBeInTheDocument();
  });

  it('permet de sélectionner des options', async () => {
    render(<TestWrapper item={mockItem} />);

    // Ouvre le modal
    fireEvent.click(screen.getByText('Ajouter au panier'));

    // Sélectionne une option en utilisant le parent label qui contient le texte
    const optionLabel = screen.getByText('Double steak').closest('label');
    const checkbox = optionLabel.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox);

    // Vérifie que la case est cochée
    expect(checkbox).toBeChecked();
  });
}); 