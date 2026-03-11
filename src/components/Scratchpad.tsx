import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Pen, Eraser, Undo, Redo, Trash2, X, Maximize2, Minimize2, GripHorizontal, Palette, Type } from 'lucide-react';

interface ScratchpadProps {
  onClose: () => void;
}

type Point = { x: number; y: number };
type Stroke = { points: Point[]; color: string; width: number; isEraser: boolean };

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#FFFFFF'];
const SIZES = [2, 4, 6, 8];

const Scratchpad: React.FC<ScratchpadProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#3B82F6');
  const [lineWidth, setLineWidth] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const [paths, setPaths] = useState<Stroke[]>([]);
  const [redoPaths, setRedoPaths] = useState<Stroke[]>([]);
  const [currentPath, setCurrentPath] = useState<Stroke | null>(null);

  // Dragging state
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { width, height } = container.getBoundingClientRect();
    
    // Save current image data
    const ctx = canvas.getContext('2d');
    let imageData: ImageData | null = null;
    if (ctx && canvas.width > 0 && canvas.height > 0) {
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    canvas.width = width;
    canvas.height = height;

    // Restore image data
    if (ctx && imageData) {
      ctx.putImageData(imageData, 0, 0);
    } else {
      redrawCanvas(paths);
    }
  }, [paths]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas, isExpanded]);

  const redrawCanvas = (strokes: Stroke[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokes.forEach(stroke => {
      if (stroke.points.length === 0) return;
      
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      
      if (stroke.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = stroke.width * 5; // Eraser is thicker
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
      }
      
      ctx.stroke();
    });
    
    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  };

  useEffect(() => {
    redrawCanvas(paths);
  }, [paths]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    const newPath: Stroke = {
      points: [coords],
      color,
      width: lineWidth,
      isEraser: mode === 'eraser'
    };
    setCurrentPath(newPath);
    setRedoPaths([]); // Clear redo stack on new action
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !currentPath) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    const updatedPath = {
      ...currentPath,
      points: [...currentPath.points, coords]
    };
    setCurrentPath(updatedPath);

    // Draw immediately for smooth feedback
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (mode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = lineWidth * 5;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.beginPath();
    const lastPoint = currentPath.points[currentPath.points.length - 1];
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing || !currentPath) return;
    setIsDrawing(false);
    setPaths([...paths, currentPath]);
    setCurrentPath(null);
  };

  const handleUndo = () => {
    if (paths.length === 0) return;
    const newPaths = [...paths];
    const lastPath = newPaths.pop();
    if (lastPath) {
      setPaths(newPaths);
      setRedoPaths([...redoPaths, lastPath]);
    }
  };

  const handleRedo = () => {
    if (redoPaths.length === 0) return;
    const newRedoPaths = [...redoPaths];
    const pathToRestore = newRedoPaths.pop();
    if (pathToRestore) {
      setRedoPaths(newRedoPaths);
      setPaths([...paths, pathToRestore]);
    }
  };

  const handleClear = () => {
    setPaths([]);
    setRedoPaths([]);
  };

  // Dragging logic
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isExpanded) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isExpanded) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    let newX = clientX - dragStart.x;
    let newY = clientY - dragStart.y;
    
    // Boundary checks
    const maxX = window.innerWidth - 100; // Keep at least 100px visible
    const maxY = window.innerHeight - 100;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag as any);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDrag as any);
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDrag as any);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDrag as any);
      window.removeEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag as any);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDrag as any);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={!isExpanded ? { left: position.x, top: position.y } : {}}
      className={`fixed z-[100] bg-slate-900 border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
        isExpanded 
          ? 'inset-4 md:inset-10' 
          : 'w-[350px] h-[450px] md:w-[400px] md:h-[500px]'
      }`}
    >
      {/* Header / Toolbar */}
      <div 
        className={`flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-white/5 ${!isExpanded ? 'cursor-move' : ''}`}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="flex items-center gap-2">
          {!isExpanded && <GripHorizontal size={16} className="text-slate-500 mr-2" />}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMode('pen'); setShowColors(!showColors); setShowSizes(false); }}
              className={`p-2 rounded-lg transition-colors ${mode === 'pen' ? 'bg-brand text-white' : 'text-slate-400 hover:bg-white/5'}`}
              title="Pen"
            >
              <Pen size={18} />
            </button>
            {showColors && mode === 'pen' && (
              <div className="absolute top-full left-0 mt-2 p-2 bg-slate-800 border border-white/10 rounded-xl shadow-xl flex gap-2 z-50">
                {COLORS.map(c => (
                  <button
                    key={c}
                    onClick={(e) => { e.stopPropagation(); setColor(c); setShowColors(false); }}
                    className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowSizes(!showSizes); setShowColors(false); }}
              className="p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
              title="Line Width"
            >
              <div className="w-4 h-4 rounded-full bg-current flex items-center justify-center">
                <div className="bg-slate-800 rounded-full" style={{ width: 16 - lineWidth, height: 16 - lineWidth }} />
              </div>
            </button>
            {showSizes && (
              <div className="absolute top-full left-0 mt-2 p-2 bg-slate-800 border border-white/10 rounded-xl shadow-xl flex flex-col gap-2 z-50">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={(e) => { e.stopPropagation(); setLineWidth(s); setShowSizes(false); }}
                    className={`flex items-center justify-center w-8 h-8 rounded-lg ${lineWidth === s ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  >
                    <div className="bg-white rounded-full" style={{ width: s, height: s }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setMode('eraser'); setShowColors(false); setShowSizes(false); }}
            className={`p-2 rounded-lg transition-colors ${mode === 'eraser' ? 'bg-white/20 text-white' : 'text-slate-400 hover:bg-white/5'}`}
            title="Eraser"
          >
            <Eraser size={18} />
          </button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button
            onClick={(e) => { e.stopPropagation(); handleUndo(); }}
            disabled={paths.length === 0}
            className="p-2 rounded-lg text-slate-400 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Undo"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleRedo(); }}
            disabled={redoPaths.length === 0}
            className="p-2 rounded-lg text-slate-400 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Redo"
          >
            <Redo size={18} />
          </button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button
            onClick={(e) => { e.stopPropagation(); handleClear(); }}
            className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Clear All"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors"
            title="Close Scratchpad"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={containerRef} 
        className="flex-1 relative bg-[#1E293B] cursor-crosshair touch-none"
        onClick={() => { setShowColors(false); setShowSizes(false); }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }} />
        
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </motion.div>
  );
};

export default Scratchpad;
