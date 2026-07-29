package com.example.InvestmentGoalManagementPlatform.service;

import com.example.InvestmentGoalManagementPlatform.DTO.AiPlanResponseDTO;
import com.example.InvestmentGoalManagementPlatform.entity.FinancialGoal;
import com.example.InvestmentGoalManagementPlatform.entity.InvestmentPlan;
import com.example.InvestmentGoalManagementPlatform.exception.ResourceNotFoundException;
import com.example.InvestmentGoalManagementPlatform.repository.FinancialGoalRepository;
import com.example.InvestmentGoalManagementPlatform.repository.InvestmentPlanRepository;
import com.example.InvestmentGoalManagementPlatform.utility.HelperUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;

@Service

public class InvestmentPlanService {
    private final InvestmentPlanRepository investmentPlanRepository;
    private final AiService aiService;
    private final FinancialGoalRepository financialGoalRepository;

    @Autowired
    public InvestmentPlanService(AiService aiService, FinancialGoalRepository financialGoalRepository, InvestmentPlanRepository investmentPlanRepository) {
        this.aiService = aiService;
        this.investmentPlanRepository = investmentPlanRepository;
        this.financialGoalRepository = financialGoalRepository;
    }




    @Transactional
    public InvestmentPlan generateAndSavePlanForGoal(Integer goalId) {
        // 1. Fetch User Goal
        FinancialGoal goal = financialGoalRepository.findGoalById(goalId);
        if (HelperUtility.isNull(goal)) {
            throw new ResourceNotFoundException("Financial Goal with ID " + goalId + " not found");
        }

        // 2. Safely calculate remaining months to target date
        int months = 12; // Default fallback to 1 year
        if (goal.getTargetDate() != null) {
            long calculatedMonths = ChronoUnit.MONTHS.between(LocalDate.now(), goal.getTargetDate());
            if (calculatedMonths > 0) {
                months = (int) calculatedMonths;
            }
        }

        // 3. Request AI calculations via AiService with safe error handling
        AiPlanResponseDTO aiPlan;
        try {
            aiPlan = aiService.generateInvestmentPlan(
                    goal.getGoalName(),
                    goal.getTargetAmount() != null ? goal.getTargetAmount() : 0.0,
                    goal.getCurrentAmount() != null ? goal.getCurrentAmount() : 0.0,
                    months
            );
        } catch (Exception e) {
            throw new RuntimeException("AI Plan Generation failed: " + e.getMessage(), e);
        }

        if (HelperUtility.isNull(aiPlan)) {
            throw new RuntimeException("AI Service returned empty response");
        }

        // 4. Populate InvestmentPlan entity with safe null checks
        InvestmentPlan plan = new InvestmentPlan();
        plan.setTargetAmount(aiPlan.getTargetAmount() != null ? aiPlan.getTargetAmount() : goal.getTargetAmount());
        plan.setDurationMonths(aiPlan.getDurationMonths() != null ? aiPlan.getDurationMonths() : months);
        plan.setMonthlySavingAmount(aiPlan.getMonthlySavingAmount() != null ? aiPlan.getMonthlySavingAmount() : 0.0);
        plan.setMonthlyInvestmentAmount(aiPlan.getMonthlyInvestmentAmount() != null ? aiPlan.getMonthlyInvestmentAmount() : 0.0);
        plan.setExpectedProfit(aiPlan.getExpectedProfit() != null ? aiPlan.getExpectedProfit() : 0.0);
        plan.setStatus("ACTIVE");
        plan.setUser(goal.getUser());

        // 5. Save to database
        return investmentPlanRepository.save(plan);
    }
}