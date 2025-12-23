import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../hooks/stores/use-auth-store';
import useUserMoodData from '../../hooks/useUserMoodData';
import { ChartLegends } from '../chart/chart-legends';
import { Cloud, Sparkles } from 'lucide-react';
import ModernWordCloud, { WordData } from './ModernWordCloud';

export type ChartOptions = {
  labels?: string[];
  colors?: string[];
  series?: number[];
  type?: string;
};

const chartOptions: ChartOptions = {
  labels: ['편안 지수가 높은 단어들이 더 크게 보여요'],
  colors: ['#667eea'],
};

interface AnalyticsWordCloudProps {
  title: string;
}

const AnalyticsWordCloud: React.FC<AnalyticsWordCloudProps> = ({
  title,
  ...other
}) => {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const moodData = useUserMoodData(user?.user_id || undefined);

  const words: WordData[] = moodData.map((mood) => ({
    text: mood.label,
    value: mood.pleasantness * 5,
    color: mood.color,
  }));

  const handleWordClick = (word: WordData) => {
    console.log('Clicked word:', word.text);
    // 나중에 해당 감정의 일기 목록으로 이동하는 기능 추가 가능
  };

  return (
    <Card
      {...other}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: { xs: '100%', sm: 'auto' },
        borderRadius: 3,
        boxShadow: `0 4px 20px ${alpha(theme.palette.grey[500], 0.12)}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: `0 8px 24px ${alpha(theme.palette.grey[500], 0.16)}`,
        },
      }}
    >
      <CardHeader
        title={title}
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 2 },
        }}
        titleTypographyProps={{
          sx: {
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          },
        }}
      />
      <CardContent
        sx={{
          flex: '1 1 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1, sm: 2 },
          minHeight: { xs: 250, sm: 300, md: 356 },
        }}
      >
        {words.length > 0 ? (
          <Box
            sx={{
              width: '100%',
              height: { xs: '250px', sm: '300px', md: '356px' },
              position: 'relative',
            }}
          >
            <ModernWordCloud
              words={words}
              minFontSize={16}
              maxFontSize={52}
              onWordClick={handleWordClick}
            />
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                px: { xs: 2, sm: 3 },
                py: 4,
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <Cloud size={32} color="white" />
                </Box>
              </motion.div>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                지금 매글을 시작해서
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                }}
              >
                나만의 감정 어휘 클라우드를 만들어보세요
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={16} color="#667eea" />
                </motion.span>
              </Typography>
            </Box>
          </motion.div>
        )}
      </CardContent>

      <Divider sx={{ borderStyle: 'dashed', borderColor: alpha(theme.palette.grey[500], 0.2) }} />

      <ChartLegends
        labels={chartOptions?.labels}
        colors={chartOptions?.colors}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 1.5 },
        }}
      />
    </Card>
  );
};

export default AnalyticsWordCloud;
