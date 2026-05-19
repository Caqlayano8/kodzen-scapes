"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  CellState,
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

const CELL_SIZE = 60;
const PADDING = 8;
const GEM_RADIUS = 23;

const GEM_EMOJIS = ["🔴", "🟢", "🔵", "🟡", "🟣", "🟠", "⚪"];
const GEM_SHAPES = ["circle", "diamond", "square", "triangle", "hexagon", "star", "heart"];

function drawGem(ctx: CanvasRenderingContext2D, x: number, y: number, gemType: number, size: number, selected: boolean) {
  const cx = x + CELL_SIZE / 2;
  const cy = y + CELL_SIZE / 2;
  const color = GEM_COLORS[gemType] || "#888";
  const r = size;

  // Shadow
  ctx.beginPath();
  ctx.arc(cx + 2, cy + 3, r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fill();

  // Main gem body with gradient
  const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
  grad.addColorStop(0, lighten(color, 60));
  grad.addColorStop(0.4, lighten(color, 20));
  grad.addColorStop(0.8, color);
  grad.addColorStop(1, darken(color, 30));

  ctx.beginPath();
  // Draw different shapes based on gem type
  const shape = GEM_SHAPES[gemType] || "circle";
  switch (shape) {
    case "diamond":
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r, cy);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - r, cy);
      ctx.closePath();
      break;
    case "square":
      ctx.roundRect(cx - r * 0.8, cy - r * 0.8, r * 1.6, r * 1.6, r * 0.25);
      break;
    case "triangle":
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r * 0.9, cy + r * 0.7);
      ctx.lineTo(cx - r * 0.9, cy + r * 0.7);
      ctx.closePath();
      break;
    case "hexagon":
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    case "star": {
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const rad = i % 2 === 0 ? r : r * 0.5;
        const px = cx + rad * Math.cos(angle);
        const py = cy + rad * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
    case "heart": {
      ctx.moveTo(cx, cy + r * 0.6);
      ctx.bezierCurveTo(cx - r * 1.2, cy - r * 0.2, cx - r * 0.6, cy - r, cx, cy - r * 0.4);
      ctx.bezierCurveTo(cx + r * 0.6, cy - r, cx + r * 1.2, cy - r * 0.2, cx, cy + r * 0.6);
      break;
    }
    default: // circle
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;
  }
  ctx.fillStyle = grad;
  ctx.fill();

  // Outline
  ctx.strokeStyle = darken(color, 40);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Shine highlight
  ctx.beginPath();
  ctx.arc(cx - r * 0.25, cy - r * 0.25, r * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fill();

  // Small sparkle
  ctx.beginPath();
  ctx.arc(cx - r * 0.15, cy - r * 0.35, r * 0.08, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fill();

  // Selection ring
  if (selected) {
    ctx.beginPath();
    ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#ffd700";
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function lighten(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (num >> 16) + Math.floor(255 * percent / 100));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.floor(255 * percent / 100));
  const b = Math.min(255, (num & 0xff) + Math.floor(255 * percent / 100));
  return `rgb(${r},${g},${b})`;
}

function darken(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (num >> 16) - Math.floor(255 * percent / 100));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.floor(255 * percent / 100));
  const b = Math.max(0, (num & 0xff) - Math.floor(255 * percent / 100));
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
      levelConfig.rows, levelConfig.cols, levelConfig.gemTypes,
      levelConfig.hasBlockers, levelConfig.blockerCount
    );
    setGrid(newGrid);
    gridRef.current = newGrid;
  }, [levelConfig]);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, currentGrid: CellState[][], selectedPos: Position | null) => {
    const width = levelConfig.cols * CELL_SIZE;
    const height = levelConfig.rows * CELL_SIZE;

    ctx.clearRect(0, 0, width + PADDING * 2, height + PADDING * 2);

    // Board background
    ctx.fillStyle = "#2d5a26";
    ctx.beginPath();
    ctx.roundRect(0, 0, width + PADDING * 2, height + PADDING * 2, 16);
    ctx.fill();

    // Board inner shadow
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.roundRect(2, 2, width + PADDING * 2 - 4, height + PADDING * 2 - 4, 14);
    ctx.fill();

    for (let r = 0; r < levelConfig.rows; r++) {
      for (let c = 0; c < levelConfig.cols; c++) {
        const x = c * CELL_SIZE + PADDING;
        const y = r * CELL_SIZE + PADDING;
        const gem = currentGrid[r]?.[c];

        // Cell background
        const isLight = (r + c) % 2 === 0;
        ctx.fillStyle = isLight ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, CELL_SIZE - 4, CELL_SIZE - 4, 8);
        ctx.fill();

        if (gem === -1) {
          // Blocker
          ctx.fillStyle = "#5c4033";
          ctx.beginPath();
          ctx.roundRect(x + 6, y + 6, CELL_SIZE - 12, CELL_SIZE - 12, 8);
          ctx.fill();
          ctx.strokeStyle = "#8b6f47";
          ctx.lineWidth = 2;
          ctx.stroke();
          // X mark
          ctx.strokeStyle = "#a0714a";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x + 18, y + 18);
          ctx.lineTo(x + CELL_SIZE - 18, y + CELL_SIZE - 18);
          ctx.moveTo(x + CELL_SIZE - 18, y + 18);
          ctx.lineTo(x + 18, y + CELL_SIZE - 18);
          ctx.stroke();
        } else if (gem !== undefined && gem >= 0) {
          const isSelected = selectedPos !== null && selectedPos.row === r && selectedPos.col === c;
          drawGem(ctx, x, y, gem, GEM_RADIUS, isSelected);
        }
      }
    }

    // Board border
    ctx.strokeStyle = "#1a3a15";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(0, 0, width + PADDING * 2, height + PADDING * 2, 16);
    ctx.stroke();
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

      await new Promise(resolve => setTimeout(resolve, 180));

      workingGrid = applyGravity(workingGrid, levelConfig.gemTypes);
      setGrid([...workingGrid.map(r => [...r])]);

      await new Promise(resolve => setTimeout(resolve, 220));
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
  const progressPercent = Math.min((score / levelConfig.targetScore) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Level info bar - Gardenscapes style */}
      <div className="w-full max-w-lg">
        <div className="wood-panel px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-lg drop-shadow-lg">Bolum {levelNumber}</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map(s => (
                <span key={s} className={`text-xl ${stars >= s ? "star-filled" : "star-empty"}`}>⭐</span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            {/* Score */}
            <div className="flex items-center gap-2">
              <span className="text-yellow-300 text-xs font-bold">SKOR</span>
              <span className="text-white font-black text-lg">{score.toLocaleString()}</span>
            </div>
            {/* Moves */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${movesLeft <= 5 ? "bg-red-600/80" : "bg-green-700/80"}`}>
              <span className="text-white text-xs font-bold">HAMLE</span>
              <span className="text-white font-black text-xl">{movesLeft}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2 relative">
            <div className="w-full bg-black/30 rounded-full h-4 border border-white/10">
              <div
                className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 h-full rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
              </div>
            </div>
            <div className="absolute right-2 top-0.5 text-[10px] text-white font-bold">
              {levelConfig.targetScore.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Combo display */}
      {showCombo && combo > 1 && (
        <div className="animate-pop-in">
          <div className="wood-panel px-6 py-2 text-center">
            <span className="text-white font-black text-2xl drop-shadow-lg">{combo}x KOMBO!</span>
          </div>
        </div>
      )}

      {/* Game Board */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleClick}
          className="rounded-2xl shadow-2xl cursor-pointer"
          style={{ maxWidth: "100%", height: "auto" }}
        />
        {isAnimating && <div className="absolute inset-0 cursor-wait" />}
      </div>
    </div>
  );
}
