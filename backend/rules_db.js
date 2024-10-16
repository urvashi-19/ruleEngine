// backend/rules_db.js
const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    ruleName: { type: String, required: true },
    ruleAST: { type: Object, required: true },
});

const Rule = mongoose.model('Rule', ruleSchema);

async function saveRuleToDB(ruleName, ruleAST) {
    const newRule = new Rule({ ruleName, ruleAST });
    const savedRule = await newRule.save();
    return savedRule._id;
}

async function getRuleById(ruleId) {
    return await Rule.findById(ruleId);
}

module.exports = { saveRuleToDB, getRuleById };
