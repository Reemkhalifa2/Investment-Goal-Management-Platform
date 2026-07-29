package com.example.InvestmentGoalManagementPlatform.controller;

import com.example.InvestmentGoalManagementPlatform.DTO.FinancialGoalDTO;
import com.example.InvestmentGoalManagementPlatform.service.FinancialGoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/financial-goals")
public class FinancialGoalController {

    private final FinancialGoalService financialGoalService;

    @Autowired
    public FinancialGoalController(FinancialGoalService financialGoalService) {
        this.financialGoalService = financialGoalService;
    }


    // Create financial goal
    @PostMapping
    public ResponseEntity<FinancialGoalDTO> createFinancialGoal(
            @RequestBody FinancialGoalDTO dto) {

        FinancialGoalDTO createdGoal =
                financialGoalService.createFinancialGoal(dto);

        return new ResponseEntity<>(createdGoal, HttpStatus.CREATED);
    }


    // Get financial goal by ID
    @GetMapping("/{goalId}")
    public ResponseEntity<FinancialGoalDTO> getFinancialGoalById(
            @PathVariable Integer goalId) {

        return ResponseEntity.ok(
                financialGoalService.getFinancialGoalById(goalId)
        );
    }


    // Get all goals of a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FinancialGoalDTO>> getGoalsByUserId(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                financialGoalService.getFinancialGoalsByUserId(userId)
        );
    }


    // Get goals by user and status
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<FinancialGoalDTO>> getGoalsByUserIdAndStatus(
            @PathVariable Integer userId,
            @PathVariable String status) {

        return ResponseEntity.ok(
                financialGoalService
                        .getFinancialGoalsByUserIdAndStatus(userId, status)
        );
    }


    // Get goals by status (Admin)
    @GetMapping("/status/{status}")
    public ResponseEntity<List<FinancialGoalDTO>> getGoalsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                financialGoalService.getFinancialGoalsByStatus(status)
        );
    }


    // Update financial goal
    @PutMapping("/{goalId}")
    public ResponseEntity<FinancialGoalDTO> updateFinancialGoal(
            @PathVariable Integer goalId,
            @RequestBody FinancialGoalDTO dto) {

        return ResponseEntity.ok(
                financialGoalService.updateFinancialGoal(goalId, dto)
        );
    }


    // Add contribution
    @PatchMapping("/{goalId}/contribution")
    public ResponseEntity<FinancialGoalDTO> addContribution(
            @PathVariable Integer goalId,
            @RequestParam Double amount) {

        return ResponseEntity.ok(
                financialGoalService.addContribution(goalId, amount)
        );
    }


    // Soft delete goal
    @DeleteMapping("/{goalId}")
    public ResponseEntity<String> deleteFinancialGoal(
            @PathVariable Integer goalId) {

        financialGoalService.deleteFinancialGoal(goalId);

        return ResponseEntity.ok(
                "Financial goal deleted successfully"
        );
    }
}