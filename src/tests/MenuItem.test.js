import { render, screen, fireEvent } from "@testing-library/react";
import MenuItem from "../components/MenuItem";

const mockItem = {
  id: 1,
  name: "Tacos Poulet",
  price: 9.5,
  ingredients: ["galette", "poulet", "frites"],
  options: [
    { label: "Sauce fromagère", price: 1 },
    { label: "Viande en plus", price: 2 }
  ]
};

describe("MenuItem component", () => {
  it("affiche correctement les informations du plat", () => {
    render(<MenuItem item={mockItem} onAddToCart={() => {}} />);

    expect(screen.getByText("Tacos Poulet")).toBeInTheDocument();
    expect(screen.getByText("9.50€")).toBeInTheDocument();
    expect(screen.getByText("galette, poulet, frites")).toBeInTheDocument();
  });

  it("appelle onAddToCart avec les bons paramètres", () => {
    const mockAddToCart = jest.fn();
    render(<MenuItem item={mockItem} onAddToCart={mockAddToCart} />);

    const button = screen.getByText("Ajouter au panier");
    fireEvent.click(button);

    expect(mockAddToCart).toHaveBeenCalledWith(mockItem, true);
  });
}); 