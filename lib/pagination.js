const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;
const MAX_SIZE = 50;

/**
 * @param {URLSearchParams} searchParams
 * @param {{ defaultSize?: number; maxSize?: number }} [options]
 */
export function parsePagination(searchParams, options = {}) {
  const defaultSize = options.defaultSize ?? DEFAULT_SIZE;
  const maxSize = options.maxSize ?? MAX_SIZE;

  let page = Number.parseInt(searchParams.get("page") ?? String(DEFAULT_PAGE), 10);
  let size = Number.parseInt(searchParams.get("size") ?? String(defaultSize), 10);

  if (!Number.isFinite(page) || page < 1) page = DEFAULT_PAGE;
  if (!Number.isFinite(size) || size < 1) size = defaultSize;
  if (size > maxSize) size = maxSize;

  return {
    page,
    size,
    offset: (page - 1) * size,
  };
}

export function buildPaginationMeta(page, size, total) {
  const totalPages = Math.max(1, Math.ceil(total / size) || 1);
  return {
    page,
    size,
    total,
    totalPages,
    hasMore: page < totalPages,
  };
}
