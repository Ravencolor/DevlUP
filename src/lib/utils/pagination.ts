export interface PageParams {
  page: number;
  limit: number;
}

export function parsePageParams(params: URLSearchParams): PageParams {
  const page = Math.max(1, parseInt(params.get("page") ?? "1") || 1);
  const limit = Math.min(50, Math.max(1, parseInt(params.get("limit") ?? "20") || 20));
  return { page, limit };
}

export function toSkip({ page, limit }: PageParams): number {
  return (page - 1) * limit;
}

export function toPagination(total: number, { page, limit }: PageParams) {
  return { total, page, limit, pages: Math.ceil(total / limit) };
}
