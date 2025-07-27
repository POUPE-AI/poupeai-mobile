import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { styles } from './styles';
import { ThemeType } from '@/contexts/ThemeContext';

export interface BarData {
  value: number;
  label: string;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  width: number;
  height: number;
  showGradient?: boolean;
  style?: any;
  theme?: ThemeType;
}

export const BarChart = ({ 
  data, 
  width, 
  height, 
  showGradient = true,
  style: customStyle,
  theme = 'light'
}: BarChartProps) => {
  const style = styles();

  // Função para gerar cor aleatória baseada nos dados e tema
  const generateColorFromData = (value: number, label: string, index: number): string => {
    const hash = value + label.length * 73 + index * 137; // Hash baseado no valor, label e índice
    
    // Gera uma cor HSL baseada no hash
    const hue = (hash * 47) % 360; // Hue baseado no hash
    
    // Ajustar saturação e luminosidade baseado no tema
    let saturation: number;
    let lightness: number;
    
    if (theme === 'light') {
      // Para tema claro: cores mais escuras e saturadas
      saturation = 65 + (hash % 35); // Saturação entre 65-100%
      lightness = 15 + (hash % 30); // Luminosidade entre 15-45% (mais escuro)
    } else {
      // Para tema escuro: cores mais claras e menos saturadas
      saturation = 45 + (hash % 45); // Saturação entre 45-90%
      lightness = 55 + (hash % 30); // Luminosidade entre 55-85% (mais claro)
    }
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Função para criar as barras do gráfico
  const createBars = () => {
    if (data.length === 0) return [];

    const maxValue = Math.max(...data.map(item => item.value));
    const barWidth = (width - (data.length - 1) * 8) / data.length;

    return data.map((item, index) => {
      const barHeight = (item.value / maxValue) * (height);
      const x = index * (barWidth + 8);
      const y = height - barHeight;
      const color = item.color || generateColorFromData(item.value, item.label, index);

      return {
        x,
        y,
        width: barWidth,
        height: barHeight,
        color,
        index
      };
    });
  };

  const bars = createBars();

  return (
    <View style={[style.container, customStyle]}>
      <Svg 
        width="100%" 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <Defs>
          {showGradient && bars.map((bar) => (
            <LinearGradient 
              key={`gradient-${bar.index}`}
              id={`barGradient-${bar.index}`} 
              x1="0%" 
              y1="0%" 
              x2="0%" 
              y2="100%"
            >
              <Stop offset="0%" stopColor={bar.color} stopOpacity={0.8} />
              <Stop offset="100%" stopColor={bar.color} stopOpacity={0.3} />
            </LinearGradient>
          ))}
        </Defs>
        
        {/* Renderizar barras */}
        {bars.map((bar) => (
          <Rect
            key={`bar-${bar.index}`}
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            fill={showGradient ? `url(#barGradient-${bar.index})` : bar.color}
          />
        ))}
      </Svg>
    </View>
  );
};
