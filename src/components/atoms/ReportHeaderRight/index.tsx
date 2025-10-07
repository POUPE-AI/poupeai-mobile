import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

interface ReportHeaderRightProps {
  onRefresh: () => void;
}

export const ReportHeaderRight: React.FC<ReportHeaderRightProps> = ({
  onRefresh,
}) => {
  const { colors: themeColors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onRefresh}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="refresh" size={24} color={themeColors.text} />
    </TouchableOpacity>
  );
};
