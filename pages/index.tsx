import React, { useEffect, useMemo, useState } from "react";
import Head from "next/dist/shared/lib/head";
import { hexToRgb, rgbToHex } from "../utils/color";
import PixelForm from "../components/PixelForm";
import initializeBlockchain from "../blockchain/initializeBlockchain";
import { utils } from "ethers";

import TokenContract, {
  buildGreeterContract,
} from "../blockchain/greeterContract";

export default function Home() {
  const [pixels, setPixels] = useState<Pixel[]>(
    new Array(1024).fill({
      owner: "0x000",
      currentValue: 1,
      r: 255,
      g: 255,
      b: 255,
    })
  );
  const [activePixel, setActivePixel] = useState<number | null>(null);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [TokenContract, setTokenContract] = useState<TokenContract | null>(
    null
  );

  const [offerPrice, setOfferPrice] = useState(0);

  useEffect(() => {
    initializeBlockchain().then(({ provider, currentAccount }) => {
      setCurrentAccount(currentAccount);
      setProvider(provider);
    });
  }, []);

  useEffect(() => {
    if (provider && currentAccount) {
      const build = buildGreeterContract(provider, currentAccount);

      setTokenContract(build);

      build.getTiles().then((res) => setPixels(res));
    }
  }, [provider, currentAccount]);

  const isConnected = TokenContract;

  const selected = activePixel !== null ? pixels[activePixel] : null;

  function handlePixelClick(event: React.MouseEvent<HTMLButtonElement>) {
    const { index } = event.currentTarget.dataset;

    setActivePixel(Number(index));
  }

  function handleColorInput(event: any) {
    const rgbColor = hexToRgb(event?.currentTarget?.value);

    setPixels(
      pixels.map((item, ind) =>
        ind === activePixel
          ? {
              ...item,
              r: rgbColor[0],
              g: rgbColor[1],
              b: rgbColor[2],
            }
          : item
      )
    );
  }

  function handlePriceInput(event) {
    setOfferPrice(event?.target.value);
  }

  function handleSubmit() {
    console.log("submit");

    TokenContract?.paintPixel(
      activePixel,
      selected?.r,
      selected?.g,
      selected?.b,
      offerPrice
    );
  }

  return (
    <div>
      <Head>
        <title>Motherfucking pixel</title>
      </Head>

      <div className="flex justify-center">
        <div className="w-2/12">Motherfucking pixel</div>
        <div
          className="flex flex-wrap p-4 max-w-8/12 h-screen"
          style={{ aspectRatio: "1" }}
        >
          {pixels.map((pixel, ind) => (
            <button
              type="button"
              data-index={ind}
              style={{
                width: "calc(100% / 25)",
                background: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`,
                outline: "1px solid #eee",
                aspectRatio: "1",
              }}
              onClick={handlePixelClick}
            />
          ))}
        </div>
        <div className="w-2/12">
          {selected !== null && (
            <div className="p-4">
              <div className="mb-6">
                <p className="text-sm text-gray-400">Pixel owned by</p>
                <p className="font-mono">{selected.owner}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-400">Current price</p>
                <p className="font-mono">{selected.currentValue}</p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-400">New color</p>
                <input
                  type="color"
                  name="color"
                  value={rgbToHex([selected.r, selected.g, selected.b])}
                  onChange={handleColorInput}
                />
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-400">Your offer</p>
                <input
                  type="number"
                  name="price"
                  className="text-sm border-gray-400"
                  min={selected.currentValue}
                  onChange={handlePriceInput}
                />
                <p className="text-xs font-mono text-gray-400">
                  The more you offer, the better your chance of claiming the
                  final artwork is
                </p>
              </div>
              <button type="button" onClick={handleSubmit}>
                Claim this
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
