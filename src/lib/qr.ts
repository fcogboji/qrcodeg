import QRCode from "qrcode";

export type QrFormat = "png" | "svg";

export type GenerateQrInput = {
  content: string;
  darkColor: string;
  lightColor: string;
  width?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  format: QrFormat;
};

export async function generateQr(input: GenerateQrInput): Promise<Buffer | string> {
  const {
    content,
    darkColor,
    lightColor,
    width = 512,
    errorCorrectionLevel = "M",
    format,
  } = input;

  const color = { dark: darkColor, light: lightColor };

  if (format === "svg") {
    return QRCode.toString(content, {
      type: "svg",
      width,
      errorCorrectionLevel,
      color,
      margin: 2,
    });
  }

  const dataUrl = await QRCode.toDataURL(content, {
    width,
    errorCorrectionLevel,
    color,
    margin: 2,
  });
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  return Buffer.from(base64, "base64");
}
