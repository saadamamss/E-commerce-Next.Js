import { prisma } from "@/prisma";
import { safeSplit, searchFilter } from "@/lib/helpers/functions";

type page = {
  slug: string;
  type: string;
};

class Product {
  private page;
  private filters;
  private pageNo;
  private pageItemsCount = 2;

  public constructor(
    page: page,
    filters: searchFilter,
    pageNo: string | undefined
  ) {
    this.page = page;
    this.filters = filters;
    this.pageNo = pageNo ? parseInt(pageNo) - 1 : 0;
  }

  async getProducts() {
    const conditions = this.getConditions() as any;
    switch (this.page.type) {
      case "category":
        const categories: { f0: number }[] =
          await prisma.$queryRaw`CALL GetCategoryTree(${this.page.slug})`;
        const flatedCat = categories?.map((i) => i.f0);
        conditions.categoryId = { in: flatedCat };
        //
        return await this.findProducts(conditions);

      case "collection":
        const collection = await prisma.collections.findUnique({
          where: {
            slug: this.page.slug,
          },
        });

        if (collection && collection.type === "manual") {
          /// find product collection
          conditions.collections = {
            some: {
              id: collection.id,
            },
          };
        }

        ///else find product by collection conditions
        if (collection && collection.type === "smart") {
          //condition types *category , price , brand*
          const collectionCond = collection.conditions as any;
          conditions.AND = [conditions, collectionCond].filter(
            (condition) => Object.keys(condition).length > 0
          );
        }

        return await this.findProducts(conditions);

      case "brand":
        conditions.brand = { slug: this.page.slug };

        return await this.findProducts(conditions);

      case "shop":
        return await this.findProducts(conditions);

      case "search":
        conditions.name = { contains: this.filters.q };
        return await this.findProducts(conditions);

      default:
        return { products: null, count: 0, pagination: null };
    }
  }

  // make filters
  public getConditions() {
    const conditions = {
      variants: {
        some: {},
      },
    } as any;

    if (this.filters.minprice && this.filters.maxprice) {
      conditions.price = {
        gt: this.filters.minprice,
        lt: this.filters.maxprice,
      };
    }

    if (this.filters.brand?.length) {
      conditions.brand = {
        slug: { in: safeSplit(this.filters?.brand) },
      };
    }
    if (this.filters.color?.length) {
      conditions.variants.some = {
        ...conditions.variants.some,
        color: { in: safeSplit(this.filters.color) },
      };
    }
    if (this.filters.size?.length) {
      conditions.variants.some = {
        ...conditions.variants.some,
        size: { in: safeSplit(this.filters.size) },
      };
    }

    return conditions;
  }

  // find product with filters
  async findProducts(conditions: any) {
    const count = await prisma.product.count({ where: conditions });
    const products = await prisma.product.findMany({
      where: conditions,
      select: {
        id: true,
        name: true,
        slug: true,
        SKU: true,
        price: true,
        avgRate: true,
        noReview: true,
        images: true,
        category: {
          select: {
            name: true,
          },
        },
        brand: {
          select: {
            name: true,
          },
        },
      },

      take: this.pageItemsCount,
      skip: this.pageNo * this.pageItemsCount,
    });

    const pagination = this.pagination(count);
    return { products: products, count, pagination };
  }

  // make pgination
  pagination(count: number) {
    const no_Pages = Math.ceil(count / this.pageItemsCount);
    const pages = [];
    for (let index = 1; index <= no_Pages; index++) {
      pages.push(index);
    }
    const current = this.pageNo + 1;
    return pages.length
      ? {
          pages,
          current: current,
          next: current == pages.length ? null : current + 1,
          prev: this.pageNo == 0 ? null : current - 1,
        }
      : null;
  }

  
}

export default Product;
