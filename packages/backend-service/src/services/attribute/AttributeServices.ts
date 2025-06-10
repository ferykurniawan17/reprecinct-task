import { sanitize, validate } from "../../shared/utils/utils";
import {
  Attribute,
  AttributeQueryOptions,
  AttributeResult,
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
): Promise<Attribute[]> {
  const { search, limit } = options;

  // 1) if search param is provided, ignore limit and return filtered list
  if (search) {
    return findAttributesBySearch(search);
  }

  // 2) otherwise fetch all, then optionally slice random sample
  const all = await findAllAttributes();

  if (!!limit) {
    // shuffle in-place (Fisher–Yates)
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }

    return all.slice(0, limit);
  }

  // 3) no filters: return everything
  return all;
}
