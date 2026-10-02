import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { particleEngine } from '../utils/particles';
import { Swords, RotateCcw, Lightbulb, ExternalLink, Check, Copy, Award, Shield } from 'lucide-react';

interface Piece {
  type: 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
  color: 'w' | 'b';
}

type BoardState = (Piece | null)[][];

const INITIAL_BOARD: BoardState = [
  // 8: Black backrank
  [null, null, null, { type: 'r', color: 'b' }, null, { type: 'r', color: 'b' }, { type: 'k', color: 'b' }, null],
  // 7
  [{ type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, null, null, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }, { type: 'p', color: 'b' }],
  // 6
  [null, null, null, null, null, null, null, null],
  // 5
  [null, null, null, null, { type: 'q', color: 'w' }, null, null, null],
  // 4
  [null, null, null, null, null, null, null, null],
  // 3
  [null, null, null, null, null, { type: 'n', color: 'w' }, null, null],
  // 2
  [{ type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, null, null, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }, { type: 'p', color: 'w' }],
  // 1: White backrank
  [null, null, null, { type: 'r', color: 'w' }, null, null, { type: 'k', color: 'w' }, null]
];

// Winning solution: White Queen from [3,4] (e5) to [0,6] (g8) - deflection, or Queen to f7 [1,5]!
// Let's configure the winning move: White Queen moves from row 3, col 4 to row 1, col 5 (Qxf7+ checkmate) or row 0, col 3 (Qxd8)!
// Let's make the winning move Queen to row 1, col 5 (Qxf7#) or Knight to row 1, col 6 (Nxh7#).
// Let's set White Queen at row 3, col 4 (e5). Winning move is [1, 5] (Qxf7#)!
const WINNING_FROM = { row: 3, col: 4 };
const WINNING_TO = { row: 1, col: 5 };

export const ChessPuzzleWidget: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme = 'dark' }) => {
  const [board, setBoard] = useState<BoardState>(() => JSON.parse(JSON.stringify(INITIAL_BOARD)));
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [status, setStatus] = useState<'playing' | 'solved' | 'wrong'>('playing');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const isDark = theme === 'dark';

  const handleSelectSquare = (row: number, col: number, e: React.MouseEvent) => {
    if (status === 'solved') return;

    // If no piece is selected yet
    if (!selectedSquare) {
      const piece = board[row][col];
      if (piece && piece.color === 'w') {
        setSelectedSquare({ row, col });
        soundManager.playClick();
      }
      return;
    }

    // If clicking same square, deselect
    if (selectedSquare.row === row && selectedSquare.col === col) {
      setSelectedSquare(null);
      return;
    }

    // Attempting a move
    if (
      selectedSquare.row === WINNING_FROM.row &&
      selectedSquare.col === WINNING_FROM.col &&
      row === WINNING_TO.row &&
      col === WINNING_TO.col
    ) {
      // Correct move: Qxf7#
      const newBoard = JSON.parse(JSON.stringify(board));
      newBoard[row][col] = newBoard[selectedSquare.row][selectedSquare.col];
      newBoard[selectedSquare.row][selectedSquare.col] = null;
      setBoard(newBoard);
      setSelectedSquare(null);
      setStatus('solved');
      soundManager.playChime();
      particleEngine.burst(e.clientX, e.clientY, isDark);
    } else {
      // Incorrect attempt
      setStatus('wrong');
      setSelectedSquare(null);
      soundManager.playClick();
      setTimeout(() => {
        setStatus('playing');
      }, 1800);
    }
  };

  const handleReset = () => {
    setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD)));
    setSelectedSquare(null);
    setStatus('playing');
    setShowHint(false);
    soundManager.playClick();
  };

  const handleSolveAutomatically = (e: React.MouseEvent) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[WINNING_TO.row][WINNING_TO.col] = newBoard[WINNING_FROM.row][WINNING_FROM.col];
    newBoard[WINNING_FROM.row][WINNING_FROM.col] = null;
    setBoard(newBoard);
    setSelectedSquare(null);
    setStatus('solved');
    soundManager.playChime();
    particleEngine.burst(e.clientX, e.clientY, isDark);
  };

  const handleCopyUsername = () => {
    navigator.clipboard.writeText('sinha_zitihsk');
    setCopied(true);
    soundManager.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper piece symbol renderer
  const renderPieceSymbol = (piece: Piece) => {
    const symbols: Record<string, string> = {
      'w-k': '\u2654',
      'w-q': '\u2655',
      'w-r': '\u2656',
      'w-b': '\u2657',
      'w-n': '\u2658',
      'w-p': '\u2659',
      'b-k': '\u265A',
      'b-q': '\u265B',
      'b-r': '\u265C',
      'b-b': '\u265D',
      'b-n': '\u265E',
      'b-p': '\u265F'
    };
    const key = `${piece.color}-${piece.type}`;
    return symbols[key] || '';
  };

  return (
    <div 
      className="relative rounded-2xl border p-5 sm:p-7 overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: isDark ? 'rgba(15, 18, 26, 0.95)' : 'rgba(247, 243, 235, 0.98)',
        borderColor: isDark ? 'rgba(234, 88, 12, 0.3)' : 'rgba(194, 65, 12, 0.3)',
        boxShadow: isDark 
          ? '0 10px 30px -4px rgba(0, 0, 0, 0.6), 0 0 16px rgba(234, 88, 12, 0.12)' 
          : '0 10px 30px -4px rgba(194, 65, 12, 0.1)'
      }}
    >
      {/* Decorative Greek Meandros Header Border */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-ember-600/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-ember-600/15 border border-ember-600/30 text-ember-600 dark:text-ember-400">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-text flex items-center gap-2">
              Ludus Strategicus &middot; The Pallas Gambit
            </h3>
            <p className="text-[11px] font-mono text-text-muted">
              Tactical Challenge: White to Move &amp; Deliver Checkmate
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-border/60 hover:bg-surface text-text-muted hover:text-text transition-colors text-xs flex items-center gap-1 font-mono"
            title="Reset Board"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Interactive 8x8 Chessboard */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div 
            className="relative border-2 rounded-xl p-1.5 shadow-xl select-none"
            style={{
              borderColor: isDark ? '#78350f' : '#b45309',
              backgroundColor: isDark ? '#0b0d12' : '#e7dfd1'
            }}
          >
            <div className="grid grid-cols-8 grid-rows-8 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-lg overflow-hidden border border-border/40">
              {board.map((rowArr, rIdx) =>
                rowArr.map((piece, cIdx) => {
                  const isLightSquare = (rIdx + cIdx) % 2 === 0;
                  const isSelected = selectedSquare?.row === rIdx && selectedSquare?.col === cIdx;
                  const isHintTarget = showHint && rIdx === WINNING_TO.row && cIdx === WINNING_TO.col;
                  const isHintSource = showHint && rIdx === WINNING_FROM.row && cIdx === WINNING_FROM.col;

                  return (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      onClick={(e) => handleSelectSquare(rIdx, cIdx, e)}
                      className={`relative flex items-center justify-center transition-colors duration-150 ${
                        isSelected
                          ? 'ring-2 ring-inset ring-amber-400 bg-amber-500/40 z-10'
                          : isHintTarget || isHintSource
                          ? 'bg-amber-400/35 ring-1 ring-amber-500 animate-pulse'
                          : isLightSquare
                          ? isDark ? 'bg-[#2a2d38] hover:bg-[#343744]' : 'bg-[#f4efe4] hover:bg-[#eae2d3]'
                          : isDark ? 'bg-[#171a23] hover:bg-[#202430]' : 'bg-[#d8ccb8] hover:bg-[#cebfab]'
                      }`}
                    >
                      {piece && (
                        <span 
                          className={`text-2xl sm:text-3xl leading-none transition-transform duration-200 ${
                            isSelected ? 'scale-115' : 'hover:scale-110'
                          }`}
                          style={{
                            color: piece.color === 'w' 
                              ? (isDark ? '#fbbf24' : '#b45309') 
                              : (isDark ? '#94a3b8' : '#334155'),
                            textShadow: piece.color === 'w'
                              ? isDark ? '0 0 8px rgba(251, 191, 36, 0.4)' : 'none'
                              : 'none'
                          }}
                        >
                          {renderPieceSymbol(piece)}
                        </span>
                      )}

                      {/* Small coordinate hint on corner squares */}
                      {cIdx === 0 && (
                        <span className="absolute top-0.5 left-0.5 text-[8px] font-mono opacity-30 pointer-events-none">
                          {8 - rIdx}
                        </span>
                      )}
                      {rIdx === 7 && (
                        <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono opacity-30 pointer-events-none">
                          {String.fromCharCode(97 + cIdx)}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Tactical Feedback Banner */}
          <div className="mt-3 text-center min-h-[26px]">
            {status === 'playing' && (
              <p className="font-mono text-xs text-text-muted">
                {selectedSquare 
                  ? 'Select destination square for your piece.' 
                  : 'Click White Queen to strike f7!'}
              </p>
            )}
            {status === 'wrong' && (
              <p className="font-mono text-xs text-red-500 animate-bounce font-bold">
                Tartarus awaits that move! Try again or reveal solution.
              </p>
            )}
            {status === 'solved' && (
              <p className="font-serif text-xs text-amber-500 font-bold flex items-center justify-center gap-1.5 animate-pulse">
                <Award className="w-3.5 h-3.5" />
                Checkmate achieved: Qxf7#! A move worthy of Athena.
              </p>
            )}
          </div>
        </div>

        {/* Tactical Profile & Challenge Hub */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl border border-border/80 bg-surface/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-ember-600 dark:text-ember-400" />
                <span className="font-mono text-xs font-bold text-text">Tactician Dossier</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                Ready for Blitz &middot; Rapid
              </span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Every system architecture and quantitative protocol is a chess game against entropy. Challenge Kshitiz on Chess.com for an asynchronous or blitz battle.
            </p>

            <div className="p-2.5 rounded-lg border border-border/50 bg-bg/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-text-dim">Chess.com Handle</div>
                <div className="font-mono text-xs font-bold text-ember-600 dark:text-ember-400">
                  sinha_zitihsk
                </div>
              </div>

              <button
                onClick={handleCopyUsername}
                className="px-2.5 py-1 rounded-md border border-border/70 hover:bg-surface text-xs font-mono flex items-center gap-1 text-text-muted hover:text-text transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Direct Challenge Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href="https://www.chess.com/member/sinha_zitihsk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-lg bg-ember-600 hover:bg-ember-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-ember-600/20 transition-all text-center"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Challenge on Chess.com</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              <button
                onClick={(e) => {
                  setShowHint(true);
                  handleSolveAutomatically(e);
                }}
                className="py-2 px-3 rounded-lg border border-border hover:bg-surface text-text-muted hover:text-text font-mono text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Reveal Move</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] font-mono text-text-dim flex items-center gap-1.5 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-ember-600"></span>
            <span>No barrier: The puzzle is an optional tactical trial; you may challenge directly anytime.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
