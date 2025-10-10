package com.shopeasy.DTOs;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardStatsDTO {
    private double totalSales;
    private long totalOrders;
    private long productsListed;
    private long pendingOrders;
}
