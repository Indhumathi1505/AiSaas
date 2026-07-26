package com.nexus.ai.controller;

import com.nexus.ai.model.FinanceTransaction;
import com.nexus.ai.model.FinanceBudget;
import com.nexus.ai.model.FinanceGoal;
import com.nexus.ai.model.FinanceSubscription;
import com.nexus.ai.repository.FinanceTransactionRepository;
import com.nexus.ai.repository.FinanceBudgetRepository;
import com.nexus.ai.repository.FinanceGoalRepository;
import com.nexus.ai.repository.FinanceSubscriptionRepository;
import com.nexus.ai.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    @Autowired
    private FinanceTransactionRepository transactionRepository;

    @Autowired
    private FinanceBudgetRepository budgetRepository;

    @Autowired
    private FinanceGoalRepository goalRepository;

    @Autowired
    private FinanceSubscriptionRepository subscriptionRepository;

    @Autowired
    private GeminiService geminiService;
    
    private final ObjectMapper mapper = new ObjectMapper();

    @GetMapping("/transactions")
    public List<FinanceTransaction> getTransactions() {
        return transactionRepository.findAll();
    }

    @PostMapping("/transactions")
    public FinanceTransaction createTransaction(@RequestBody Map<String, Object> body) {
        FinanceTransaction tx = new FinanceTransaction();
        tx.setId("tx_" + System.currentTimeMillis());
        tx.setDate((String) body.getOrDefault("date", Instant.now().toString().split("T")[0]));
        String type = (String) body.getOrDefault("type", "expense");
        tx.setType(type);
        String category = (String) body.getOrDefault("category", "General");
        tx.setCategory(category);
        double amount = Double.parseDouble(body.getOrDefault("amount", "0").toString());
        tx.setAmount(amount);
        tx.setDescription((String) body.getOrDefault("description", type.equals("income") ? "Income Entry" : "Expense Entry"));
        tx.setPaymentMethod((String) body.getOrDefault("paymentMethod", "Card"));
        tx.setIsRecurring((Boolean) body.getOrDefault("isRecurring", false));

        transactionRepository.save(tx);

        if ("expense".equals(type)) {
            List<FinanceBudget> budgets = budgetRepository.findAll();
            FinanceBudget budget = budgets.stream().filter(b -> b.getCategory().equals(category)).findFirst().orElse(null);
            if (budget != null) {
                budget.setSpent(budget.getSpent() + amount);
                budgetRepository.save(budget);
            } else {
                FinanceBudget newBudget = new FinanceBudget();
                newBudget.setId("b_" + System.currentTimeMillis());
                newBudget.setCategory(category);
                newBudget.setMonthlyLimit(500);
                newBudget.setSpent(amount);
                budgetRepository.save(newBudget);
            }
        }
        return tx;
    }

    @DeleteMapping("/transactions/{id}")
    public Map<String, Boolean> deleteTransaction(@PathVariable String id) {
        Optional<FinanceTransaction> optTx = transactionRepository.findById(id);
        if (optTx.isPresent() && "expense".equals(optTx.get().getType())) {
            FinanceTransaction tx = optTx.get();
            List<FinanceBudget> budgets = budgetRepository.findAll();
            FinanceBudget budget = budgets.stream().filter(b -> b.getCategory().equals(tx.getCategory())).findFirst().orElse(null);
            if (budget != null) {
                budget.setSpent(Math.max(0, budget.getSpent() - tx.getAmount()));
                budgetRepository.save(budget);
            }
        }
        transactionRepository.deleteById(id);
        Map<String, Boolean> res = new HashMap<>();
        res.put("success", true);
        return res;
    }

    @GetMapping("/budgets")
    public List<FinanceBudget> getBudgets() {
        return budgetRepository.findAll();
    }

    @PostMapping("/budgets")
    public FinanceBudget createBudget(@RequestBody Map<String, Object> body) {
        String category = (String) body.get("category");
        double monthlyLimit = Double.parseDouble(body.getOrDefault("monthlyLimit", "500").toString());

        List<FinanceBudget> budgets = budgetRepository.findAll();
        FinanceBudget existing = budgets.stream().filter(b -> b.getCategory().equals(category)).findFirst().orElse(null);
        if (existing != null) {
            existing.setMonthlyLimit(monthlyLimit);
            return budgetRepository.save(existing);
        }

        FinanceBudget newBudget = new FinanceBudget();
        newBudget.setId("b_" + System.currentTimeMillis());
        newBudget.setCategory(category != null ? category : "General");
        newBudget.setMonthlyLimit(monthlyLimit);
        double spent = transactionRepository.findAll().stream()
                .filter(t -> "expense".equals(t.getType()) && category.equals(t.getCategory()))
                .mapToDouble(FinanceTransaction::getAmount)
                .sum();
        newBudget.setSpent(spent);
        return budgetRepository.save(newBudget);
    }

    @GetMapping("/goals")
    public List<FinanceGoal> getGoals() {
        return goalRepository.findAll();
    }

    @PostMapping("/goals")
    public FinanceGoal createGoal(@RequestBody Map<String, Object> body) {
        FinanceGoal goal = new FinanceGoal();
        goal.setId("g_" + System.currentTimeMillis());
        goal.setTitle((String) body.getOrDefault("title", "New Savings Goal"));
        goal.setTargetAmount(Double.parseDouble(body.getOrDefault("targetAmount", "1000").toString()));
        goal.setCurrentAmount(0);
        goal.setTargetDate((String) body.getOrDefault("targetDate", "2026-12-31"));
        goal.setIconName((String) body.getOrDefault("iconName", "ShieldCheck"));
        return goalRepository.save(goal);
    }

    @PutMapping("/goals/{id}/deposit")
    public FinanceGoal depositGoal(@PathVariable String id, @RequestBody Map<String, Object> body) {
        FinanceGoal goal = goalRepository.findById(id).orElse(null);
        if (goal == null) return null;
        double amount = Double.parseDouble(body.getOrDefault("amount", "0").toString());
        goal.setCurrentAmount(goal.getCurrentAmount() + amount);
        return goalRepository.save(goal);
    }

    @GetMapping("/subscriptions")
    public List<FinanceSubscription> getSubscriptions() {
        return subscriptionRepository.findAll();
    }

    @GetMapping("/ai-health")
    public Map<String, Object> getAiHealth() {
        List<FinanceTransaction> transactions = transactionRepository.findAll();
        double totalIncome = transactions.stream().filter(t -> "income".equals(t.getType())).mapToDouble(FinanceTransaction::getAmount).sum();
        double totalExpense = transactions.stream().filter(t -> "expense".equals(t.getType())).mapToDouble(FinanceTransaction::getAmount).sum();
        double netSavings = totalIncome - totalExpense;
        String savingsRate = totalIncome > 0 ? String.format("%.1f", (netSavings / totalIncome) * 100) : "0";

        Map<String, Object> res = new HashMap<>();
        try {
            String prompt = "You are an expert Personal Finance AI Advisor. Analyze the user's personal financial entries below:\n\n" +
                "Total Monthly Income: $" + totalIncome + "\n" +
                "Total Monthly Expense: $" + totalExpense + "\n" +
                "Net Monthly Savings: $" + netSavings + " (Savings Rate: " + savingsRate + "%)\n" +
                "Provide personalized financial advice for an individual user in JSON format with keys: healthScore, cashFlowStatus, expensePredictionNextMonth, whereToSpendMore, whereToSpendLess, savingsRecommendation, explanation.";

            String aiRes = geminiService.generateContent(prompt, "application/json");
            res = mapper.readValue(aiRes, Map.class);
        } catch (Exception e) {
            res.put("healthScore", netSavings >= 0 ? 85 : 60);
            res.put("cashFlowStatus", netSavings >= 0 ? "Healthy Cash Flow" : "Expenses Exceed Income");
            res.put("expensePredictionNextMonth", totalExpense * 1.02);
            res.put("whereToSpendMore", totalIncome > totalExpense ? "You have room in your monthly budget." : "Focus on increasing income.");
            res.put("whereToSpendLess", totalExpense > 0 ? "Review top expense categories." : "No high expense categories logged yet.");
            res.put("savingsRecommendation", "Build a 3-to-6 month personal emergency fund.");
            res.put("explanation", "Total income: $" + totalIncome + " | Total expenses: $" + totalExpense);
        }
        return res;
    }
}
