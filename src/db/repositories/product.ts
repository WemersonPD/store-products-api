import { injectable } from 'inversify';
import { FindManyOptions, getRepository, Repository } from 'typeorm';

import ProductEntity from '../entities/product';
import { IProductRepository } from './interfaces/product';

@injectable()
export class ProductRepository implements IProductRepository {
  private productRepository: Repository<ProductEntity> = getRepository(ProductEntity);

  async create(product: ProductEntity, actor: string): Promise<ProductEntity> {
    product.createdBy = actor;
    return this.productRepository.save(product);
  }

  async selectAll(options: FindManyOptions<ProductEntity>): Promise<ProductEntity[]> {
    return this.productRepository.find(options);
  }

  async deleteById(id: string): Promise<void> {
    await this.productRepository.softDelete({
      id,
    });
  }

}