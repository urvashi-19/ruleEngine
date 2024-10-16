document.getElementById('ruleForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const ruleInput = document.getElementById('ruleInput').value;

    const response = await fetch('/api/create_rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rule: ruleInput }),
    });

    const result = await response.json();
    displayRule(ruleInput, result);
});

function displayRule(rule, ast) {
    const ruleList = document.getElementById('ruleList');
    const listItem = document.createElement('li');
    const viewASTButton = document.createElement('button');

    viewASTButton.textContent = "View AST";
    viewASTButton.addEventListener('click', function() {
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`<pre>${JSON.stringify(ast, null, 2)}</pre>`);
    });

    listItem.textContent = rule;
    listItem.appendChild(viewASTButton);
    ruleList.appendChild(listItem);
}

// Handle combining rules
document.getElementById('combineButton').addEventListener('click', async function() {
    const rules = [...document.querySelectorAll('#ruleList li')].map(item => item.firstChild.textContent); // Extract rule text
    const combinedRule = combineRules(rules); // Combine rules here

    // Display combined rule
    document.getElementById('combinedRuleOutput').textContent = combinedRule;

    // Show the view combined button
    document.getElementById('viewCombinedButton').style.display = 'inline';

    // Store the combined rule in the button for viewing AST
    document.getElementById('viewCombinedButton').dataset.combinedRule = combinedRule;
});

// Combine rules function
function combineRules(rules) {
    // Logic to combine rules
    return rules.join(' AND '); // Combine rules with AND for simplicity
}

// View combined AST
document.getElementById('viewCombinedButton').addEventListener('click', async function() {
    const combinedRule = this.dataset.combinedRule; // Get combined rule from dataset

    const response = await fetch('/api/create_rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rule: combinedRule }),
    });

    const combinedASTResult = await response.json();
    
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`<pre>${JSON.stringify(combinedASTResult, null, 2)}</pre>`);
});

// Evaluate eligibility
document.getElementById('eligibilityForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const age = document.getElementById('age').value;
    const department = document.getElementById('department').value;
    const salary = document.getElementById('salary').value;
    const experience = document.getElementById('experience').value;

    const inputData = {
        age: parseInt(age),
        department: department,
        salary: parseInt(salary),
        experience: parseInt(experience),
    };

    const combinedRule = document.getElementById('viewCombinedButton').dataset.combinedRule;

    const response = await fetch('/api/evaluate_rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rule: combinedRule, data: inputData }),
    });

    const result = await response.json();
    document.getElementById('eligibilityResult').textContent = `Eligibility: ${result.eligible}`;
});
