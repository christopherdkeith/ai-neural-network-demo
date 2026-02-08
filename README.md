# Neural Network Demo - Square Classification

An interactive visualisation of a simple neural network with 4 hidden layer nodes learning to classify points inside or outside a square region.

🔗 **[Live Demo](https://christopherdkeith.github.io/ai-neural-network-demo/)** 🔗

## Overview

This educational demo shows how multiple perceptrons can work together as a neural network to solve non-linear classification problems. Unlike a single perceptron which can only learn a straight line, this network uses 4 nodes in a hidden layer (each learning one edge of a square) combined with AND logic to classify points inside or outside a rectangular region.

**Key Insight:** Neural networks solve complex problems by combining simple components. Each of the 4 hidden nodes learns a decision boundary (line), and the output layer combines them to form a square boundary.

## Features

- **Real-time Visualisation**: Watch 4 decision boundaries (orange dashed lines) adjust as each hidden node learns
- **Interactive Controls**: 
  - Adjust learning rate to see how it affects convergence speed
  - Change the target square's position and size
  - Generate new random data points
  - Reset and retrain from scratch
  - Test predictions by clicking anywhere on the chart
- **Live Metrics**: Track training rounds, accuracy, correct/incorrect classifications, and all 4 nodes' weight values
- **Educational Explanations**: Built-in explanations of how neural networks and hidden layers work

## Demo

The interface displays:
- **Blue points**: Labeled as -1 (outside the target square)
- **Green points**: Labeled as +1 (inside the target square)
- **Red square**: The target region that defines the correct classification
- **Orange dashed lines**: The 4 learned decision boundaries (one per hidden node, converge to square edges)

## How It Works

The neural network has a simple architecture:

**Input Layer** → **Hidden Layer (4 nodes)** → **Output Layer (AND logic)**

### Network Architecture

1. **Hidden Layer (4 Perceptron Nodes)**:
   - **Top Edge Node**: Learns to detect if point is below the top edge (y < top)
   - **Bottom Edge Node**: Learns to detect if point is above the bottom edge (y > bottom)
   - **Left Edge Node**: Learns to detect if point is right of the left edge (x > left)
   - **Right Edge Node**: Learns to detect if point is left of the right edge (x < right)

2. **Output Layer**:
   - Uses AND logic: Point is inside (+1) only if ALL 4 nodes output +1
   - Otherwise, point is outside (-1)

### Training Process

Each hidden node trains independently using the perceptron learning rule:

1. **Make Predictions**: For each node, calculate `(Weight_x × x) + (Weight_y × y) + Bias`
   - If result ≥ 0, output +1
   - If result < 0, output -1

2. **Find Mistakes**: Compare each node's prediction with its target (its specific edge)

3. **Adjust Weights**: When wrong, update using the learning rule:
   ```
   New Weight = Old Weight + (Learning Rate × Error × Input)
   ```

4. **Repeat**: Continue until all nodes correctly detect their edges (100% accuracy)

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)

### View Online

**Just visit:** [https://christopherdkeith.github.io/ai-neural-network-demo/](https://christopherdkeith.github.io/ai-neural-network-demo/)

### Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/christopherdkeith/ai-neural-network-demo.git
   cd ai-neural-network-demo
   ```

2. Open `index.html` in your web browser:
   - Double-click the file, or
   - Right-click and select "Open with" your browser, or
   - Use a local server: `python -m http.server 8000`

### Usage

1. **Click "Start Training"** to begin the learning process
2. **Watch the accuracy increase** as the 4 orange decision boundaries move toward the square edges
3. **Experiment with parameters**:
   - Try different learning rates (0.01 for slow/steady, 0.5 for fast/jumpy)
   - Change the target square's position (center x/y) and size (width/height)
   - Generate new data points to see adaptation
4. **Test predictions**: Click anywhere on the chart to see what the network predicts
5. **Reset and repeat** to see different learning trajectories

## Project Structure

```
ai-neural-network-demo/
├── index.html           # Main HTML interface
├── network.js           # Neural network algorithm (4-node architecture)
├── ui.js                # UI interactions and chart rendering
├── styles.css           # Styling
└── README.md            # This file
```

## Educational Value

This demo illustrates:
- **Neural Network Architecture**: How multiple simple nodes combine to solve complex problems
- **Hidden Layers**: Each node specializes in detecting one feature (edge), output layer combines them
- **Non-linear Classification**: Unlike a single perceptron, this network can classify non-linearly separable regions
- **Distributed Learning**: Each node learns independently with its own weights and targets
- **Core AI Learning Principle**: Start with random values, measure mistakes, adjust parameters to reduce errors
- **Gradient Descent**: How small adjustments based on errors lead to optimal solutions
- **Supervised Learning**: Training with labeled data (points marked as inside/outside)

## Key Concepts

### Neural Network
A multi-layer architecture where:
- **Input Layer**: Raw features (x, y coordinates)
- **Hidden Layer**: 4 perceptron nodes, each learning one decision boundary
- **Output Layer**: Combines hidden layer outputs (AND logic for square detection)

### Hidden Layer Nodes
Each node is a perceptron with:
- **Weights** (Weight_x, Weight_y): Control the angle/slope of the decision boundary
- **Bias**: Shifts the decision boundary's position
- **Activation Function**: Step function that outputs +1 or -1
- **Training Target**: Specific edge detection (e.g., "is point below top edge?")

### Learning Algorithm
Each node uses the perceptron learning rule independently:
- Trains on its specific edge detection task
- Adjusts weights only when predictions are incorrect
- Learning continues until all nodes reach 100% accuracy on their respective edges

## Technical Details

- **Built with**: Vanilla JavaScript (ES5 for broad compatibility)
- **Visualisation**: Highcharts library for interactive scatter plots
- **No Dependencies**: No build tools, bundlers, or frameworks required
- **Pure Client-Side**: Runs entirely in the browser

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

Contributions are welcome! Ideas for enhancements:
- Add visualization of network architecture diagram
- Show each node's activation values during prediction
- Color-code the 4 decision boundaries differently
- Add different shapes (circles, triangles, polygons)
- Implement backpropagation for deeper networks
- Add animation showing forward propagation step-by-step
- Export training data and results

## Related Demos

Explore the full series:
- **[2D Perceptron Demo](https://github.com/christopherdkeith/ai-perceptron-demo)**: Learn linear classification with a single perceptron
- **[3D Perceptron Demo](https://github.com/christopherdkeith/ai-perceptron-demo-2)**: See how perceptrons work in 3D space
- **Neural Network Demo** (this repo): Understand multi-node networks and hidden layers

## License

This project is open source and available under the MIT License.

## Author

Christopher Keith

## Acknowledgments

This demo was created as an educational tool to help people understand how neural networks use multiple simple components (perceptrons) to solve complex classification problems through interactive visualisation.

---

**Learning Note**: This network demonstrates a key principle: combining simple classifiers (linear decision boundaries) can solve more complex problems. Each hidden node learns one aspect of the problem (one edge), and the output layer combines them. Modern deep neural networks use this same principle with many more layers and nodes to solve highly complex tasks.
