import { CATEGORIES, PROMOTION_TYPES } from './constants';

export const calculateTotal = (cart) => {
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const applyPromotions = (cart) => {
  let promotions = [];
  let modifiedCart = [...cart];

  const totalBeforePromo = calculateTotal(cart);

  // Vérifier les catégories
  const hasCategory = (category) => cart.some(item => item.category === category);
  const hasBurger = hasCategory(CATEGORIES.BURGER);
  const hasFries = hasCategory(CATEGORIES.FRIES);
  const hasDrink = hasCategory(CATEGORIES.DRINK);

  // Promotion : Boisson gratuite si le total est supérieur à 20€
  if (totalBeforePromo >= 20) {
    const drinkItem = modifiedCart.find(item => 
      item.category === CATEGORIES.DRINK && !item.isPromotional
    );

    if (drinkItem) {
      const drinkIndex = modifiedCart.indexOf(drinkItem);
      modifiedCart[drinkIndex] = {
        ...drinkItem,
        isPromotional: true,
        promotionApplied: 'Boisson offerte pour toute commande supérieure à 20€',
        originalPrice: drinkItem.price,
        finalPrice: 0
      };
      promotions.push({
        type: PROMOTION_TYPES.FREE_DRINK,
        saving: drinkItem.price
      });
    }
  }

  // Promotion : Menu complet
  if (hasBurger && hasFries && hasDrink) {
    const menuDiscount = 2;
    const burgerItem = modifiedCart.find(item => item.category === CATEGORIES.BURGER);
    
    if (burgerItem) {
      const index = modifiedCart.indexOf(burgerItem);
      modifiedCart[index] = {
        ...burgerItem,
        promotionApplied: 'Réduction menu -2€',
        originalPrice: burgerItem.price,
        finalPrice: (burgerItem.finalPrice || burgerItem.price) - menuDiscount
      };
      promotions.push({
        type: PROMOTION_TYPES.MENU_DEAL,
        saving: menuDiscount
      });
    }
  }

  return {
    cart: modifiedCart,
    promotions
  };
};

export const calculateMenuTotal = (cart) => {
  return cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
};

export const calculateFinalTotal = (cart) => {
  return cart.reduce((sum, item) => {
    const itemPrice = item.isPromotional ? 0 : (item.finalPrice || item.price);
    return sum + (itemPrice * item.quantity);
  }, 0);
};
  