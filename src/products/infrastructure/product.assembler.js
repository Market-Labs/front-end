import { Product } from '../domain/model/product.entity.js';

export const ProductAssembler = {
  toEntity(resource) {
    return new Product(resource);
  },
};
