import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "../components/Cart";

const mockCart = [
  {
    name: "Burger Classic",
    price: 8.5,
    selectedOptions: [
      { label: "Supplément fromage", price: 1 },
      { label: "Supplément bacon", price: 1.5 }
    ]
  }
];

describe("Cart component", () => {
  it("affiche un article avec ses suppléments et le total", () => {
    render(<Cart cart={mockCart} onRemove={() => {}} />);
    expect(screen.getByText("Burger Classic")).toBeInTheDocument();
    expect(screen.getByText("+ Supplément fromage (1.00€)")).toBeInTheDocument();
    expect(screen.getByText("+ Supplément bacon (1.50€)")).toBeInTheDocument();

    // on teste les deux éléments séparément
    expect(screen.getByText("Total :")).toBeInTheDocument();
    expect(screen.getByText("11.00€")).toBeInTheDocument();
  });

  it("affiche un message si le panier est vide", () => {
    render(<Cart cart={[]} onRemove={() => {}} />);
    expect(screen.getByText("Votre panier est vide.")).toBeInTheDocument();
  });

  it("retire un article du panier quand on clique sur le bouton 'Retirer'", () => {
    const mockCart = [
      {
        name: "Burger Classic",
        price: 8.5,
        selectedOptions: []
      }
    ];
  
    const mockRemove = jest.fn();
  
    render(<Cart cart={mockCart} onRemove={mockRemove} />);
  
    const button = screen.getByText("Retirer");
    fireEvent.click(button);
  
    expect(mockRemove).toHaveBeenCalledWith(0); // index du premier article
  });

});
