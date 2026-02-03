import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { styles } from "./styles";
import { IngestionJob } from "@/types/ingestionJobs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface IngestionJobListItemProps {
  job: IngestionJob;
  onPress?: () => void;
}

const getStatusInfo = (status: IngestionJob["status"]) => {
  switch (status) {
    case "PENDING":
      return {
        label: "Pendente",
        color: "#FFA500",
        icon: "time-outline" as const,
      };
    case "PROCESSING":
      return {
        label: "Processando",
        color: "#3B82F6",
        icon: "sync-outline" as const,
      };
    case "COMPLETED":
      return {
        label: "Concluído",
        color: "#10B981",
        icon: "checkmark-circle-outline" as const,
      };
    case "FAILED":
      return {
        label: "Falhou",
        color: "#EF4444",
        icon: "close-circle-outline" as const,
      };
    default:
      return {
        label: status,
        color: "#6B7280",
        icon: "help-circle-outline" as const,
      };
  }
};

export const IngestionJobListItem = ({
  job,
  onPress,
}: IngestionJobListItemProps) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const statusInfo = getStatusInfo(job.status);
  const formattedDate = format(
    new Date(job.createdAt),
    "dd/MM/yyyy 'às' HH:mm",
    {
      locale: ptBR,
    },
  );

  return (
    <TouchableOpacity
      style={style.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={style.iconContainer}>
        <Ionicons name={statusInfo.icon} size={24} color={statusInfo.color} />
      </View>

      <View style={style.content}>
        <View style={style.header}>
          <Text style={style.title}>Importação de Extrato</Text>
          <View
            style={[
              style.statusBadge,
              { backgroundColor: statusInfo.color + "20" },
            ]}
          >
            <Text style={[style.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <Text style={style.date}>{formattedDate}</Text>
      </View>

      {onPress && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={style.chevron.color}
        />
      )}
    </TouchableOpacity>
  );
};
