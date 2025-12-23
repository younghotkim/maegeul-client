/**
 * Modern Word Cloud Component
 * Uses canvas-based rendering with smooth animations
 * Optimized for performance and visual appeal
 */

import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

export interface WordData {
  text: string;
  value: number;
  color: string;
}

interface ModernWordCloudProps {
  words: WordData[];
  width?: number;
  height?: number;
  fontFamily?: string;
  minFontSize?: number;
  maxFontSize?: number;
  onWordClick?: (word: WordData) => void;
}

interface PositionedWord extends WordData {
  x: number;
  y: number;
  fontSize: number;
  rotate: number;
  opacity: number;
}

const ModernWordCloud: React.FC<ModernWordCloudProps> = ({
  words,
  width: propWidth,
  height: propHeight,
  fontFamily = 'Plus Jakarta Sans, sans-serif',
  minFontSize = 14,
  maxFontSize = 48,
  onWordClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: propWidth || 400, height: propHeight || 300 });
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [positionedWords, setPositionedWords] = useState<PositionedWord[]>([]);

  // Responsive dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Calculate font sizes based on value range
  const fontSizeScale = useMemo(() => {
    if (words.length === 0) return () => minFontSize;
    
    const values = words.map(w => w.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    return (value: number) => {
      const normalized = (value - minValue) / range;
      return minFontSize + normalized * (maxFontSize - minFontSize);
    };
  }, [words, minFontSize, maxFontSize]);

  // Simple collision detection
  const checkCollision = useCallback((
    word: { x: number; y: number; width: number; height: number },
    placed: { x: number; y: number; width: number; height: number }[]
  ): boolean => {
    const padding = 4; // 패딩 줄임
    return placed.some(p => {
      return !(
        word.x + word.width / 2 + padding < p.x - p.width / 2 ||
        word.x - word.width / 2 - padding > p.x + p.width / 2 ||
        word.y + word.height / 2 + padding < p.y - p.height / 2 ||
        word.y - word.height / 2 - padding > p.y + p.height / 2
      );
    });
  }, []);

  // Position words using spiral algorithm
  useEffect(() => {
    if (words.length === 0 || dimensions.width === 0) {
      setPositionedWords([]);
      return;
    }

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const placed: { x: number; y: number; width: number; height: number }[] = [];
    const positioned: PositionedWord[] = [];

    // Sort by value (larger words first for better placement)
    const sortedWords = [...words].sort((a, b) => b.value - a.value);

    sortedWords.forEach((word) => {
      const fontSize = fontSizeScale(word.value);
      // 한글은 글자당 너비가 fontSize보다 약간 큼 (여유있게 계산)
      const estimatedWidth = word.text.length * fontSize * 1.15;
      const estimatedHeight = fontSize * 1.5;
      // 회전 비활성화 - 한글은 수평이 가독성 좋음
      const rotate = 0;

      let x = centerX;
      let y = centerY;
      let angle = 0;
      const radiusStep = 3; // 더 작은 스텝으로 촘촘하게
      let attempts = 0;
      const maxAttempts = 2000; // 더 많은 시도

      // Spiral outward to find position
      while (attempts < maxAttempts) {
        const wordBounds = {
          x,
          y,
          width: estimatedWidth,
          height: estimatedHeight,
        };

        // Check bounds - 충분한 여유 공간
        const margin = estimatedWidth / 2 + 10;
        const marginY = estimatedHeight / 2 + 10;
        const inBounds = 
          x > margin &&
          x < dimensions.width - margin &&
          y > marginY &&
          y < dimensions.height - marginY;

        if (inBounds && !checkCollision(wordBounds, placed)) {
          placed.push(wordBounds);
          positioned.push({
            ...word,
            x,
            y,
            fontSize,
            rotate,
            opacity: 0.75 + (word.value / Math.max(...words.map(w => w.value))) * 0.25,
          });
          break;
        }

        // Archimedean spiral - 더 촘촘하게
        angle += 0.3;
        const radius = radiusStep * angle / (2 * Math.PI);
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
        
        attempts++;
      }
    });

    setPositionedWords(positioned);
  }, [words, dimensions, fontSizeScale, checkCollision]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        borderRadius: 2,
        p: 2,
      }}
    >
      <AnimatePresence mode="popLayout">
        {positionedWords.map((word, index) => (
          <Tooltip
            key={`${word.text}-${index}`}
            title={
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" fontWeight={600}>{word.text}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  편안 지수: {Math.round(word.value / 5)}
                </Typography>
              </Box>
            }
            arrow
            placement="top"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0, x: dimensions.width / 2, y: dimensions.height / 2 }}
              animate={{
                opacity: hoveredWord === word.text ? 1 : word.opacity,
                scale: hoveredWord === word.text ? 1.15 : 1,
                x: word.x,
                y: word.y,
                rotate: word.rotate,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
                delay: index * 0.03,
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                transform: 'translate(-50%, -50%)',
                cursor: onWordClick ? 'pointer' : 'default',
                userSelect: 'none',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={() => setHoveredWord(word.text)}
              onMouseLeave={() => setHoveredWord(null)}
              onClick={() => onWordClick?.(word)}
            >
              <Typography
                component="span"
                sx={{
                  fontFamily,
                  fontSize: word.fontSize,
                  fontWeight: 600,
                  color: word.color,
                  textShadow: hoveredWord === word.text 
                    ? `0 0 20px ${alpha(word.color, 0.5)}`
                    : 'none',
                  transition: 'text-shadow 0.2s ease',
                  display: 'inline-block',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.02em',
                }}
              >
                {word.text}
              </Typography>
            </motion.div>
          </Tooltip>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default ModernWordCloud;
