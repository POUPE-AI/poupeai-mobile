import React, { useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Text } from "@/components/atoms/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useUploadReceipt } from "@/hooks/useTransactionsUpload";
import { Ionicons } from "@expo/vector-icons";

interface ReceiptUploaderProps {
  transactionId: string;
  attachmentUrl?: string | null;
}

export const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({
  transactionId,
  attachmentUrl,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const uploadMutation = useUploadReceipt();

  const [isPicking, setIsPicking] = useState(false);

  const handlePick = async () => {
    try {
      setIsPicking(true);
      const res = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      // If user cancelled the picker
      if ((res as any).canceled) {
        setIsPicking(false);
        return;
      }

      let name: string | undefined;
      let uri: string | undefined;
      let mimeType: string | undefined;

      if (
        "assets" in res &&
        Array.isArray((res as any).assets) &&
        (res as any).assets.length > 0
      ) {
        const file = (res as any).assets[0];
        name = file.name;
        uri = file.uri;
        mimeType = file.mimeType || file.type;
      } else if ("uri" in res && "name" in res) {
        name = (res as any).name as string;
        uri = (res as any).uri as string;
        mimeType = (res as any).mimeType as string | undefined;
      } else {
        Alert.alert(
          "Formato não suportado",
          "Não foi possível ler o arquivo selecionado.",
        );
        setIsPicking(false);
        return;
      }

      // validate extension
      const allowed = /\.(jpe?g|png|pdf)$/i;
      if (!name || !allowed.test(name)) {
        Alert.alert(
          "Formato não suportado",
          "Aceitamos apenas: jpg, jpeg, png, pdf",
        );
        setIsPicking(false);
        return;
      }

      const form = new FormData();
      let uploadPath: string | undefined = undefined;

      // If uri is a content URI on Android, try to read + write to cache and use local file path
      if (uri?.startsWith("content://") || uri?.startsWith("file://")) {
        try {
          // read as base64 then write to cache with same filename (safer than fetch for content://)
          const base64 = await FileSystem.readAsStringAsync(uri as string, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const dest = `${FileSystem.cacheDirectory}${name}`;
          await FileSystem.writeAsStringAsync(dest, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Use the cache file path for upload
          form.append("file", {
            uri: dest,
            name,
            type: mimeType || "application/octet-stream",
          } as any);
          uploadPath = dest;
        } catch (err) {
          // fallback: try fetch->blob (older devices) or direct uri append
          try {
            const response = await fetch(uri as string);
            const blob = await response.blob();
            form.append("file", blob as any, name);
            uploadPath = undefined; // blob used
          } catch (err2) {
            form.append("file", {
              uri,
              name,
              type: mimeType || "application/octet-stream",
            } as any);
            uploadPath = uri;
          }
        }
      } else {
        form.append("file", {
          uri,
          name,
          type: mimeType || "application/octet-stream",
        } as any);
      }

      // Try to get actual file size from filesystem (dest or uri)
      let fileSize: number | undefined = (res as any).size;
      try {
        const pathToCheck = uploadPath || uri;
        if (pathToCheck) {
          const info = await FileSystem.getInfoAsync(pathToCheck);
          if (info.exists && typeof info.size === "number") {
            fileSize = info.size;
          }
        }
      } catch (err) {
        // ignore file size read failures
      }

      const fallbackUsed = uploadPath
        ? uploadPath === uri
          ? "direct-uri"
          : "cached-file"
        : "blob";

      try {
        const debugInfo = {
          name,
          mimeType,
          size: fileSize,
          uri,
          uploadPath,
          fallback: fallbackUsed,
        };
        const result = await uploadMutation.mutateAsync({
          transactionId,
          form,
          debug: true,
          debugInfo,
        });
      } catch (error: any) {
        console.error("Erro ao enviar comprovante:", error, {
          request: {
            name,
            mimeType,
            size: fileSize,
            uri,
            uploadPath,
            fallback: fallbackUsed,
          },
          response: error?.response?.data || null,
        });
        const serverMessage =
          error?.message ||
          error?.response?.data?.message ||
          (error?.response?.data && JSON.stringify(error.response.data));

        Alert.alert(
          "Erro ao enviar comprovante",
          serverMessage ||
            "Erro interno do servidor. Tente novamente mais tarde.",
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPicking(false);
    }
  };

  const isLoading = isPicking || uploadMutation.status === "pending";

  return (
    <View style={style.container}>
      <TouchableOpacity
        style={[style.uploadButton, isLoading && style.uploadButtonDisabled]}
        onPress={handlePick}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons
              name={
                attachmentUrl ? "cloud-upload-outline" : "add-circle-outline"
              }
              size={20}
              color="#fff"
            />
            <Text style={style.uploadButtonText}>
              {attachmentUrl ? "Alterar comprovante" : "Adicionar comprovante"}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
