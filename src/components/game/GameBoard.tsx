"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  CellState,
  GemType,
  Position,
  LevelConfig,
  GEM_COLORS,
  createGrid,
  findMatches,
  removeMatches,
  applyGravity,
  isValidSwap,
  swapGems,
  calculateScore,
  getStars,
  hasValidMoves,
} from "@/lib/game-engine";

interface GameBoardProps {
  levelConfig: LevelConfig;
  levelNumber: number;
  onComplete: (score: number, stars: number, moves: number) => void;
  onFail: () => void;
}

const CELL_SIZE = 56;
const PADDING = 4;

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (num >> 16) + Math.floor(255 * percent / 100));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.floor(255 * percent / 100));
  const b = Math.min(255, (num & 0x0000ff) + Math.floor(255 * percent / 100));
  return `rgb(${r},${g},${b})`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (num >> 16) - Math.floor(255 * percent / 100));
  const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.floor(255 * percent / 100));
  const b = Math.max(0, (num & 0x0000ff) - Math.floor(255 * percent / 100));
  return `rgb(${r},${g},${b})`;
}

export default function GameBoard({ levelConfig, levelNumber, onComplete, onFail }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(levelConfig.moves);
  const [selected, setSelected] = useState<Position | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gridRef = useRef<CellState[][]>([]);
  const scoreRef = useRef(0);

  useEffect(() => {
    const newGrid = createGrid(
      levelConfig.rows,
      levelConfig.cols,
      levelConfig.gemTypes,
      levelConfig.hasBlockers,
      levelConfig.blockerCount
    );
    setGrid(newGrid);
    gridRef.current = newGrid;
  }, [levelConfig]);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, currentGrid: CellState[][], selectedPos: Position | null) => {
    const width = levelConfig.cols * CELL_SIZE;
    const height = levelConfig.rows * CELL_SIZE;

    ctx.clearRect(0, 0, width + PADDING * 2, height + PADDING * 2);

    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.roundRect(0, 0, width + PADDING * 2, height + PADDING * 2, 12);
    ctx.fill();

    for (let r = 0; r < levelConfig.rows; r++) {
      for (let c = 0; c < levelConfig.cols; c++) {
        const x = c * CELL_SIZE + PADDING;
        const y = r * CELL_SIZE + PADDING;
        const gem = currentGrid[r]?.[c];

        ctx.fillStyle = (r + c) % 2 === 0 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)";
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2, 4);
        ctx.fill();

        if (gem === -1) {
          ctx.fillStyle = "#4b5563";
          ctx.beginPath();
          ctx.roundRect(x + 4, y + 4, CELL_SIZE - 8, CELL_SIZE - 8, 6);
          ctx.fill();
          ctx.strokeStyle = "#6b7280";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x + 16, y + 16);
          ctx.lineTo(x + CELL_SIZE - 16, y + CELL_SIZE - 16);
          ctx.moveTo(x + CELL_SIZE - 16, y + 16);
          ctx.lineTo(x + 16, y + CELL_SIZE - 16);
          ctx.stroke();
        } else if (gem !== undefined && gem >= 0) {
          const color = GEM_COLORS[gem] || "#888";
          const cx = x + CELL_SIZE / 2;
          const cy = y + CELL_SIZE / 2;
          const radius = CELL_SIZE / 2 - 6;

          ctx.beginPath();
          ctx.arc(cx + 2, cy + 2, radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0,0,0,0.2)";
          ctx.fill();

          const gradient = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, radius);
          gradient.addColorStop(0, lightenColor(color, 40));
          gradient.addColorStop(0.7, color);
          gradient.addColorStop(1, darkenColor(color, 30));

          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(cx - 5, cy - 5, radius * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.45)";
          ctx.fill();

          if (selectedPos && selectedPos.row === r && selectedPos.col === c) {
            ctx.beginPath();
            ctx.arc(cx, cy, radius + 3, 0, Math.PI * 2);
            ctx.strokeStyle = "#fbbf24";
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        }
      }
    }
  }, [levelConfig]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || grid.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawGrid(ctx, grid, selected);
  }, [grid, selected, drawGrid]);

  const processMatches = useCallback(async (currentGrid: CellState[][]): Promise<{ finalGrid: CellState[][]; totalScore: number }> => {
    let workingGrid = currentGrid.map(r => [...r]);
    let totalScore = 0;
    let comboLevel = 0;

    while (true) {
      const matches = findMatches(workingGrid);
      if (matches.length === 0) break;

      comboLevel++;
      setCombo(comboLevel);
      if (comboLevel > 1) {
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 800);
      }

      const totalMatched = matches.reduce((acc, m) => acc + m.positions.length, 0);
      totalScore += calculateScore(totalMatched, comboLevel);

      const { grid: clearedGrid } = removeMatches(workingGrid, matches);
      workingGrid = clearedGrid;
      setGrid([...workingGrid.map(r => [...r])]);

      await new Promise(resolve => setTimeout(resolve, 150));

      workingGrid = applyGravity(workingGrid, levelConfig.gemTypes);
      setGrid([...workingGrid.map(r => [...r])]);

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return { finalGrid: workingGrid, totalScore };
  }, [levelConfig.gemTypes]);

  const handleClick = useCallback(async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isAnimating || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX - PADDING;
    const y = (e.clientY - rect.top) * scaleY - PADDING;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (row < 0 || row >= levelConfig.rows || col < 0 || col >= levelConfig.cols) return;
    if (gridRef.current[row]?.[col] === undefined || gridRef.current[row][col] < 0) return;

    if (!selected) {
      setSelected({ row, col });
      return;
    }

    const from = selected;
    const to = { row, col };
    setSelected(null);

    if (from.row === row && from.col === col) return;

    if (!isValidSwap(gridRef.current, from, to)) return;

    setIsAnimating(true);

    const swappedGrid = swapGems(gridRef.current, from, to);
    setGrid(swappedGrid);
    gridRef.current = swappedGrid;

    const newMoves = movesLeft - 1;
    setMovesLeft(newMoves);

    const { finalGrid, totalScore } = await processMatches(swappedGrid);

    const newScore = scoreRef.current + totalScore;
    scoreRef.current = newScore;
    setScore(newScore);
    setGrid(finalGrid);
    gridRef.current = finalGrid;

    if (!hasValidMoves(finalGrid)) {
      const reshuffled = createGrid(
        levelConfig.rows, levelConfig.cols, levelConfig.gemTypes,
        levelConfig.hasBlockers, levelConfig.blockerCount
      );
      setGrid(reshuffled);
      gridRef.current = reshuffled;
    }

    if (newScore >= levelConfig.targetScore) {
      const stars = getStars(newScore, levelConfig.starThresholds);
      setGameOver(true);
      setTimeout(() => onComplete(newScore, stars, levelConfig.moves - newMoves), 500);
    } else if (newMoves <= 0) {
      setGameOver(true);
      setTimeout(() => onFail(), 500);
    }

    setCombo(0);
    setIsAnimating(false);
  }, [selected, isAnimating, gameOver, movesLeft, levelConfig, processMatches, onComplete, onFail]);

  const canvasWidth = levelConfig.cols * CELL_SIZE + PADDING * 2;
  const canvasHeight = levelConfig.rows * CELL_SIZE + PADDING * 2;
  const stars = getStars(score, levelConfig.starThresholds);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-2 px-2">
          <span className="text-sm font-bold text-emerald-200">Bolum {levelNumber}</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(s => (
              <span key={s} className={`text-xl ${stars >= s ? "text-yellow-400" : "text-gray-600"}`}>⭐</span>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-3 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-2">
            <div className="text-center">
              <div className="text-xs text-gray-400">Skor</div>
              <div className="text-lg font-bold text-white">{score.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Hedef</div>
              <div className="text-lg font-bold text-emerald-400">{levelConfig.targetScore.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Hamle</div>
              <div className={`text-lg font-bold ${movesLeft <= 5 ? "text-red-400" : "text-white"}`}>{movesLeft}</div>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((score / levelConfig.targetScore) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {showCombo && combo > 1 && (
        <div className="animate-bounce">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full text-xl font-bold shadow-lg">
            {combo}x Kombo!
          </div>
        </div>
      )}

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleClick}
          className="rounded-xl shadow-2xl cursor-pointer border-2 border-emerald-500/30"
          style={{ maxWidth: "100%", height: "auto" }}
        />
        {isAnimating && <div className="absolute inset-0 cursor-wait" />}
      </div>
    </div>
  );
}
