import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "../components/Cart";

const mockCart = [
  {
    name: "Burger Classic",
    price: 8.5,
    options: [
      { label: "Supplément fromage", price: 1 },
      { label: "Supplément bacon", price: 1.5 }
    ],
    quantity: 1,
    finalPrice: 11.0
  },
  {
    name: "Pizza Margherita",
    price: 10,
    selectedOptions: [],
    quantity: 1
  }
];

describe("Cart component", () => {
  it("affiche le total correct avec les options", () => {
  
    render(<Cart cart={mockCart} onRemove={() => {}} />);    
    expect(screen.getByText("1x Burger Classic")).toBeInTheDocument();
    expect(screen.getByText("+ Supplément fromage (1€)")).toBeInTheDocument();
    expect(screen.getByText("+ Supplément bacon (1.5€)")).toBeInTheDocument();
    expect(screen.getByText("1x Pizza Margherita")).toBeInTheDocument();
  
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("21.00€")).toBeInTheDocument();
  });
   

  it("affiche un message si le panier est vide", () => {
    render(<Cart cart={[]} onRemove={() => {}} />);
    expect(screen.getByText("Votre panier est vide")).toBeInTheDocument();
  });

  it("retire un article du panier quand on clique sur le bouton 'Retirer'", () => {
    const mockCart = [
      {
        customId: 1,
        name: "Burger Classic",
        price: 8.5,
        selectedOptions: []
      }
    ];
  
    const mockRemove = jest.fn();
  
    render(<Cart cart={mockCart} onRemove={mockRemove} />);
  
    const button = screen.getByText("Retirer");
    fireEvent.click(button);
  
    expect(mockRemove).toHaveBeenCalledWith(1); // index du premier article
  });

});
