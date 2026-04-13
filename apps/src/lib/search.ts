export const getEmptySearchResult = (page = 1, limit = 10) => ({
    success: false,
    data: [],
    pagination: {
        currentPage: page,
        totalPages: 0,
        totalCount: 0,
        limit,
        hasNextPage: false,
        hasPrevPage: false,
    },
});
