export interface Institution {
  id: number;
  name: string;
  mainColorHex: string;
  logoName: string;
  type: "BANK" | "CARD_ISSUER" | "BOTH";
}
