// Filename: ComplexCode.js

// This code demonstrates an implementation of the A* search algorithm
// It solves a maze by finding the shortest path from the start to the goal

class Node {
  constructor(x, y, parent, g = 0, h = 0) {
    this.x = x;
    this.y = y;
    this.parent = parent;
    this.g = g;
    this.h = h;
  }

  get f() {
    return this.g + this.h;
  }
}

class AStar {
  constructor(maze) {
    this.maze = maze;
    this.openList = [];
    this.closedList = [];
  }

  search(startX, startY, goalX, goalY) {
    const startNode = new Node(startX, startY, null);
    const goalNode = new Node(goalX, goalY, null);
    this.openList.push(startNode);

    while (this.openList.length > 0) {
      const currentNode = this.openList.shift();
      this.closedList.push(currentNode);

      if (currentNode.x === goalNode.x && currentNode.y === goalNode.y)
        return this.getPath(currentNode);

      this.expandNeighbors(currentNode, goalNode);
      this.openList.sort((a, b) => a.f - b.f);
    }

    return null;
  }

  expandNeighbors(node, goalNode) {
    const neighbors = this.getNeighbors(node);

    for (const neighbor of neighbors) {
      if (this.closedList.find(n => n.x === neighbor.x && n.y === neighbor.y))
        continue;

      const gScore = node.g + 1;
      const hScore = this.calculateHeuristic(neighbor, goalNode);
      const existingNode = this.openList.find(
        n => n.x === neighbor.x && n.y === neighbor.y
      );

      if (existingNode) {
        if (gScore < existingNode.g) {
          existingNode.g = gScore;
          existingNode.parent = node;
        }
      } else {
        const newNode = new Node(neighbor.x, neighbor.y, node, gScore, hScore);
        this.openList.push(newNode);
      }
    }
  }

  getNeighbors(node) {
    const { x, y } = node;
    const neighbors = [];

    if (x > 0 && this.maze[x - 1][y] !== 1)
      neighbors.push(new Node(x - 1, y, null));

    if (x < this.maze.length - 1 && this.maze[x + 1][y] !== 1)
      neighbors.push(new Node(x + 1, y, null));

    if (y > 0 && this.maze[x][y - 1] !== 1)
      neighbors.push(new Node(x, y - 1, null));

    if (y < this.maze[0].length - 1 && this.maze[x][y + 1] !== 1)
      neighbors.push(new Node(x, y + 1, null));

    return neighbors;
  }

  calculateHeuristic(node, goalNode) {
    const dX = Math.abs(node.x - goalNode.x);
    const dY = Math.abs(node.y - goalNode.y);
    return dX + dY;
  }

  getPath(node) {
    const path = [];

    while (node) {
      path.unshift({ x: node.x, y: node.y });
      node = node.parent;
    }

    return path;
  }
}

// Create and test maze
const maze = [
  [0, 0, 1, 0, 0, 0],
  [0, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0]
];

const astar = new AStar(maze);
const path = astar.search(0, 0, 4, 5);

console.log("Shortest path:");
console.log(path);
