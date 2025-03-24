import { CATEGORIES } from './constants';

// Validation des données du menu
export function validateMenuItem(item) {
  const errors = [];
  
  // Validation de base
  if (!item.id || typeof item.id !== 'number') {
    errors.push(`Invalid id for item: ${item.name || 'Unknown'}`);
  }
  
  if (!item.name || typeof item.name !== 'string') {
    errors.push(`Invalid name for item: ${item.name || 'Unknown'}`);
  }
  
  if (!item.price || typeof item.price !== 'number') {
    errors.push(`Invalid price for item: ${item.name || 'Unknown'}`);
  }

  // Validation spécifique de la catégorie
  if (!item.category || !Object.values(CATEGORIES).includes(item.category)) {
    errors.push(`Invalid category for item: ${item.name || 'Unknown'}`);
  }

  // Validation des champs obligatoires
  if (!item.id) errors.push(`Article sans ID: ${item.name || 'Sans nom'}`);
  if (!item.name) errors.push(`Article sans nom (ID: ${item.id})`);
  if (typeof item.price !== 'number') errors.push(`Prix invalide pour: ${item.name}`);

  // Validation des ingrédients
  if (!Array.isArray(item.ingredients)) {
    item.ingredients = [];
    errors.push(`Ingrédients invalides pour: ${item.name}`);
  }

  // Validation des options
  if (!Array.isArray(item.options)) {
    item.options = [];
  } else {
    item.options = item.options.filter(opt => {
      const isValid = opt.label && typeof opt.price === 'number';
      if (!isValid) {
        errors.push(`Option invalide pour ${item.name}: ${opt.label || 'Sans nom'}`);
      }
      return isValid;
    });
  }

  // Normalisation des données
  return {
    ...item,
    price: typeof item.price === 'number' ? item.price : 0,
    ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
    options: Array.isArray(item.options) ? item.options : [],
    errors
  };
}

export function validateMenu(menu) {
  const errors = [];
  
  menu.forEach(item => {
    const validatedItem = validateMenuItem(item);
    if (validatedItem.errors.length > 0) {
      errors.push(...validatedItem.errors);
    }
  });

  return errors;
} 