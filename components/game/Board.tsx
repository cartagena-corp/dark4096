'use client'

import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tile, GridSize } from '@/types/game'
import { getTileColor } from '@/constants/game'

interface TileCellProps {
  tile: Tile
  cellSize: number
  gap: number
}

const TileCell = memo(function TileCell({ tile, cellSize, gap }: TileCellProps) {
  const colors = getTileColor(tile.value)
  const isSpecial = tile.value >= 2048

  const x = tile.col * (cellSize + gap)
  const y = tile.row * (cellSize + gap)

  // Calculate if this tile actually moved
  const prevX = (tile.prevCol ?? tile.col) * (cellSize + gap)
  const prevY = (tile.prevRow ?? tile.row) * (cellSize + gap)
  const didMove = prevX !== x || prevY !== y

  // Determine initial position for animation
  const getInitial = () => {
    if (tile.isNew) {
      return { scale: 0, opacity: 0, x, y }
    }
    if (didMove) {
      return { scale: 1, opacity: 1, x: prevX, y: prevY }
    }
    // Tile didn't move - start at current position (no animation)
    return { scale: 1, opacity: 1, x, y }
  }

  // Determine transition based on tile state
  const getTransition = () => {
    if (tile.isNew) {
      return { duration: 0.15 }
    }
    if (tile.isMerged) {
      return { duration: 0.12 }
    }
    if (didMove) {
      return { duration: 0.1 }
    }
    // No movement - instant (no transition)
    return { duration: 0 }
  }

  return (
    <motion.div
      key={tile.id}
      initial={getInitial()}
      animate={{ scale: 1, opacity: 1, x, y }}
      transition={getTransition()}
      style={{
        width: cellSize,
        height: cellSize,
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: colors.bg,
        color: colors.fg,
        borderRadius: 'var(--radius)',
        boxShadow: isSpecial
          ? `0 0 20px 2px ${colors.bg}80`
          : '0 2px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        willChange: didMove || tile.isNew ? 'transform' : 'auto',
        zIndex: tile.isMerged ? 10 : tile.isNew ? 5 : 1,
      }}
      className={colors.size}
      aria-label={`Tile with value ${tile.value}`}
    >
      {tile.value}
    </motion.div>
  )
})

interface BoardProps {
  tiles: Tile[]
  cellSize: number
  gap: number
  gridSize: GridSize
}

export const Board = memo(function Board({ tiles, cellSize, gap, gridSize }: BoardProps) {
  const boardSize = gridSize * cellSize + (gridSize - 1) * gap
  const padding = gap

  return (
    <div
      className="relative select-none"
      style={{
        width: boardSize + padding * 2,
        height: boardSize + padding * 2,
        backgroundColor: 'var(--board-bg)',
        borderRadius: 'calc(var(--radius) * 1.5)',
        padding,
        boxShadow: 'var(--game-shadow)',
      }}
      aria-label="Game board"
      role="grid"
    >
      {/* Empty cells */}
      {Array.from({ length: gridSize }).map((_, r) =>
        Array.from({ length: gridSize }).map((_, c) => (
          <div
            key={`cell-${r}-${c}`}
            style={{
              position: 'absolute',
              width: cellSize,
              height: cellSize,
              left: padding + c * (cellSize + gap),
              top: padding + r * (cellSize + gap),
              backgroundColor: 'var(--cell-bg)',
              borderRadius: 'var(--radius)',
            }}
            role="gridcell"
            aria-label={`Empty cell row ${r + 1} column ${c + 1}`}
          />
        ))
      )}

      {/* Tiles container */}
      <div
        style={{
          position: 'absolute',
          top: padding,
          left: padding,
          width: boardSize,
          height: boardSize,
        }}
      >
        <AnimatePresence>
          {tiles.map(tile => (
            <TileCell
              key={tile.id}
              tile={tile}
              cellSize={cellSize}
              gap={gap}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
})
