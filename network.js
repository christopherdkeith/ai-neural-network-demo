// ===================================
// NEURAL NETWORK ALGORITHM
// ===================================
// This file contains a simple neural network with 4 perceptrons in the hidden layer.
// Each perceptron learns to define one edge of a square boundary:
// - Top edge perceptron
// - Bottom edge perceptron
// - Left edge perceptron
// - Right edge perceptron
//
// KEY INSIGHT: Each hidden node IS a line (just like a single perceptron).
// By combining 4 lines, we can detect if a point is inside a square!
// The network learns: "Is point below top AND above bottom AND right of left AND left of right?"

// Training counter
var trainingRound = 0;

// Four perceptrons in the hidden layer (each defines one edge of the square)
var hiddenNodes = [
    {
        name: 'Top Edge',
        weightX: 0,
        weightY: 0,
        bias: 0,
        activation: 0  // stores the output (+1 or -1) after prediction
    },
    {
        name: 'Bottom Edge',
        weightX: 0,
        weightY: 0,
        bias: 0,
        activation: 0
    },
    {
        name: 'Left Edge',
        weightX: 0,
        weightY: 0,
        bias: 0,
        activation: 0
    },
    {
        name: 'Right Edge',
        weightX: 0,
        weightY: 0,
        bias: 0,
        activation: 0
    }
];

// Predict function for a single hidden node (one perceptron)
// Takes a node object and x, y coordinates, returns +1 or -1
function predictNode(node, x, y) {
    // Calculate weighted sum: same formula as single perceptron
    var sum = node.weightX * x + node.weightY * y + node.bias;
    
    // Step activation function: +1 if sum >= 0, otherwise -1
    return sum >= 0 ? 1 : -1;
}

// Network prediction: combines all 4 hidden nodes
// Returns +1 if point is INSIDE square (all nodes say yes), -1 if OUTSIDE
function predict(x, y) {
    // Step 1: Get prediction from each hidden node
    var allTrue = true;
    for (var i = 0; i < hiddenNodes.length; i++) {
        // Calculate and store each node's activation
        hiddenNodes[i].activation = predictNode(hiddenNodes[i], x, y);
        
        // If any node says "no" (-1), the point is outside
        if (hiddenNodes[i].activation !== 1) {
            allTrue = false;
        }
    }
    
    // Step 2: Output layer logic (simple AND gate)
    // Point is inside square only if ALL 4 nodes output +1
    return allTrue ? 1 : -1;
}

// Train the neural network on one complete round through all data
// Each hidden node trains independently to learn its specific edge
function trainOneRound() {
    var errors = 0;
    
    // Get square boundaries for calculating individual node targets
    var bounds = getSquareBounds();
    
    // Go through each training point
    for (var i = 0; i < trainingData.length; i++) {
        var point = trainingData[i];
        
        // Get network prediction
        var prediction = predict(point.x, point.y);
        
        // Calculate error for the overall network
        var error = point.classification - prediction;
        
        if (error !== 0) {
            errors++;
        }
        
        // Train each hidden node individually based on its specific edge
        // Each node learns a separating line (can be diagonal) using standard perceptron learning
        
        // Node 0 (Top Edge): Should output +1 if point is BELOW top edge (y < top)
        var topTarget = point.y < bounds.top ? 1 : -1;
        var topPrediction = predictNode(hiddenNodes[0], point.x, point.y);
        var topError = topTarget - topPrediction;
        if (topError !== 0) {
            hiddenNodes[0].weightX = hiddenNodes[0].weightX + learningRate * topError * point.x;
            hiddenNodes[0].weightY = hiddenNodes[0].weightY + learningRate * topError * point.y;
            hiddenNodes[0].bias = hiddenNodes[0].bias + learningRate * topError;
        }
        
        // Node 1 (Bottom Edge): Should output +1 if point is ABOVE bottom edge (y > bottom)
        var bottomTarget = point.y > bounds.bottom ? 1 : -1;
        var bottomPrediction = predictNode(hiddenNodes[1], point.x, point.y);
        var bottomError = bottomTarget - bottomPrediction;
        if (bottomError !== 0) {
            hiddenNodes[1].weightX = hiddenNodes[1].weightX + learningRate * bottomError * point.x;
            hiddenNodes[1].weightY = hiddenNodes[1].weightY + learningRate * bottomError * point.y;
            hiddenNodes[1].bias = hiddenNodes[1].bias + learningRate * bottomError;
        }
        
        // Node 2 (Left Edge): Should output +1 if point is RIGHT of left edge (x > left)
        var leftTarget = point.x > bounds.left ? 1 : -1;
        var leftPrediction = predictNode(hiddenNodes[2], point.x, point.y);
        var leftError = leftTarget - leftPrediction;
        if (leftError !== 0) {
            hiddenNodes[2].weightX = hiddenNodes[2].weightX + learningRate * leftError * point.x;
            hiddenNodes[2].weightY = hiddenNodes[2].weightY + learningRate * leftError * point.y;
            hiddenNodes[2].bias = hiddenNodes[2].bias + learningRate * leftError;
        }
        
        // Node 3 (Right Edge): Should output +1 if point is LEFT of right edge (x < right)
        var rightTarget = point.x < bounds.right ? 1 : -1;
        var rightPrediction = predictNode(hiddenNodes[3], point.x, point.y);
        var rightError = rightTarget - rightPrediction;
        if (rightError !== 0) {
            hiddenNodes[3].weightX = hiddenNodes[3].weightX + learningRate * rightError * point.x;
            hiddenNodes[3].weightY = hiddenNodes[3].weightY + learningRate * rightError * point.y;
            hiddenNodes[3].bias = hiddenNodes[3].bias + learningRate * rightError;
        }
    }
    
    // Increment round counter
    trainingRound++;
    
    // Update the display to show new weights and accuracy
    updateDisplay();
    updateChart();
    
    // Stop if perfect accuracy achieved
    if (errors === 0) {
        stopTraining();
        alert('Perfect accuracy achieved! All points classified correctly.');
    }
}

// Reset all nodes to initial state
function resetPerceptron() {
    for (var i = 0; i < hiddenNodes.length; i++) {
        hiddenNodes[i].weightX = 0;
        hiddenNodes[i].weightY = 0;
        hiddenNodes[i].bias = 0;
        hiddenNodes[i].activation = 0;
    }
    trainingRound = 0;
}
