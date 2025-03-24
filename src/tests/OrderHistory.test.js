import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OrderHistory from "../components/OrderHistory";

describe("OrderHistory component", () => {
  const mockOrders = [
    {
      number: "CMD123",
      date: "2024-03-20T12:00:00Z",
      status: "PENDING",
      total: 15.50,
      items: [
        { name: "Burger", quantity: 1, price: 8.5 },
        { name: "Frites", quantity: 1, price: 7 }
      ]
    }
  ];

  let mockReorder, mockStatusChange, mockCancel;

  beforeEach(() => {
    mockReorder = jest.fn();
    mockStatusChange = jest.fn();
    mockCancel = jest.fn();

    render(
      <OrderHistory 
        orders={mockOrders} 
        onReorder={mockReorder} 
        onStatusChange={mockStatusChange} 
        onCancel={mockCancel} 
      />
    );
  });

  it("affiche correctement les commandes", () => {
    expect(screen.getByText(/Commande #CMD123/i)).toBeInTheDocument();
    expect(screen.getByText("1x Burger")).toBeInTheDocument();
    expect(screen.getByText("1x Frites")).toBeInTheDocument();
    expect(screen.getByText(/15.50€/i)).toBeInTheDocument();
    expect(screen.getByText("🕒 En attente")).toBeInTheDocument();
  });

  it("appelle onReorder quand on clique sur 'Commander à nouveau'", () => {
    fireEvent.click(screen.getByText(/Commander à nouveau/i));
    expect(mockReorder).toHaveBeenCalledWith(mockOrders[0]);
  });

  it("appelle onCancel quand on clique sur 'Annuler'", () => {
    fireEvent.click(screen.getByText(/Annuler/i));
    expect(mockCancel).toHaveBeenCalledWith("CMD123");
  });

  it("appelle onStatusChange avec le bon statut", () => {
    fireEvent.click(screen.getByText(/Commencer la préparation/i));
    expect(mockStatusChange).toHaveBeenCalledWith("CMD123", "PREPARING");
  });

  it("affiche correctement les options des plats si elles existent", async () => {
    const mockOrdersWithOptions = [
      {
        number: "CMD456",
        date: "2024-03-20T14:00:00Z",
        status: "READY",
        total: 20.00,
        items: [
          { 
            name: "Pizza", 
            quantity: 1, 
            price: 15.00, 
            selectedOptions: [{ label: "Supplément fromage", price: 2.00 }],
            finalPrice: 17.00
          },
          {
            name: "Coca",
            quantity: 1,
            price: 3.00
          }
        ]
      }
    ];

    render(
      <OrderHistory 
        orders={mockOrdersWithOptions} 
        onReorder={mockReorder} 
        onStatusChange={mockStatusChange} 
        onCancel={mockCancel} 
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Supplément fromage (+2.00€)")).toBeInTheDocument();
    });
  });
});
