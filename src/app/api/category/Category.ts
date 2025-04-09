import { prisma } from "@/prisma";
import { Api } from "../routes";

export async function getRelatedCategory(slug: string) {
  const categories: { f0: number; f1: string; f2: string }[] =
    await prisma.$queryRaw`CALL GetCategoryTree(${slug})`;
  console.log(categories);

  categories.shift();

  const mapped = categories.map((i) => ({
    id: i.f0,
    name: i.f1,
    slug: i.f2,
  }));

  return mapped;
}

export async function getParentCategory() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return categories;
}
interface catg {
  name: string;
  slug: string;
  id: number;
}
export async function SearchCategory(q: string) {
  try {
    const { data } = await Api.get(`category/search`, {
      params: { q: q },
    });

    return { success: true, data };
  } catch (error) {
    return { error: 500, msg: "somthing went wrong!" };
  }
}

export async function getMainMenu(slug: string) {
  const menu = await prisma.menu.findUnique({
    where: { slug: slug },
    select: {
      menuItems: {
        orderBy: { order: "asc" },
      },
    },
  });

  const newItems = {
    items: buildHierarchyOptimized(menu?.menuItems),
  };
  return newItems;
}

function buildHierarchyOptimized(items) {
  const map = new Map(); // Faster lookup than plain object
  const roots = []; // Top-level items (parentId = null)

  // First pass: Store all items in a map
  items.forEach((item) => {
    map.set(item.order, { ...item, children: [] });
  });

  // Second pass: Assign children to parents
  for (const item of items) {
    if (item.parentId === null) {
      roots.push(map.get(item.order)); // Add to root if no parent
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children.push(map.get(item.order)); // Add as child
      }
    }
  }

  // Sort the hierarchy (optional, if order matters)
  const sortByOrder = (a, b) => a.order - b.order;
  roots.sort(sortByOrder);
  map.forEach((item) => item.children.sort(sortByOrder));

  return roots;
}
