const express = require('express');
const { createASTFromRule, combineRules, evaluateRule } = require('./ast');
const router = express.Router();

let storedRules = [];

// Create AST for a rule
router.post('/create_rule', (req, res) => {
    const { rule } = req.body;
    try {
        const ast = createASTFromRule(rule);
        storedRules.push(rule); // Store the rule
        res.json(ast);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Combine all stored rules into a single AST
router.post('/combine_rules', (req, res) => {
    try {
        const combinedAST = combineRules(storedRules);
        res.json(combinedAST);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/evaluate_rule', (req, res) => {
    const { rule, data } = req.body;
    try {
        const eligibility = evaluateRule(rule, data);
        res.json({ eligible: eligibility });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
