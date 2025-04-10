import {
  getParentCategory,
  getRelatedCategory,
} from "@/app/api/category/Category";
import { prisma } from "@/prisma";

export type searchParam = {
  page?: string | string[];
  color?: string | string[];
  size?: string | string[];
  brand?: string | string[];
  minprice?: string;
  maxprice?: string;
};
export type searchFilter = {
  color?: string;
  size?: string;
  brand?: string;
  minprice?: string;
  maxprice?: string;
  q?: string;
};

export type filterType = {
  color: string[];
  size: string[];
  brand: string[];
  minprice: number;
  maxprice: number;
};

export function hpp(params: { [key: string]: string | string[] | undefined }) {
  return Object.keys(params)?.reduce((acc, i) => {
    acc[i] = Array.isArray(params[i]) ? params[i].pop() : params[i];
    return acc;
  }, {} as { [key: string]: string | undefined }) as {
    page?: string;
    color?: string;
    size?: string;
    brand?: string;
    minprice?: string;
    maxprice?: string;
  };
}
export const safeSplit = (str: string | undefined) => {
  return str ? str.trim().split("--") : undefined;
};

export async function findPage(slug: string) {
  switch (slug) {
    case "shop":
      return { type: "shop", slug: "/shop", content: null };

    case "search":
      return { type: "search", slug: "/search", content: null };

    default:
      return await prisma.pages.findUnique({
        where: {
          slug: slug,
        },
        select: {
          type: true,
          slug: true,
          content: true,
        },
      });
  }
}

export async function productCategories(type: string, slug: string) {
  switch (type) {
    case "category":
      return await getRelatedCategory(slug);

    default:
      return await getParentCategory();
  }
}

export async function getCollectionProducts(id: string, maxcards: number) {

  const collection = await prisma.collections.findUnique({
    where: { id: parseInt(id) },
    select: {
      products: true,
    },
  });

  return collection?.products;
}

// utils/csrf.ts

/*
function JsonToHtml({ json }) {
  return json.map((element, index) => {
    const Tag = element.tag; // Get the tag name
    const voidelm = ["img", "input"];
    if (voidelm.includes(Tag)) {
      return (
        <Tag
          key={index}
          className={element.class ?? undefined}
          src={element.src ?? undefined}
          alt={element.alt ?? undefined}
        />
      );
    }

    return (
      <Tag key={index} className={element.class ?? undefined}>
        {element.content}
        {element.children && element.children.length > 0 && (
          <JsonToHtml json={element.children} />
        )}
      </Tag>
    );
  });
}

*/
