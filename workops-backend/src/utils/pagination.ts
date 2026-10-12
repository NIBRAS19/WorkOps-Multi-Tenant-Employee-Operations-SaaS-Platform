import type { Model } from "../sqlite/index.js";

export async function paginate<T>(
  model: Model<T>,
  filter: Record<string, unknown>,
  options: { page?: number; limit?: number; sort?: Record<string, 1 | -1>; populate?: string[]; select?: string }
) {
  const page = Math.max(options.page ?? 1, 1);
  const limit = Math.min(Math.max(options.limit ?? 20, 1), 100);
  let query = model.find(filter);
  if (options.sort) query = query.sort(options.sort);
  if (options.select) query = query.select(options.select);
  for (const path of options.populate ?? []) query = query.populate(path);
  const [items, total] = await Promise.all([
    query.skip((page - 1) * limit).limit(limit).lean(),
    model.countDocuments(filter)
  ]);
  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}
