const jsep = require('jsep');

// Customize jsep to recognize AND, OR, and the "=" operator
jsep.addBinaryOp('AND', 1);
jsep.addBinaryOp('OR', 1);
jsep.addBinaryOp('=', 6); // Add support for single equals as an assignment

// Function to create AST using jsep
function createASTFromRule(ruleString) {
    try {
        const ast = jsep(ruleString);
        return ast;
    } catch (error) {
        throw new Error(`Invalid rule string: ${error.message}`);
    }
}

// Function to combine multiple rules into a single AST
function combineRules(rules) {
    if (rules.length === 0) return null;

    const combinedConditions = extractConditions(rules);
    const combinedAST = buildCombinedAST(combinedConditions);
    
    return combinedAST;
}

// Helper function to extract conditions from rules
function extractConditions(rules) {
    const conditions = {
        age: [],
        department: [],
        salary: [],
        experience: [],
    };

    rules.forEach(rule => {
        const ast = createASTFromRule(rule);
        traverseAST(ast, conditions);
    });

    return conditions;
}

// Function to traverse the AST and extract conditions
function traverseAST(node, conditions) {
    if (!node) return;

    // Check the type of the node and extract conditions accordingly
    if (node.type === 'LogicalExpression') {
        if (node.operator === 'AND' || node.operator === 'OR') {
            traverseAST(node.left, conditions);
            traverseAST(node.right, conditions);
        }
    } else if (node.type === 'BinaryExpression') {
        traverseAST(node.left, conditions);
        traverseAST(node.right, conditions);
    } else if (node.type === 'ComparisonExpression') {
        if (node.left.name === 'age') {
            conditions.age.push({ operator: node.operator, value: node.right.value });
        } else if (node.left.name === 'department') {
            conditions.department.push(node.right.value);
        } else if (node.left.name === 'salary') {
            conditions.salary.push({ operator: node.operator, value: node.right.value });
        } else if (node.left.name === 'experience') {
            conditions.experience.push({ operator: node.operator, value: node.right.value });
        }
    }
}

// Function to build the combined AST from extracted conditions
function buildCombinedAST(conditions) {
    const combinedAST = {
        type: 'LogicalExpression',
        operator: 'AND',
        left: null,
        right: null,
    };

    // Combine department conditions with OR
    if (conditions.department.length > 0) {
        const departmentAST = {
            type: 'LogicalExpression',
            operator: 'OR',
            left: null,
            right: null,
        };
        
        conditions.department.forEach((dept, index) => {
            const newCondition = {
                type: 'ComparisonExpression',
                operator: '=',
                left: { name: 'department' },
                right: { type: 'Literal', value: dept },
            };
            departmentAST.right = departmentAST.right
                ? {
                    type: 'LogicalExpression',
                    operator: 'OR',
                    left: departmentAST.right,
                    right: newCondition,
                }
                : newCondition;
        });

        combinedAST.left = departmentAST;
    }

    // Combine age conditions with OR
    if (conditions.age.length > 0) {
        const ageAST = {
            type: 'LogicalExpression',
            operator: 'OR',
            left: null,
            right: null,
        };

        conditions.age.forEach((ageCondition, index) => {
            const newCondition = {
                type: 'ComparisonExpression',
                operator: ageCondition.operator,
                left: { name: 'age' },
                right: { type: 'Literal', value: ageCondition.value },
            };
            ageAST.right = ageAST.right
                ? {
                    type: 'LogicalExpression',
                    operator: 'OR',
                    left: ageAST.right,
                    right: newCondition,
                }
                : newCondition;
        });

        combinedAST.left = combinedAST.left
            ? {
                type: 'LogicalExpression',
                operator: 'AND',
                left: combinedAST.left,
                right: ageAST,
            }
            : ageAST;
    }

    // Combine salary conditions with OR
    if (conditions.salary.length > 0) {
        const salaryAST = {
            type: 'LogicalExpression',
            operator: 'OR',
            left: null,
            right: null,
        };

        conditions.salary.forEach((salaryCondition, index) => {
            const newCondition = {
                type: 'ComparisonExpression',
                operator: salaryCondition.operator,
                left: { name: 'salary' },
                right: { type: 'Literal', value: salaryCondition.value },
            };
            salaryAST.right = salaryAST.right
                ? {
                    type: 'LogicalExpression',
                    operator: 'OR',
                    left: salaryAST.right,
                    right: newCondition,
                }
                : newCondition;
        });

        combinedAST.left = combinedAST.left
            ? {
                type: 'LogicalExpression',
                operator: 'AND',
                left: combinedAST.left,
                right: salaryAST,
            }
            : salaryAST;
    }

    // Combine experience conditions with OR
    if (conditions.experience.length > 0) {
        const experienceAST = {
            type: 'LogicalExpression',
            operator: 'OR',
            left: null,
            right: null,
        };

        conditions.experience.forEach((expCondition, index) => {
            const newCondition = {
                type: 'ComparisonExpression',
                operator: expCondition.operator,
                left: { name: 'experience' },
                right: { type: 'Literal', value: expCondition.value },
            };
            experienceAST.right = experienceAST.right
                ? {
                    type: 'LogicalExpression',
                    operator: 'OR',
                    left: experienceAST.right,
                    right: newCondition,
                }
                : newCondition;
        });

        combinedAST.left = combinedAST.left
            ? {
                type: 'LogicalExpression',
                operator: 'AND',
                left: combinedAST.left,
                right: experienceAST,
            }
            : experienceAST;
    }

    return combinedAST;
}

// Function to evaluate the combined AST against user data
function evaluateRule(ast, data) {
    if (!ast) return false;

    switch (ast.type) {
        case 'LogicalExpression':
            if (ast.operator === 'OR') {
                return evaluateRule(ast.left, data) || evaluateRule(ast.right, data);
            } else if (ast.operator === 'AND') {
                return evaluateRule(ast.left, data) && evaluateRule(ast.right, data);
            }
            break;

        case 'BinaryExpression':
            return evaluateBinaryExpression(ast, data);
    }

    return false;
}

// Function to evaluate binary expressions
function evaluateBinaryExpression(ast, data) {
    const leftValue = data[ast.left.name];
    const rightValue = ast.right.type === 'Literal' ? ast.right.value : data[ast.right.name];

    switch (ast.operator) {
        case '>':
            return leftValue > rightValue;
        case '<':
            return leftValue < rightValue;
        case '=':
            return leftValue === rightValue;
        default:
            return false;
    }
}

module.exports = { createASTFromRule, combineRules, evaluateRule };
