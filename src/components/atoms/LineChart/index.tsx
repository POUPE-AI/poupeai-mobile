import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { styles } from './styles';
import { ThemeType } from '@/contexts/ThemeContext';

export interface LineData {
  data: number[];
  color?: string;
}

interface LineChartProps {
  lines: LineData[];
  width: number;
  height: number;
  showArea?: boolean;
  style?: any;
  theme?: ThemeType;
}

export const LineChart = ({ 
  lines, 
  width, 
  height, 
  showArea = true,
  style: customStyle,
  theme = 'light'
}: LineChartProps) => {
  const style = styles();

  // Função para gerar cor aleatória baseada nos dados e tema
  const generateColorFromData = (data: number[], index: number): string => {
    const sum = data.reduce((acc, val) => acc + val, 0);
    const hash = sum + index * 137; // Multiplicador primo para variação
    
    // Gera uma cor HSL baseada no hash
    const hue = (hash * 100) % 360; // Hue baseado no hash
    
    // Ajustar saturação e luminosidade baseado no tema
    let saturation: number;
    let lightness: number;
    
    if (theme === 'light') {
      // Para tema claro: cores mais escuras e saturadas
      saturation = 70 + (hash % 30); // Saturação entre 70-100%
      lightness = 10 + (hash % 25); // Luminosidade entre 30-55% (mais escuro)
    } else {
      // Para tema escuro: cores mais claras e menos saturadas
      saturation = 50 + (hash % 40); // Saturação entre 50-90%
      lightness = 60 + (hash % 25); // Luminosidade entre 60-85% (mais claro)
    }
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Função para criar o path do gráfico
  const createPath = (data: number[], width: number, height: number) => {
    if (data.length === 0) return { linePath: '', areaPath: '' };
    
    const maxValue = Math.max(...lines.flatMap(line => line.data));
    const minValue = Math.min(...lines.flatMap(line => line.data));
    const range = maxValue - minValue || 1;
    
    const stepX = width / (data.length - 1);
    
    let path = '';
    let areaPath = '';
    
    data.forEach((value, index) => {
      const x = index * stepX;
      const y = height - ((value - minValue) / range) * height;
      
      if (index === 0) {
        path += `M${x},${y}`;
        areaPath += `M${x},${height} L${x},${y}`;
      } else {
        path += ` L${x},${y}`;
        areaPath += ` L${x},${y}`;
      }
    });
    
    // Fechar a área
    areaPath += ` L${width},${height} Z`;
    
    return { linePath: path, areaPath };
  };

  return (
    <View style={[style.container, customStyle]}>
      <Svg 
        width="100%" 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <Defs>
          {lines.map((line, index) => {
            const color = line.color || generateColorFromData(line.data, index);
            return (
              <LinearGradient 
                key={`gradient-${index}`}
                id={`areaGradient-${index}`} 
                x1="0%" 
                y1="0%" 
                x2="0%" 
                y2="100%"
              >
                <Stop offset="0%" stopColor={color} stopOpacity={0.6} />
                <Stop offset="100%" stopColor={color} stopOpacity={0.1} />
              </LinearGradient>
            );
          })}
        </Defs>
        
        {/* Renderizar áreas (se habilitado) */}
        {showArea && lines.map((line, index) => {
          const { areaPath } = createPath(line.data, width, height);
          return (
            <Path
              key={`area-${index}`}
              d={areaPath}
              fill={`url(#areaGradient-${index})`}
            />
          );
        })}
        
        {/* Renderizar linhas */}
        {lines.map((line, index) => {
          const { linePath } = createPath(line.data, width, height);
          const color = line.color || generateColorFromData(line.data, index);
          return (
            <Path
              key={`line-${index}`}
              d={linePath}
              stroke={color}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </Svg>
    </View>
  );
};
