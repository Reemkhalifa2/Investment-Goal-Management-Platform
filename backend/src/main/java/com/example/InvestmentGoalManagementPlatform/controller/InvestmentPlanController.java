package com.example.InvestmentGoalManagementPlatform.controller;

import com.example.InvestmentGoalManagementPlatform.entity.InvestmentPlan;
import com.example.InvestmentGoalManagementPlatform.service.InvestmentPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user/plans")
public class InvestmentPlanController {
    @Autowired
    public InvestmentPlanController(InvestmentPlanService investmentPlanService) {
        this.investmentPlanService = investmentPlanService;
    }

    private final InvestmentPlanService investmentPlanService;

    @PostMapping("/generate-for-goal/{goalId}")
    public ResponseEntity<InvestmentPlan> generatePlan(@PathVariable Integer goalId) {
        InvestmentPlan plan = investmentPlanService.generateAndSavePlanForGoal(goalId);
        return ResponseEntity.ok(plan);
    }
}