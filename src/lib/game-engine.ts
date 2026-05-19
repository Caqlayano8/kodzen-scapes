export type GemType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CellState = GemType | -1 | -2;

export const GEM_COLORS: Record<number, string> = {
  0: "#ef4444",
  1: "#3b82f6",
  2: "#22c55e",
  3: "#eab308",
  4: "#a855f7",
  5: "#f97316",
  6: "#ec4899",
};

export const GEM_NAMES: Record<number, string> = {
  0: "Gul",
  1: "Su",
  2: "Yaprak",
  3: "Gunes",
  4: "Cicek",
  5: "Portakal",
  6: "Lale",
};

export interface Position {
  row: number;
  col: number;
}

export interface Match {
  positions: Position[];
}

export interface LevelConfig {
  rows: number;
  cols: number;
  moves: number;
  targetScore: number;
  gemTypes: number;
  starThresholds: number[];
  hasBlockers: boolean;
  blockerCount: number;
}

export function createGrid(rows: number, cols: number, gemTypes: number, hasBlockers: boolean, blockerCount: number): CellState[][] {
  const grid: CellState[][] = [];
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      let gem: GemType;
      do {
        gem = Math.floor(Math.random() * gemTypes) as GemType;
      } while (
        (c >= 2 && grid[r][c - 1] === gem && grid[r][c - 2] === gem) ||
        (r >= 2 && grid[r - 1][c] === gem && grid[r - 2][c] === gem)
      );
      grid[r][c] = gem;
    }
  }

  if (hasBlockers && blockerCount > 0) {
    let placed = 0;
    const maxAttempts = blockerCount * 10;
    let attempts = 0;
    while (placed < blockerCount && attempts < maxAttempts) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (grid[r][c] !== -1) {
        grid[r][c] = -1;
        placed++;
      }
      attempts++;
    }
  }

  return grid;
}

export function findMatches(grid: CellState[][]): Match[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const matches: Match[] = [];

  for (let r = 0; r < rows; r++) {
    let c = 0;
    while (c < cols) {
      if (grid[r][c] < 0) { c++; continue; }
      let end = c + 1;
      while (end < cols && grid[r][end] === grid[r][c]) end++;
      if (end - c >= 3) {
        const positions: Position[] = [];
        for (let i = c; i < end; i++) positions.push({ row: r, col: i });
        matches.push({ positions });
      }
      c = end;
    }
  }

  for (let c = 0; c < cols; c++) {
    let r = 0;
    while (r < rows) {
      if (grid[r][c] < 0) { r++; continue; }
      let end = r + 1;
      while (end < rows && grid[end][c] === grid[r][c]) end++;
      if (end - r >= 3) {
        const positions: Position[] = [];
        for (let i = r; i < end; i++) positions.push({ row: i, col: c });
        matches.push({ positions });
      }
      r = end;
    }
  }

  return matches;
}

export function removeMatches(grid: CellState[][], matches: Match[]): { grid: CellState[][]; removedCount: number } {
  const newGrid = grid.map(row => [...row]);
  const toRemove = new Set<string>();

  for (const match of matches) {
    for (const pos of match.positions) {
      toRemove.add(`${pos.row},${pos.col}`);
    }
  }

  for (const key of toRemove) {
    const [r, c] = key.split(",").map(Number);
    if (newGrid[r][c] !== -1) {
      newGrid[r][c] = -2;
    }
  }

  return { grid: newGrid, removedCount: toRemove.size };
}

export function applyGravity(grid: CellState[][], gemTypes: number): CellState[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = grid.map(row => [...row]);

  for (let c = 0; c < cols; c++) {
    let writeRow = rows - 1;

    for (let r = rows - 1; r >= 0; r--) {
      if (newGrid[r][c] === -1) {
        if (writeRow === r) writeRow--;
        continue;
      }
      if (newGrid[r][c] >= 0) {
        if (r !== writeRow) {
          newGrid[writeRow][c] = newGrid[r][c];
          newGrid[r][c] = -2;
        }
        writeRow--;
      }
    }

    for (let r = writeRow; r >= 0; r--) {
      if (newGrid[r][c] === -1) continue;
      newGrid[r][c] = Math.floor(Math.random() * gemTypes) as GemType;
    }
  }

  return newGrid;
}

export function isValidSwap(grid: CellState[][], from: Position, to: Position): boolean {
  const rows = grid.length;
  const cols = grid[0].length;

  if (from.row < 0 || from.row >= rows || from.col < 0 || from.col >= cols) return false;
  if (to.row < 0 || to.row >= rows || to.col < 0 || to.col >= cols) return false;
  if (grid[from.row][from.col] < 0 || grid[to.row][to.col] < 0) return false;

  const rowDiff = Math.abs(from.row - to.row);
  const colDiff = Math.abs(from.col - to.col);
  if (!((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1))) return false;

  const testGrid = grid.map(row => [...row]);
  const temp = testGrid[from.row][from.col];
  testGrid[from.row][from.col] = testGrid[to.row][to.col];
  testGrid[to.row][to.col] = temp;

  return findMatches(testGrid).length > 0;
}

export function swapGems(grid: CellState[][], from: Position, to: Position): CellState[][] {
  const newGrid = grid.map(row => [...row]);
  const temp = newGrid[from.row][from.col];
  newGrid[from.row][from.col] = newGrid[to.row][to.col];
  newGrid[to.row][to.col] = temp;
  return newGrid;
}

export function calculateScore(matchCount: number, combo: number): number {
  const baseScore = matchCount * 50;
  const comboMultiplier = 1 + combo * 0.5;
  const chainBonus = combo >= 3 ? 100 : combo >= 2 ? 50 : 0;
  return Math.floor(baseScore * comboMultiplier + chainBonus);
}

// Booster types
export type BoosterType = "rocket" | "bomb" | "rainbow" | "dynamite";

export interface Booster {
  type: BoosterType;
  name: string;
  emoji: string;
  description: string;
}

export const BOOSTERS: Record<BoosterType, Booster> = {
  rocket: { type: "rocket", name: "Roket", emoji: "🚀", description: "Tum satir veya sutunu temizler" },
  bomb: { type: "bomb", name: "Bomba", emoji: "💣", description: "5x5 alani temizler" },
  rainbow: { type: "rainbow", name: "Gokkusagi", emoji: "🌈", description: "Secilen rengin tamamini temizler" },
  dynamite: { type: "dynamite", name: "Dinamit", emoji: "🧨", description: "Ekranin yarisini temizler" },
};

export function detectBooster(match: Match): BoosterType | null {
  if (match.positions.length >= 5) return "rainbow";
  if (match.positions.length === 4) return "rocket";

  // L/T shape detection for bomb
  const rows = new Set(match.positions.map(p => p.row));
  const cols = new Set(match.positions.map(p => p.col));
  if (rows.size >= 2 && cols.size >= 2) return "bomb";

  return null;
}

export function applyBooster(grid: CellState[][], pos: Position, booster: BoosterType, gemTypes: number): { grid: CellState[][]; removedCount: number } {
  const newGrid = grid.map(row => [...row]);
  const rows = grid.length;
  const cols = grid[0].length;
  let removed = 0;

  switch (booster) {
    case "rocket": {
      // Clear entire row
      for (let c = 0; c < cols; c++) {
        if (newGrid[pos.row][c] >= 0) { newGrid[pos.row][c] = -2; removed++; }
      }
      break;
    }
    case "bomb": {
      // Clear 5x5 area
      for (let r = pos.row - 2; r <= pos.row + 2; r++) {
        for (let c = pos.col - 2; c <= pos.col + 2; c++) {
          if (r >= 0 && r < rows && c >= 0 && c < cols && newGrid[r][c] >= 0) {
            newGrid[r][c] = -2; removed++;
          }
        }
      }
      break;
    }
    case "rainbow": {
      // Clear all gems of the same color
      const targetGem = grid[pos.row][pos.col];
      if (targetGem >= 0) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (newGrid[r][c] === targetGem) { newGrid[r][c] = -2; removed++; }
          }
        }
      }
      break;
    }
    case "dynamite": {
      // Clear random half
      const allPositions: Position[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (newGrid[r][c] >= 0) allPositions.push({ row: r, col: c });
        }
      }
      const half = Math.floor(allPositions.length / 2);
      for (let i = allPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
      }
      for (let i = 0; i < half; i++) {
        newGrid[allPositions[i].row][allPositions[i].col] = -2;
        removed++;
      }
      break;
    }
  }

  return { grid: newGrid, removedCount: removed };
}

// Process chain reactions - keep finding and removing matches
export function processChainReactions(grid: CellState[][], gemTypes: number): { grid: CellState[][]; totalRemoved: number; chainCount: number } {
  let currentGrid = grid.map(row => [...row]);
  let totalRemoved = 0;
  let chainCount = 0;

  while (true) {
    const matches = findMatches(currentGrid);
    if (matches.length === 0) break;

    const { grid: afterRemove, removedCount } = removeMatches(currentGrid, matches);
    totalRemoved += removedCount;
    chainCount++;

    currentGrid = applyGravity(afterRemove, gemTypes);
  }

  return { grid: currentGrid, totalRemoved, chainCount };
}

// Obstacle types for advanced levels
export type ObstacleType = "ice" | "chain" | "wood" | "honey" | "rock" | "dark" | "portal";

export const OBSTACLE_INFO: Record<ObstacleType, { name: string; emoji: string; hp: number; description: string }> = {
  ice: { name: "Buz", emoji: "🧊", hp: 1, description: "Eslestirme ile kirilir" },
  chain: { name: "Zincir", emoji: "⛓️", hp: 1, description: "Yaninda eslestirme gerekir" },
  wood: { name: "Tahta Kutu", emoji: "📦", hp: 2, description: "2 darbe ile kirilir" },
  honey: { name: "Bal", emoji: "🍯", hp: 1, description: "Yayilir, hizli temizlenmeli" },
  rock: { name: "Kaya", emoji: "🪨", hp: 0, description: "Tasinamaz, etrafinda eslestirme" },
  dark: { name: "Karanlik", emoji: "🌑", hp: 1, description: "Taslari gizler" },
  portal: { name: "Portal", emoji: "🌀", hp: 0, description: "Taslari baska yere isinlar" },
};

export function getStars(score: number, thresholds: number[]): number {
  if (score >= thresholds[2]) return 3;
  if (score >= thresholds[1]) return 2;
  if (score >= thresholds[0]) return 1;
  return 0;
}

export function hasValidMoves(grid: CellState[][]): boolean {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] < 0) continue;
      if (c + 1 < cols && grid[r][c + 1] >= 0) {
        if (isValidSwap(grid, { row: r, col: c }, { row: r, col: c + 1 })) return true;
      }
      if (r + 1 < rows && grid[r + 1][c] >= 0) {
        if (isValidSwap(grid, { row: r, col: c }, { row: r + 1, col: c })) return true;
      }
    }
  }
  return false;
}
