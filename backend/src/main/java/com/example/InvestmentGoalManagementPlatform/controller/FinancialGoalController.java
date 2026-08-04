package com.example.InvestmentGoalManagementPlatform.controller;

import com.example.InvestmentGoalManagementPlatform.DTO.FinancialGoalDTO;
import com.example.InvestmentGoalManagementPlatform.service.FinancialGoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/financial-goals")
@CrossOrigin(origins = "http://localhost:4200")

public class FinancialGoalController {

    private final FinancialGoalService financialGoalService;

    @Autowired
    public FinancialGoalController(FinancialGoalService financialGoalService) {
        this.financialGoalService = financialGoalService;
    }

    @PostMapping
    public ResponseEntity<FinancialGoalDTO> createFinancialGoal(@RequestBody FinancialGoalDTO dto) {
        FinancialGoalDTO createdGoal = financialGoalService.createFinancialGoal(dto);
        return new ResponseEntity<>(createdGoal, HttpStatus.CREATED);
    }

    @GetMapping("/{goalId}")
    public ResponseEntity<FinancialGoalDTO> getFinancialGoalById(@PathVariable Integer goalId) {
        FinancialGoalDTO goal = financialGoalService.getFinancialGoalById(goalId);
        return ResponseEntity.ok(goal);
    }

    // /api/financial-goals?userId=1
    // /api/financial-goals?userId=1&status=ACTIVE
    // /api/financial-goals?status=ACHIEVED
    @GetMapping
    public ResponseEntity<List<FinancialGoalDTO>> getFinancialGoals(
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) String status) {

        List<FinancialGoalDTO> goals;

        if (userId != null && status != null) {
            goals = financialGoalService.getFinancialGoalsByUserIdAndStatus(userId, status);
        } else if (userId != null) {
            goals = financialGoalService.getFinancialGoalsByUserId(userId);
        } else if (status != null) {
            goals = financialGoalService.getFinancialGoalsByStatus(status);
        } else {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(goals);
    }

    @PutMapping("/{goalId}")
    public ResponseEntity<FinancialGoalDTO> updateFinancialGoal(
            @PathVariable Integer goalId,
            @RequestBody FinancialGoalDTO dto) {
        FinancialGoalDTO updatedGoal = financialGoalService.updateFinancialGoal(goalId, dto);
        return ResponseEntity.ok(updatedGoal);
    }

    // (Log Contribution)
    // JSON Request Body Example: { "amount": 50.0 }
    @PostMapping("/{goalId}/contribute")
    public ResponseEntity<FinancialGoalDTO> addContribution(
            @PathVariable Integer goalId,
            @RequestBody Map<String, Double> request) {
        Double amount = request.get("amount");
        if (amount == null || amount <= 0) {
            return ResponseEntity.badRequest().build();
        }
        FinancialGoalDTO updatedGoal = financialGoalService.addContribution(goalId, amount);
        return ResponseEntity.ok(updatedGoal);
    }

    //  (Soft Delete)
    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteFinancialGoal(@PathVariable Integer goalId) {
        financialGoalService.deleteFinancialGoal(goalId);
        return ResponseEntity.noContent().build();
    }
}