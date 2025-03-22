import { render, screen, fireEvent } from "@testing-library/react";
import MenuList from "../components/MenuList";

const mockMenu = [
  {
    id: 1,
    name: "Tacos Poulet",
    price: 9.5,
    ingredients: ["galette", "poulet", "frites"],
    options: [
      { label: "Sauce fromagère", price: 1 },
      { label: "Viande en plus", price: 2 }
    ]
  },
  {
    id: 2,
    name: "Boisson Canette",
    price: 2,
    ingredients: ["au choix : Coca, Ice Tea, Oasis"],
    options: []
  }
];

describe("MenuList component", () => {
  it("affiche tous les plats du menu", () => {
    render(<MenuList menu={mockMenu} onAddToCart={() => {}} />);

    expect(screen.getByText("Tacos Poulet")).toBeInTheDocument();
    expect(screen.getByText("9.50€")).toBeInTheDocument();
    expect(screen.getByText("Boisson Canette")).toBeInTheDocument();
    expect(screen.getByText("2.00€")).toBeInTheDocument();

    expect(screen.getByText("Suppléments :")).toBeInTheDocument();
    expect(screen.getByText("Sauce fromagère (+1.00€)")).toBeInTheDocument();
  });

  it("appelle onAddToCart lorsqu'on clique sur Ajouter au panier", () => {
    const mockFn = jest.fn();
    render(<MenuList menu={mockMenu} onAddToCart={mockFn} />);

    const button = screen.getAllByText("🛒 Ajouter au panier")[0];
    fireEvent.click(button);

    expect(mockFn).toHaveBeenCalledWith(mockMenu[0]);
  });
});
