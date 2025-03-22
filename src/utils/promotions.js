export function applyPromotions(cart) {
    const baseTotal = cart.reduce((sum, item) => {
      const itemTotal = item.price + (item.selectedOptions?.reduce((s, opt) => s + opt.price, 0) || 0);
      return sum + itemTotal;
    }, 0);
  
    const hasFreeDrink = cart.some(item => item.name === "Boisson Canette (offerte)");
  
    const newCart = [...cart];
  
    if (baseTotal >= 20 && !hasFreeDrink) {
      newCart.push({
        id: "free-drink",
        name: "Boisson Canette (offerte)",
        price: 0,
        ingredients: ["au choix"],
        selectedOptions: []
      });
    }
  
    // Si le total repasse en dessous de 20€, on enlève la boisson gratuite
    if (baseTotal < 20 && hasFreeDrink) {
      return cart.filter(item => item.name !== "Boisson Canette (offerte)");
    }
  
    return newCart;
  }
  