package com.example.InvestmentGoalManagementPlatform.service;

import com.example.InvestmentGoalManagementPlatform.DTO.AiPlanResponseDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private final ChatClient chatClient;

    public AiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String askAI(String prompt) {
        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }

    public AiPlanResponseDTO generateInvestmentPlan(String goalName, Double targetAmount, Double currentAmount, int months) {
        String prompt = String.format("""
            You are a expert financial planner specializing in the Omani and GCC markets (OMR currency).
            
            Analyze the following investment goal and construct a realistic plan:
            - Goal Name: %s
            - Target Amount: %.2f OMR
            - Current Savings/Starter Amount: %.2f OMR
            - Timeframe: %d months
            
            Calculate:
            1. Total remaining amount needed.
            2. Recommended monthly cash savings vs. monthly asset investment split.
            3. Estimated realistic expected profit using standard compound returns (Gold ~7%%, Mutual Funds ~6%%, GCC/MSX Stocks ~9%%).
            4. Asset allocation percentage split across Gold, Stocks, and Mutual Funds.
            
            Provide structured details following the requested output format.
            """, goalName, targetAmount, currentAmount, months);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .entity(AiPlanResponseDTO.class); // Spring AI handles JSON parsing automatically
    }
}