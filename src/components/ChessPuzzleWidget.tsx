import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { particleEngine } from '../utils/particles';
import { Swords, RotateCcw, Lightbulb, ExternalLink, Check, Copy, Award, Shield, Eye } from 'lucide-react';

interface Piece {
  type: 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
  color: 'w' | 'b';
}

type BoardState = (Piece | null)[][];

const FILES = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] as const;
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const PUZZLE_FEN = '2b2r2/5p1k/2P3p1/qBQ1p2p/4Pb2p/1P5P/1KP3P1/rN1R3R b - - 0 1';

// Black's perspective: files run h -> a (col 0 to 7), ranks run 1 -> 8 (row 0 to 7)
const INITIAL_BOARD: BoardState = [
  // Rank 1 (row 0): h1=R, g1=., f1=., e1=., d1=R, c1=., b1=N, a1=r
  [
    { type: 'r', color: 'w' }, // h1 (White Rook)
    null,                      // g1
    null,                      // f1
    null,                      // e1
    { type: 'r', color: 'w' }, // d1 (White Rook)
    null,                      // c1
    { type: 'n', color: 'w' }, // b1 (White Knight)
    { type: 'r', color: 'b' }  // a1 (Black Rook)
  ],
  // Rank 2 (row 1): h2=., g2=P, f2=., e2=., d2=., c2=P, b2=K, a2=. (Target: Qa2#)
  [
    null,                      // h2
    { type: 'p', color: 'w' }, // g2 (White Pawn)
    null,                      // f2
    null,                      // e2
    null,                      // d2
    { type: 'p', color: 'w' }, // c2 (White Pawn)
    { type: 'k', color: 'w' }, // b2 (White King)
    null                       // a2 (Destination for ...Qa2#)
  ],
  // Rank 3 (row 2): h3=P, g3=., f3=., e3=., d3=., c3=., b3=P, a3=.
  [
    { type: 'p', color: 'w' }, // h3 (White Pawn)
    null,                      // g3
    null,                      // f3
    null,                      // e3
    null,                      // d3
    null,                      // c3
    { type: 'p', color: 'w' }, // b3 (White Pawn)
    null                       // a3
  ],
  // Rank 4 (row 3): h4=p, g4=., f4=b, e4=P, d4=., c4=., b4=., a4=.
  [
    { type: 'p', color: 'b' }, // h4 (Black Pawn)
    null,                      // g4
    { type: 'b', color: 'b' }, // f4 (Black Bishop)
    { type: 'p', color: 'w' }, // e4 (White Pawn)
    null,                      // d4
    null,                      // c4
    null,                      // b4
    null                       // a4
  ],
  // Rank 5 (row 4): h5=., g5=., f5=., e5=p, d5=., c5=Q, b5=B, a5=q (Source: Black Queen)
  [
    null,                      // h5
    null,                      // g5
    null,                      // f5
    { type: 'p', color: 'b' }, // e5 (Black Pawn)
    null,                      // d5
    { type: 'q', color: 'w' }, // c5 (White Queen)
    { type: 'b', color: 'w' }, // b5 (White Bishop)
    { type: 'q', color: 'b' }  // a5 (Black Queen)
  ],
  // Rank 6 (row 5): h6=., g6=p, f6=., e6=., d6=., c6=P, b6=., a6=.
  [
    null,                      // h6
    { type: 'p', color: 'b' }, // g6 (Black Pawn)
    null,                      // f6
    null,                      // e6
    null,                      // d6
    { type: 'p', color: 'w' }, // c6 (White Pawn)
    null,                      // b6
    null                       // a6
  ],
  // Rank 7 (row 6): h7=k, g7=., f7=p, e7=., d7=., c7=., b7=., a7=.
  [
    { type: 'k', color: 'b' }, // h7 (Black King)
    null,                      // g7
    { type: 'p', color: 'b' }, // f7 (Black Pawn)
    null,                      // e7
    null,                      // d7
    null,                      // c7
    null,                      // b7
    null                       // a7
  ],
  // Rank 8 (row 7): h8=., g8=., f8=r, e8=., d8=., c8=b, b8=., a8=.
  [
    null,                      // h8
    null,                      // g8
    { type: 'r', color: 'b' }, // f8 (Black Rook)
    null,                      // e8
    null,                      // d8
    { type: 'b', color: 'b' }, // c8 (Black Bishop)
    null,                      // b8
    null                       // a8
  ]
];

// Winning move: Black Queen from a5 (row 4, col 7) to a2 (row 1, col 7) -> ...Qa2#
const WINNING_FROM = { row: 4, col: 7 };
const WINNING_TO = { row: 1, col: 7 };

export const ChessPuzzleWidget: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme = 'dark' }) => {
  const [board, setBoard] = useState<BoardState>(() => JSON.parse(JSON.stringify(INITIAL_BOARD)));
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [status, setStatus] = useState<'playing' | 'solved' | 'wrong'>('playing');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [copiedHandle, setCopiedHandle] = useState<boolean>(false);
  const [copiedFen, setCopiedFen] = useState<boolean>(false);

  const isDark = theme === 'dark';

  const handleSelectSquare = (row: number, col: number, e: React.MouseEvent) => {
    if (status === 'solved') return;

    // If no piece is selected yet, player must select Black piece (Black to move)
    if (!selectedSquare) {
      const piece = board[row][col];
      if (piece && piece.color === 'b') {
        setSelectedSquare({ row, col });
        soundManager.playClick();
      }
      return;
    }

    // Deselect if clicking the same square
    if (selectedSquare.row === row && selectedSquare.col === col) {
      setSelectedSquare(null);
      return;
    }

    // Execute move attempt
    if (
      selectedSquare.row === WINNING_FROM.row &&
      selectedSquare.col === WINNING_FROM.col &&
      row === WINNING_TO.row &&
      col === WINNING_TO.col
    ) {
      // Correct move: ...Qa2#
      const newBoard = JSON.parse(JSON.stringify(board));
      newBoard[row][col] = newBoard[selectedSquare.row][selectedSquare.col];
      newBoard[selectedSquare.row][selectedSquare.col] = null;
      setBoard(newBoard);
      setSelectedSquare(null);
      setStatus('solved');
      soundManager.playChime();
      particleEngine.burst(e.clientX, e.clientY, isDark);
    } else {
      // Inaccurate move
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

  const handleCopyHandle = () => {
    navigator.clipboard.writeText('sinha_zitihsk');
    setCopiedHandle(true);
    soundManager.playClick();
    setTimeout(() => setCopiedHandle(false), 2000);
  };

  const handleCopyFen = () => {
    navigator.clipboard.writeText(PUZZLE_FEN);
    setCopiedFen(true);
    soundManager.playClick();
    setTimeout(() => setCopiedFen(false), 2000);
  };

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
    return symbols[`${piece.color}-${piece.type}`] || '';
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
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-ember-600/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-ember-600/15 border border-ember-600/30 text-ember-600 dark:text-ember-400">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-text flex items-center gap-2">
              <span>Ludus Strategicus</span>
              <span className="text-text-dim">&middot;</span>
              <span className="text-ember-600 dark:text-ember-400 font-sans font-semibold text-xs sm:text-sm">The Pallas Gambit</span>
            </h3>
            <p className="text-[11px] font-mono text-text-muted flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-slate-800 dark:bg-slate-300 border border-ember-600"></span>
              <span className="font-bold text-text">Black to move</span>
              <span className="text-text-dim">&middot;</span>
              <span>Mate in 1</span>
              <span className="text-text-dim">&middot;</span>
              <span className="text-ember-600 dark:text-ember-400">Black&apos;s Perspective (h &rarr; a, 1 &rarr; 8)</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyFen}
            className="px-2.5 py-1 rounded-lg border border-border/70 hover:bg-surface text-text-muted hover:text-text transition-colors text-xs flex items-center gap-1.5 font-mono"
            title="Copy FEN to clipboard"
          >
            {copiedFen ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedFen ? 'FEN Copied' : 'Copy FEN'}</span>
          </button>

          <button
            onClick={handleReset}
            className="px-2.5 py-1 rounded-lg border border-border/70 hover:bg-surface text-text-muted hover:text-text transition-colors text-xs flex items-center gap-1.5 font-mono"
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
          
          {/* Top File Coordinate Guide: h -> a */}
          <div className="grid grid-cols-8 w-[280px] sm:w-[336px] text-center font-mono text-[10px] text-text-dim mb-1 select-none">
            {FILES.map((f) => (
              <span key={`top-${f}`}>{f}</span>
            ))}
          </div>

          <div className="flex items-center gap-1">
            
            {/* Left Rank Coordinate Guide: 1 -> 8 */}
            <div className="flex flex-col justify-around h-[280px] sm:h-[336px] font-mono text-[10px] text-text-dim pr-1 select-none">
              {RANKS.map((r) => (
                <span key={`left-${r}`}>{r}</span>
              ))}
            </div>

            {/* Board Grid */}
            <div 
              className="relative border-2 rounded-xl p-1.5 shadow-2xl select-none"
              style={{
                borderColor: isDark ? '#78350f' : '#b45309',
                backgroundColor: isDark ? '#0b0d12' : '#e7dfd1'
              }}
            >
              <div className="grid grid-cols-8 grid-rows-8 w-[280px] h-[280px] sm:w-[336px] sm:h-[336px] rounded-lg overflow-hidden border border-border/40">
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
                        className={`relative flex items-center justify-center transition-all duration-150 ${
                          isSelected
                            ? 'ring-2 ring-inset ring-amber-400 bg-amber-500/40 z-10'
                            : isHintTarget || isHintSource
                            ? 'bg-amber-400/35 ring-1 ring-amber-500 animate-pulse z-10'
                            : isLightSquare
                            ? isDark ? 'bg-[#2e3440] hover:bg-[#3b4252]' : 'bg-[#f4efe4] hover:bg-[#eae2d3]'
                            : isDark ? 'bg-[#181c24] hover:bg-[#222733]' : 'bg-[#d8ccb8] hover:bg-[#cebfab]'
                        }`}
                        title={`${FILES[cIdx]}${RANKS[rIdx]}`}
                      >
                        {piece && (
                          <span 
                            className={`text-2xl sm:text-3xl leading-none transition-transform duration-200 select-none ${
                              isSelected ? 'scale-115' : 'hover:scale-110'
                            }`}
                            style={{
                              color: piece.color === 'w' 
                                ? (isDark ? '#fef3c7' : '#92400e') 
                                : (isDark ? '#38bdf8' : '#0f172a'),
                              filter: piece.color === 'w'
                                ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.45))'
                                : (isDark ? 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.4))' : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'),
                              textShadow: piece.color === 'w'
                                ? isDark ? '0 0 6px rgba(254, 243, 199, 0.35)' : 'none'
                                : 'none'
                            }}
                          >
                            {renderPieceSymbol(piece)}
                          </span>
                        )}

                        {/* Corner square coordinates */}
                        {cIdx === 0 && (
                          <span className="absolute top-0.5 left-0.5 text-[8px] font-mono opacity-30 pointer-events-none">
                            {RANKS[rIdx]}
                          </span>
                        )}
                        {rIdx === 7 && (
                          <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono opacity-30 pointer-events-none">
                            {FILES[cIdx]}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Rank Coordinate Guide: 1 -> 8 */}
            <div className="flex flex-col justify-around h-[280px] sm:h-[336px] font-mono text-[10px] text-text-dim pl-1 select-none">
              {RANKS.map((r) => (
                <span key={`right-${r}`}>{r}</span>
              ))}
            </div>

          </div>

          {/* Bottom File Coordinate Guide: h -> a */}
          <div className="grid grid-cols-8 w-[280px] sm:w-[336px] text-center font-mono text-[10px] text-text-dim mt-1 select-none">
            {FILES.map((f) => (
              <span key={`bottom-${f}`}>{f}</span>
            ))}
          </div>

          {/* Tactical Feedback Banner */}
          <div className="mt-3 text-center min-h-[26px]">
            {status === 'playing' && (
              <p className="font-mono text-xs text-text-muted">
                {selectedSquare 
                  ? 'Select destination square for your piece.' 
                  : 'Click Black Queen on a5 and strike a2!'}
              </p>
            )}
            {status === 'wrong' && (
              <p className="font-mono text-xs text-red-500 font-bold">
                Tartarus awaits that move! Try again or reveal the checkmate.
              </p>
            )}
            {status === 'solved' && (
              <p className="font-serif text-xs text-amber-500 font-bold flex items-center justify-center gap-1.5 animate-pulse">
                <Award className="w-3.5 h-3.5" />
                <span>Checkmate: ...Qa2#! Supported by Rook on a1. Victory for Black!</span>
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
                Active on Chess.com
              </span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Every system architecture and quantitative protocol is a chess game against entropy. Challenge Kshitiz on Chess.com for an asynchronous or blitz battle.
            </p>

            {/* Chess.com Handle Card */}
            <div className="p-2.5 rounded-lg border border-border/50 bg-bg/80 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-text-dim">Chess.com Handle</div>
                <div className="font-mono text-xs font-bold text-ember-600 dark:text-ember-400">
                  sinha_zitihsk
                </div>
              </div>

              <button
                onClick={handleCopyHandle}
                className="px-2.5 py-1 rounded-md border border-border/70 hover:bg-surface text-xs font-mono flex items-center gap-1 text-text-muted hover:text-text transition-colors"
                title="Copy Chess.com username"
              >
                {copiedHandle ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHandle ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* FEN Box */}
            <div className="p-2.5 rounded-lg border border-border/50 bg-bg/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-text-dim flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>FEN Specification</span>
                </span>
                <span className="text-[10px] font-mono text-ember-600 dark:text-ember-400 font-semibold">
                  Black to move
                </span>
              </div>
              <code className="text-[10px] font-mono text-text-muted block break-all select-all">
                {PUZZLE_FEN}
              </code>
            </div>

            {/* Direct Challenge Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href="https://www.chess.com/member/sinha_zitihsk"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playClick()}
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
            <span>The puzzle is an optional tactical trial; you may challenge directly anytime.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
