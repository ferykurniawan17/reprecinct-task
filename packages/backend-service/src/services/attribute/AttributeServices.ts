import { sanitize, validate } from "../../shared/utils/utils";
import {
  Attribute,
  AttributeQueryOptions,
  AttributeResult,
  AttributesListResponse,
} from "../../interfaces/attribute/type";
import {
  createAttribute,
  findAllAttributes,
  findAttributeByName,
  findAttributesBySearch,
} from "../../accessors/attribute/AttributeAccessors";

export async function createAttributes(
  rawItems: string[]
): Promise<AttributeResult> {
  const created: string[] = [];
  const skipped: string[] = [];

  for (const raw of rawItems) {
    const name = sanitize(raw);
    const err = validate(name);
    if (err) {
      skipped.push(`${raw} → ${err}`);
      continue;
    }

    const found = await findAttributeByName(name);
    if (found) {
      skipped.push(name);
    } else {
      await createAttribute(name);
      created.push(name);
    }
  }

  return { created, skipped };
}

/**
 * Returns either:
 *  - filtered by `search`
 *  - or X random items if `limit` is set
 *  - or all items otherwise
 */
export async function getAttributes(
  options: AttributeQueryOptions
): Promise<AttributesListResponse> {
  const { search, limit } = options;

  if (search) {
    const records = findAttributesBySearch(search);

    const data = await records;
    return { data, total: data.length };
  }

  const all = await findAllAttributes();

  if (!!limit) {
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }

    // return only `limit` items
    const data = all.slice(0, limit);
    return { data, total: all.length };
  }

  // return all items
  const data = all;
  return { data, total: data.length };
}
