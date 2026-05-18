package net.pawshope.rescue;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RescueDto {

    public record CreateRequest(
            @Size(max = 100) String reporterName,

            @NotBlank @Size(min = 10, max = 20)
            @Pattern(regexp = "^[0-9+\\-\\s()]+$", message = "SĐT không hợp lệ")
            String reporterPhone,

            @NotBlank @Size(min = 5, max = 500)
            String locationText,

            @Size(max = 2000) String description,

            @Size(max = 255) String imageUrl
    ) {}

    public record UpdateRequest(
            @Size(max = 50) String status,
            Long assignedTo,
            @Size(max = 2000) String description
    ) {}

    public record RescueReport(
            long reportId,
            Long userId,
            String reporterName,
            String reporterPhone,
            String locationText,
            String description,
            String imageUrl,
            String status,
            Long assignedTo,
            String assignedUserName,
            String trackingCode,
            String createdAt,
            String updatedAt
    ) {}

    public record TrackResponse(
            String trackingCode,
            String status,
            String locationText,
            String createdAt,
            String updatedAt
    ) {}
}
