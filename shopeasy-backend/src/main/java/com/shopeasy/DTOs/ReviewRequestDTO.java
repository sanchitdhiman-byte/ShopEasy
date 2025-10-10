package com.shopeasy.DTOs;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequestDTO {
    
    @NotNull
    @Min(value = 1)
    @Min(value = 5)
    private int rating;
    
    private String review;
}
