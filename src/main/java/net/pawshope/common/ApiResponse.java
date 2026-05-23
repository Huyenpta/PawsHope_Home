package net.pawshope.common;

import java.util.List;

public record ApiResponse<T>(
        boolean success,
        T data,
        String message,
        Object details,
        List<?> items,
        Pagination pagination
) {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, null, null, null);
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, data, message, null, null, null);
    }

    public static <T> ApiResponse<T> message(String message) {
        return new ApiResponse<>(true, null, message, null, null, null);
    }

    public static <T> ApiResponse<T> paginated(List<?> items, Pagination pagination) {
        return new ApiResponse<>(true, null, null, null, items, pagination);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message, null, null, null);
    }

    public static <T> ApiResponse<T> error(String message, Object details) {
        return new ApiResponse<>(false, null, message, details, null, null);
    }

    public record Pagination(int page, int limit, long total, int totalPages) {
        public static Pagination of(int page, int limit, long total) {
            int totalPages = (int) Math.ceil((double) total / limit);
            return new Pagination(page, limit, total, totalPages);
        }
    }
}
