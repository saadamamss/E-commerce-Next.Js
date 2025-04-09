interface Attribute {
  name: string;
  value: string;
}

interface Variant {
  [key: string]: any;
  id: number;
  price: string;
  qty: number;
  selected?: boolean;
  images?: string;
}

interface GroupedVariant {
  [key: string]: any;
  id: number[];
  qty: number;
  price: string;
  variants: Variant[];
  images: string[];
}

export function recoverAttributes(attributes: Attribute[], vmodel: Variant) {
  return Object.entries(
    attributes.reduce<Record<string, string[]>>((acc, { name, value }) => {
      (acc[name] ??= []).push(value);
      return acc;
    }, {})
  ).reduce<Record<string, string[]>>((acc, [key, values]) => {
    ["attr_1", "attr_2", "attr_3"].forEach((attr) => {
      if (values.includes(vmodel[attr])) acc[attr] = values;
    });
    return acc;
  }, {});
}

export function transformBaseVariants(
  variants: Variant[],
  attributeMap: Record<string, string[]>
): Variant[] {
  return variants.map(({ id, price, qty, images, ...attrs }) => ({
    id,
    price,
    qty,
    images,
    ...Object.fromEntries(
      Object.values(attrs)
        .map((value) => {
          const key = Object.keys(attributeMap).find((k) =>
            attributeMap[k].includes(value)
          );
          return key ? [key, value] : [];
        })
        .filter(([key]) => key)
    ),
  }));
}

export function combineVariants(
  variants: Variant[],
  type: string
): GroupedVariant[] {
  if (!variants.length) return []; // Handle empty input

  const grouped = variants.reduce<Record<string, GroupedVariant>>(
    (acc, variant) => {
      const key = variant[type]; // Unique key for grouping

      if (!acc[key]) {
        // Initialize the grouped variant
        acc[key] = {
          [type]: key,
          id: [],
          qty: 0,
          price: calculatePrice(variants, type, key),
          variants: [],
          images: variant.images ? variant.images.split(",") : [],
        };
      }

      // Add the current variant to the group
      delete variant[type]; // Omit the grouping key
      delete variant.attr_1;
      delete variant.attr_2;
      delete variant.attr_3;
      acc[key].qty += variant.qty;
      acc[key].id.push(variant.id);
      acc[key].variants.push(variant);

      return acc;
    },
    {}
  );

  // Convert the grouped object back to an array
  return Object.values(grouped);
}

export function calculatePrice(
  variants: Variant[],
  type: string,
  key: string
): string {
  const prices = variants
    .filter((variant) => variant[type] === key) // Filter variants by the key
    .map((variant) => parseFloat(variant.price)); // Extract prices

  if (!prices.length) return "0"; // Handle no matching variants

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Return a single price or a range
  return minPrice === maxPrice
    ? minPrice.toString()
    : `${minPrice}-${maxPrice}`;
}

export function mapvariants(variants: Variant[]) {
  const com = variants.reduce((acc, variant) => {
    const key = variant.attr_1;
    if (!acc[key]) {
      acc[key] = {
        attr_1: variant.attr_1,
        images: variant?.images?.split(","),
        price: variant.price,
        qty: 0,
        attr_2: [],
        attr_3: [],
      };
    }

    acc[key].qty += variant.qty;

    if (
      variant.attr_2 &&
      !acc[key].attr_2.find((m) => m.value === variant.attr_2)
    ) {
      acc[key].attr_2.push({
        value: variant.attr_2,
        price: variant.price,
        qty: variant.qty,
      });
    }
    if (
      variant.attr_3 &&
      !acc[key].attr_3.find((m) => m.value === variant.attr_3)
    ) {
      acc[key].attr_3.push({
        value: variant.attr_3,
        price: variant.price,
        qty: variant.qty,
      });
    }

    return acc;
  }, {} as { [key: string]: any });

  return Object.values(com);
}

export function mapVariantsAttr_1(variants: Variant[]) {
  return variants.reduce((acc, variant) => {
    const key = variant.attr_1;
    if (!acc.includes(key)) acc.push(key);
    return acc;
  }, []);
}
export function mapVariantsAttr_2(attr_1: string, variants: Variant[]) {
  return variants
    .filter((m) => m.attr_1 == attr_1)
    ?.reduce((acc, variant) => {
      const key = variant.attr_2;
      if (!acc.includes(key) && key) acc.push(key);
      return acc;
    }, []);
}
export function mapVariantsAttr_3(
  attr_1: string,
  attr_2: string,
  variants: Variant[]
) {
  return variants
    .filter((m) => m.attr_1 == attr_1 && m.attr_2 == attr_2)
    ?.reduce((acc, variant) => {
      const key = variant.attr_3;
      if (!acc.includes(key) && key) acc.push(key);
      return acc;
    }, []);
}

export function mappingAttrs(attributes: Attribute[]) {
  return attributes.reduce((acc, variant) => {
    const key = variant.name as string;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(variant.value);
    return acc;
  }, {} as { [key: string]: any });
}

export function getColorVariants(
  variants: Variant[],
  attributeMap: Record<string, string[]>
): Variant[] {
  return variants.map((variant) => {
    const transformedVariant = Object.entries(variant).reduce<Variant>(
      (acc, [key, value]) => {
        const attributeKey = Object.keys(attributeMap).find((k) =>
          attributeMap[k].includes(value)
        );
        if (attributeKey) {
          acc[attributeKey] = value;
        }
        return acc;
      },
      { ...variant, selected: true }
    );

    return transformedVariant;
  });
}

function findVariant() {
  let cond = "";
  const attrs = Object.entries(attributes);
  attrs.forEach(([key, value], i) => {
    const keyval = value.find((m) => m == attrCombination[key]);
    cond += `variant.${key}=='${keyval}'`;
    if (i + 1 == attrs.length) return;
    cond += "&&";
  });

  return cond;
}
