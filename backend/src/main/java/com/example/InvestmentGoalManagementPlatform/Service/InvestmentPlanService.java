package com.example.InvestmentGoalManagementPlatform.service;

import com.example.InvestmentGoalManagementPlatform.DTO.AiPlanResponseDTO;
import com.example.InvestmentGoalManagementPlatform.entity.FinancialGoal;
import com.example.InvestmentGoalManagementPlatform.entity.InvestmentPlan;
import com.example.InvestmentGoalManagementPlatform.repository.FinancialGoalRepository;
import com.example.InvestmentGoalManagementPlatform.repository.InvestmentPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;

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


        // 2. Calculate remaining months to target date
        int months = Period.between(LocalDate.now(), goal.getTargetDate()).getMonths()
                + (Period.between(LocalDate.now(), goal.getTargetDate()).getYears() * 12);

        if (months <= 0) {
            months = 12; // Default fallback to 1 year
        }

        // 3. Request AI calculations via AiService
        AiPlanResponseDTO aiPlan = aiService.generateInvestmentPlan(
                goal.getGoalName(),
                goal.getTargetAmount(),
                goal.getCurrentAmount() != null ? goal.getCurrentAmount() : 0.0,
                months
        );

        // 4. Populate your InvestmentPlan entity
        InvestmentPlan plan = new InvestmentPlan();
        plan.setTargetAmount(aiPlan.getTargetAmount());
        plan.setDurationMonths(aiPlan.getDurationMonths());
        plan.setMonthlySavingAmount(aiPlan.getMonthlySavingAmount());
        plan.setMonthlyInvestmentAmount(aiPlan.getMonthlyInvestmentAmount());
        plan.setExpectedProfit(aiPlan.getExpectedProfit());
        plan.setStatus("ACTIVE");
        plan.setUser(goal.getUser());

        // 5. Save to database
        return investmentPlanRepository.save(plan);
    }
}