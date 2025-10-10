package com.shopeasy.DTOs;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {

    private long totalUsers;
    private long totalSellers;
    private long totalOrders;
    private double totalRevenue;
}
