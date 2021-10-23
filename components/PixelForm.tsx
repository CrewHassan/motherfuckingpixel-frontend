import React from "react";
import { hexToRgb, rgbToHex } from "../utils/color";

export default function PixelForm({ pixel }: { pixel: Pixel }) {
  function handleColorInput(event: any) {
    const rgbColor = hexToRgb(event?.currentTarget?.value);

    console.log(rgbColor);
  }

  function claimPixel() {
    console.log("claimed");
  }

  return (
    <>
      <h1>Pixel owned by {pixel.owner}</h1>
      <p>Current price: {pixel.currentValue}</p>
      <form>
        New color:
        <input
          type="color"
          name="color"
          value={rgbToHex([pixel.r, pixel.g, pixel.b])}
          onChange={handleColorInput}
        />
        how much
        <input type="number" name="price" min={pixel.currentValue} />
        <button type="submit" onClick={claimPixel}>
          Claim this
        </button>
      </form>
    </>
  );
}
