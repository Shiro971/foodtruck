import { render, screen, fireEvent } from "@testing-library/react";
import AddEditItem from "../components/AddEditItem";

describe("AddEditItem component", () => {
  it("ajoute un nouveau plat avec les données remplies", () => {
    const mockOnSave = jest.fn();
    render(<AddEditItem onSave={mockOnSave} itemToEdit={null} cancelEdit={() => {}} />);

    // Utilise les vrais placeholders
    fireEvent.change(screen.getByPlaceholderText("Burger Classic"), {
      target: { value: "Tacos Poulet" }
    });
    fireEvent.change(screen.getByPlaceholderText("8.50"), {
      target: { value: "9.5" }
    });
    fireEvent.change(screen.getByPlaceholderText("pain, steak, fromage, salade"), {
      target: { value: "galette, poulet, frites" }
    });

    fireEvent.click(screen.getByText("Ajouter"));

    expect(mockOnSave).toHaveBeenCalledWith({
      id: expect.any(Number),
      name: "Tacos Poulet",
      price: 9.5,
      ingredients: ["galette", "poulet", "frites"]
    });
  });
});
