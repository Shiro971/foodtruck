import { applyPromotions, calculateTotal, calculateFinalTotal } from '../utils/promotions';
import { CATEGORIES, PROMOTION_TYPES } from '../utils/constants';

describe('Promotions utilities', () => {
  const mockCart = [
    {
      id: 1,
      name: 'Burger Classic',
      category: CATEGORIES.BURGER,
      price: 10,
      quantity: 1
    },
    {
      id: 2,
      name: 'Frites',
      category: CATEGORIES.FRIES,
      price: 3,
      quantity: 1
    },
    {
      id: 3,
      name: 'Coca',
      category: CATEGORIES.DRINK,
      price: 2,
      quantity: 1
    }
  ];

  describe('calculateTotal', () => {
    it('calcule correctement le total du panier', () => {
      expect(calculateTotal(mockCart)).toBe(15);
    });

    it('gère un panier vide', () => {
      expect(calculateTotal([])).toBe(0);
    });
  });

  describe('applyPromotions', () => {
    it('applique la promotion boisson gratuite pour commande > 20€', () => {
      const expensiveCart = [
        ...mockCart,
        { ...mockCart[0], quantity: 2 } // Ajoute 2 burgers de plus
      ];

      const { cart, promotions } = applyPromotions(expensiveCart);
      
      // Vérifie que la promotion est appliquée
      expect(promotions).toContainEqual({
        type: PROMOTION_TYPES.FREE_DRINK,
        saving: 2 // Prix de la boisson
      });

      // Vérifie que la boisson est marquée comme gratuite
      const drink = cart.find(item => item.category === CATEGORIES.DRINK);
      expect(drink.isPromotional).toBe(true);
      expect(drink.finalPrice).toBe(0);
    });

    it('applique la promotion menu pour burger + frites + boisson', () => {
      const { cart, promotions } = applyPromotions(mockCart);
      
      expect(promotions).toContainEqual({
        type: PROMOTION_TYPES.MENU_DEAL,
        saving: 2
      });

      // Vérifie que la réduction est appliquée sur le burger
      const burger = cart.find(item => item.category === CATEGORIES.BURGER);
      expect(burger.finalPrice).toBe(8); // 10€ - 2€ de réduction
    });
  });

  describe('calculateFinalTotal', () => {
    it('calcule correctement le total après promotions', () => {
      const { cart } = applyPromotions(mockCart);
      expect(calculateFinalTotal(cart)).toBe(13); // 15€ - 2€ de réduction menu
    });
  });
}); 