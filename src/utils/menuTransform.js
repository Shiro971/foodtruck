import menuData from '../data/menu.json';
import { CATEGORIES } from './constants';

// Fonction pour transformer les catégories du JSON vers nos constantes
const getCategoryConstant = (category) => {
  switch (category) {
    case 'Burgers':
      return CATEGORIES.BURGER;
    case 'Tacos':
      return CATEGORIES.TACOS;
    case 'Wraps':
      return CATEGORIES.WRAP;
    case 'Accompagnements':
      return CATEGORIES.FRIES;
    case 'Boissons':
      return CATEGORIES.DRINK;
    default:
      return category;
  }
};

// Transformer le menu JSON en format plat avec les bonnes catégories
export const transformedMenu = menuData.flatMap(category => 
  category.items.map(item => ({
    ...item,
    category: getCategoryConstant(category.category),
    options: Array.isArray(item.options) ? item.options.map(opt => ({
      label: opt.name || opt.label,
      price: Number(opt.price) || 0
    })) : []
  }))
);

export default transformedMenu; 