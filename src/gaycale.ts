import * as photon from "@silvia-odwyer/photon";
import { colors, flags } from "./options";

export function applyGayscale(
  canvas: HTMLCanvasElement,
  flag: string,
  colortheme: string,
  blendMode: string,
  gradient: boolean,
) {
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const overlayCanvas = document.createElement("canvas");
      overlayCanvas.width = canvas.width;
      overlayCanvas.height = canvas.height;
      const overlayCtx = overlayCanvas.getContext("2d");
      if (overlayCtx == null) return;

      let image = photon.open_image(canvas, ctx);

      const flagObj = flags[flag as keyof typeof flags];
      const colorTheme = colors[colortheme as keyof typeof colors];

      if (gradient) {
        const stripeHeight = canvas.height / flagObj.length;

        for (let i = 0; i < flagObj.length; i++) {
          // Draw the solid stripe
          overlayCtx.fillStyle =
            colorTheme[flagObj[i] as keyof typeof colorTheme];
          overlayCtx.fillRect(0, i * stripeHeight, canvas.width, stripeHeight);

          // Add a gradient at the bottom edge of the stripe, if it's not the last stripe
          if (i < flagObj.length - 1) {
            const gradient = overlayCtx.createLinearGradient(
              0,
              (i + 1) * stripeHeight - stripeHeight / 4,
              0,
              (i + 1) * stripeHeight,
            );

            // Blend from current stripe color to the next stripe color
            gradient.addColorStop(
              0,
              colorTheme[flagObj[i] as keyof typeof colorTheme],
            ); // Current stripe color
            gradient.addColorStop(
              1,
              colorTheme[flagObj[i + 1] as keyof typeof colorTheme],
            ); // Next stripe color

            // Apply the gradient to the edge
            overlayCtx.fillStyle = gradient;
            overlayCtx.fillRect(
              0,
              i * stripeHeight,
              canvas.width,
              stripeHeight + 1,
            );
          }
        }
      } else {
        const stripeHeight = canvas.height / flagObj.length;
        for (let i = 0; i < flagObj.length; i++) {
          overlayCtx.fillStyle =
            colorTheme[flagObj[i] as keyof typeof colorTheme];
          overlayCtx.fillRect(0, i * stripeHeight, canvas.width, stripeHeight);
        }
      }
      let overlay = photon.open_image(overlayCanvas, overlayCtx);

      // Blend the overlay with the image using Photon
      photon.blend(image, overlay, blendMode);

      // Place the pixels back on the canvas
      photon.putImageData(canvas, ctx, image);
    }
  }
}
