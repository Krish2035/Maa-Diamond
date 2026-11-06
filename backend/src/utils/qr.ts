import QRCode from "qrcode";

export async function generateQRCodeDataUrl(
  text: string,
  options?: {
    darkColor?: string;
    lightColor?: string;
    width?: number;
  }
): Promise<string> {
  return await QRCode.toDataURL(text, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: options?.width || 400,
    color: {
      dark: options?.darkColor || "#000000",
      light: options?.lightColor || "#ffffff",
    },
  });
}

export async function generateQRCodeSVG(
  text: string,
  options?: {
    darkColor?: string;
    lightColor?: string;
  }
): Promise<string> {
  return await QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 1,
    color: {
      dark: options?.darkColor || "#070a12",
      light: options?.lightColor || "#ffffff",
    },
  });
}

