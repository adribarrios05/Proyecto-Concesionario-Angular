// Modelo genérico para respuestas paginadas
export interface Paginated<T> {
    data: T[];
    page: number;
    pages: number;
    pageSize: number;
}
