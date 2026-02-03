import React, { useState } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Text } from "@/components/atoms/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { ReceiptModal } from "@/components/molecules/ReceiptModal";
import { ConfirmDeleteModal } from "@/components/molecules/ConfirmDeleteModal";

interface ReceiptViewerProps {
  attachmentUrl?: string | null;
  onDelete?: () => void;
  showDelete?: boolean;
}

export const ReceiptViewer: React.FC<ReceiptViewerProps> = ({
  attachmentUrl,
  onDelete,
  showDelete = false,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);
  const [modalVisible, setModalVisible] = useState(false);

  if (!attachmentUrl) return null;

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  return (
    <>
      <View style={style.container}>
        <View style={style.labelContainer}>
          <Text variant="body" color="textSecondary">
            Comprovante
          </Text>
        </View>

        <TouchableOpacity
          style={style.previewContainer}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={style.documentPreview}>
            <Ionicons
              name="document-attach"
              size={32}
              color={style.iconColor.color}
            />
            <View style={style.documentInfo}>
              <Text variant="body">Comprovante anexado</Text>
              <Text variant="caption" color="textSecondary">
                Toque para visualizar
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={style.iconColor.color}
            />
          </View>
        </TouchableOpacity>

        {showDelete && onDelete && (
          <TouchableOpacity style={style.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="#fff" />
            <Text style={style.deleteText}>Remover</Text>
          </TouchableOpacity>
        )}

        <ConfirmDeleteModal
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={async () => {
            if (!onDelete) return;
            onDelete();
          }}
          title="Remover comprovante"
          message="Tem certeza que deseja remover este comprovante?"
        />
      </View>

      <ReceiptModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        attachmentUrl={attachmentUrl}
      />
    </>
  );
};
