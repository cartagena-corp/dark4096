import { Tile, Direction, GameState, HistoryEntry, GridSize, GameMode } from '@/types/game'
import { WIN_VALUE, SPAWN_4_PROBABILITY } from '@/constants/game'

let tileIdCounter = 0
function generateId(): string {
  return `tile_${++tileIdCounter}_${Math.random().toString(36).slice(2, 7)}`
}

/** Build a fresh empty board */
export function createEmptyBoard(gridSize: GridSize): (Tile | null)[][] {
  return Array.from({ length: gridSize }, () => Array(gridSize).fill(null))
}

/** Build a board from a tiles array (for rendering) */
export function buildBoardFromTiles(tiles: Tile[], gridSize: GridSize): (Tile | null)[][] {
  const board = createEmptyBoard(gridSize)
  for (const tile of tiles) {
    if (tile.row >= 0 && tile.row < gridSize && tile.col >= 0 && tile.col < gridSize) {
      board[tile.row][tile.col] = tile
    }
  }
  return board
}

/** Find all empty cells on the board */
export function getEmptyCells(board: (Tile | null)[][], gridSize: GridSize): { row: number; col: number }[] {
  const empty: { row: number; col: number }[] = []
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (!board[r][c]) empty.push({ row: r, col: c })
    }
  }
  return empty
}

/** Spawn a new tile on a random empty cell */
export function spawnTile(board: (Tile | null)[][], gridSize: GridSize): { board: (Tile | null)[][]; tile: Tile | null } {
  const empty = getEmptyCells(board, gridSize)
  if (empty.length === 0) return { board, tile: null }

  const pos = empty[Math.floor(Math.random() * empty.length)]
  const value = Math.random() < SPAWN_4_PROBABILITY ? 4 : 2
  const tile: Tile = {
    id: generateId(),
    value,
    row: pos.row,
    col: pos.col,
    isNew: true,
    isMerged: false,
  }

  const newBoard = board.map(row => [...row])
  newBoard[pos.row][pos.col] = tile
  return { board: newBoard, tile }
}

/** Slide a single row/column to the left, returns {line, score, moved} */
function slideLeft(line: (Tile | null)[], gridSize: GridSize): { line: (Tile | null)[]; score: number; moved: boolean } {
  const tiles = line.filter(Boolean) as Tile[]
  const result: (Tile | null)[] = []
  let score = 0
  let moved = false
  let i = 0

  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i].value === tiles[i + 1].value) {
      const merged: Tile = {
        id: generateId(),
        value: tiles[i].value * 2,
        row: tiles[i].row,
        col: tiles[i].col,
        isNew: false,
        isMerged: true,
      }
      score += merged.value
      result.push(merged)
      i += 2
      moved = true
    } else {
      result.push({ ...tiles[i], isMerged: false })
      i++
    }
  }

  while (result.length < gridSize) result.push(null)

  if (!moved) {
    for (let j = 0; j < gridSize; j++) {
      const orig = line[j]
      const res = result[j]
      if ((orig === null) !== (res === null)) {
        moved = true
        break
      }
      if (orig && res && orig.id !== res.id) {
        moved = true
        break
      }
    }
  }

  return { line: result, score, moved }
}

function transpose(board: (Tile | null)[][]): (Tile | null)[][] {
  return board[0].map((_, ci) => board.map(row => row[ci]))
}

function reverseRows(board: (Tile | null)[][]): (Tile | null)[][] {
  return board.map(row => [...row].reverse())
}

export interface MoveResult {
  tiles: Tile[]
  score: number
  moved: boolean
  gameOver: boolean
  gameWon: boolean
}

export function applyMove(tiles: Tile[], direction: Direction, gridSize: GridSize): MoveResult {
  // Store previous positions for animation tracking
  const prevPositions = new Map<string, { row: number; col: number }>()
  for (const tile of tiles) {
    prevPositions.set(tile.id, { row: tile.row, col: tile.col })
  }

  let board = buildBoardFromTiles(tiles, gridSize)
  let totalScore = 0
  let anyMoved = false

  if (direction === 'left') {
    const { newBoard, score, moved } = slideBoard(board, gridSize)
    board = newBoard
    totalScore += score
    anyMoved = moved
  } else if (direction === 'right') {
    board = reverseRows(board)
    const { newBoard, score, moved } = slideBoard(board, gridSize)
    board = reverseRows(newBoard)
    totalScore += score
    anyMoved = moved
  } else if (direction === 'up') {
    board = transpose(board)
    const { newBoard, score, moved } = slideBoard(board, gridSize)
    board = transpose(newBoard)
    totalScore += score
    anyMoved = moved
  } else if (direction === 'down') {
    board = transpose(board)
    board = reverseRows(board)
    const { newBoard, score, moved } = slideBoard(board, gridSize)
    board = reverseRows(newBoard)
    board = transpose(board)
    totalScore += score
    anyMoved = moved
  }

  if (!anyMoved) {
    return { tiles, score: 0, moved: false, gameOver: false, gameWon: false }
  }

  const updatedTiles: Tile[] = []
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = board[r][c]
      if (cell) {
        const prev = prevPositions.get(cell.id)
        updatedTiles.push({
          ...cell,
          row: r,
          col: c,
          isNew: false,
          prevRow: prev?.row ?? r,
          prevCol: prev?.col ?? c,
        })
      }
    }
  }

  const { board: boardWithNew, tile: newTile } = spawnTile(board, gridSize)
  const finalTiles: Tile[] = updatedTiles
  if (newTile) {
    finalTiles.push(newTile)
  }

  const gameWon = finalTiles.some(t => t.value >= WIN_VALUE)
  const gameOver = !hasMovesLeft(boardWithNew, gridSize)

  return { tiles: finalTiles, score: totalScore, moved: true, gameOver, gameWon }
}

function slideBoard(board: (Tile | null)[][], gridSize: GridSize): { newBoard: (Tile | null)[][]; score: number; moved: boolean } {
  let totalScore = 0
  let anyMoved = false
  const newBoard = board.map(row => {
    const { line, score, moved } = slideLeft(row, gridSize)
    totalScore += score
    if (moved) anyMoved = true
    return line
  })
  return { newBoard, score: totalScore, moved: anyMoved }
}

export function hasMovesLeft(board: (Tile | null)[][], gridSize: GridSize): boolean {
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (!board[r][c]) return true
    }
  }
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const val = board[r][c]?.value
      if (c + 1 < gridSize && board[r][c + 1]?.value === val) return true
      if (r + 1 < gridSize && board[r + 1][c]?.value === val) return true
    }
  }
  return false
}

export function initGame(bestScore = 0, gridSize: GridSize = 4, gameMode: GameMode = 'classic'): GameState {
  let board = createEmptyBoard(gridSize)
  const { board: b1 } = spawnTile(board, gridSize)
  const { board: b2 } = spawnTile(b1, gridSize)
  board = b2

  const tiles: Tile[] = []
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (board[r][c]) tiles.push(board[r][c] as Tile)
    }
  }

  return {
    board,
    tiles,
    score: 0,
    bestScore,
    moveCount: 0,
    gameOver: false,
    gameWon: false,
    continued: false,
    history: [],
    gridSize,
    gameMode,
  }
}

export function snapshotHistory(state: GameState): HistoryEntry {
  return {
    tiles: state.tiles.map(t => ({ ...t })),
    score: state.score,
    moveCount: state.moveCount,
  }
}
