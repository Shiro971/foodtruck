import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddEditItem from "../components/AddEditItem";

describe("AddEditItem component", () => {
  it("ajoute un nouveau plat avec les données remplies", () => {
    const mockOnSave = jest.fn();
    render(<AddEditItem onSave={mockOnSave} itemToEdit={null} cancelEdit={() => {}} />);

    // Sélection de la catégorie
    fireEvent.change(screen.getByLabelText("Catégorie"), { target: { value: "Tacos" } });

    // Remplissage des champs
    fireEvent.change(screen.getByLabelText("Nom du plat"), { target: { value: "Tacos Poulet" } });
    fireEvent.change(screen.getByLabelText("Prix (€)"), { target: { value: "9.5" } });
    fireEvent.change(screen.getByLabelText("Ingrédients (séparés par des virgules)"), { target: { value: "galette, poulet, frites" } });

    // Ajout d’une option
    fireEvent.change(screen.getByPlaceholderText("Nom de l'option"), { target: { value: "Supplément fromage" } });
    fireEvent.change(screen.getByPlaceholderText("Prix"), { target: { value: "1.00" } });
    fireEvent.click(screen.getByText("+")); // Ajoute l’option

    // Soumission du formulaire
    fireEvent.click(screen.getByText("Ajouter"));
 
    // Vérifications
    expect(mockOnSave).toHaveBeenCalledWith({
      id: expect.any(Number),
      category: "Tacos",
      name: "Tacos Poulet",
      price: 9.5,
      ingredients: ["galette", "poulet", "frites"],
      options: [{ label: "Supplément fromage", price: 1.00 }]
    });
  });
  it("modifie un plat existant avec les données modifiées", () => {
    const itemToEdit = {
      id: 1,
      name: "Burger Classic",
      price: 8.50,
      category: "Burgers",
      ingredients: ["pain", "steak", "fromage", "salade", "sauce burger"],
      options: [
        { label: "Supplément fromage", price: 1.00 },
        { label: "Supplément bacon", price: 1.50 }
      ]
    };
  
    const mockOnSave = jest.fn();
    render(<AddEditItem onSave={mockOnSave} itemToEdit={itemToEdit} cancelEdit={() => {}} />);
  
    // Vérifie que les champs sont pré-remplis avec les données de l'item à éditer
    expect(screen.getByDisplayValue("Burger Classic")).toBeInTheDocument();
    expect(screen.getByDisplayValue("8.5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Burgers")).toBeInTheDocument();
    expect(screen.getByDisplayValue("pain, steak, fromage, salade, sauce burger")).toBeInTheDocument();
  
    // Modifie les valeurs
    fireEvent.change(screen.getByPlaceholderText("PlateName"), { target: { value: "Tacos Poulet" } });
    fireEvent.change(screen.getByPlaceholderText("Price"), { target: { value: "9.5" } });
    fireEvent.change(screen.getByPlaceholderText("Ingredients"), { target: { value: "galette, poulet, frites" } });
  
    fireEvent.click(screen.getByText("Modifier"));
  
    // Vérifie que la fonction onSave a été appelée avec les bonnes données
    expect(mockOnSave).toHaveBeenCalledWith({
      id: 1,
      name: "Tacos Poulet",
      price: 9.5,
      category: "Burgers",
      ingredients: ["galette", "poulet", "frites"],
      options: [
        { label: "Supplément fromage", price: 1.00 },
        { label: "Supplément bacon", price: 1.50 }
      ]
    });
  });
  it("ajoute et supprime des options", async () => {
    const mockOnSave = jest.fn();
    render(<AddEditItem onSave={mockOnSave} itemToEdit={null} cancelEdit={() => {}} />);

    // Ajout d'une option
    fireEvent.change(screen.getByPlaceholderText("Nom de l'option"), { target: { value: "Supplément fromage" } });
    fireEvent.change(screen.getByPlaceholderText("Prix"), { target: { value: "1.00" } });
    fireEvent.click(screen.getByText("+")); // Ajoute l'option

    // Vérifie que l'option est ajoutée
    await waitFor(() => screen.getByText("Supplément fromage (+1€)"));

    // Ajout d'une autre option
    fireEvent.change(screen.getByPlaceholderText("Nom de l'option"), { target: { value: "Supplément bacon" } });
    fireEvent.change(screen.getByPlaceholderText("Prix"), { target: { value: "1.50" } });
    fireEvent.click(screen.getByText("+")); // Ajoute une autre option

    // Vérifie que la deuxième option est ajoutée
    await waitFor(() => screen.getByText("Supplément bacon (+1.5€)"));

    // Suppression de l'option "Supplément fromage"
    const deleteButton = screen.getByText("Supplément fromage (+1€)").closest('div').querySelector('button');
    fireEvent.click(deleteButton);

    // Vérifie que l'option "Supplément fromage" a bien été supprimée
    await waitFor(() => expect(screen.queryByText("Supplément fromage (+1€)")).not.toBeInTheDocument());

    // Vérifie que l'option "Supplément bacon" est toujours présente
    expect(screen.getByText("Supplément bacon (+1.5€)")).toBeInTheDocument();
  });
});
