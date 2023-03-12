export interface Pagination {
    page: number,
    per_page: number,
    filterStatus: number
}

export interface Item {
    id?: number,
    title: string,
    description: string,
    status: 1 | 2 | 3
}

