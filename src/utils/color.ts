import { colors } from "@/constants/theme";

export function getContrastColor(selectedColor: string): string {
  if (!selectedColor || typeof selectedColor !== "string") {
    return colors.theme["light"].text;
  }

  let color = selectedColor.replace("#", "");
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5
    ? colors.theme["light"].text
    : colors.theme["dark"].text;
}
