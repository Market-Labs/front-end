import { Product } from '../domain/model/product.entity.js';

export const ProductAssembler = {
  toEntity(resource) {
    const category = /^br[oó]coli\b/i.test(resource.name || '') ? 'Vegetales' : resource.category;
    return new Product({ ...resource, category });
  },
};
