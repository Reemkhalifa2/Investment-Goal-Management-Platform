package com.example.InvestmentGoalManagementPlatform.DTO;

import lombok.Data;
import java.util.List;

@Data
public class AiPlanResponseDTO {
    private Double targetAmount;
    private Integer durationMonths;
    private Double monthlySavingAmount;
    private Double monthlyInvestmentAmount;
    private Double expectedProfit;
    private String reasoningAndAdvice;
    private List<AssetRecommendationDTO> assetAllocations;

    @Data
    public static class AssetRecommendationDTO {
        private String assetType; // STOCK, GOLD, MUTUAL_FUND
        private Double allocationPercentage;
        private Double monthlyAmount;
        private String rationale;
    }
}