import React, { useEffect, useMemo, useState } from "react";
import Head from "next/dist/shared/lib/head";
import { hexToRgb, rgbToHex } from "../utils/color";
import initializeBlockchain from "../blockchain/initializeBlockchain";
import TokenContract, { buildMfpContract } from "../blockchain/mfpContract";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [TokenContract, setTokenContract] = useState<TokenContract | null>(
    null
  );

  const [activePixel, setActivePixel] = useState<number | null>(null);
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [maxMintable, setMaxMintable] = useState(0);
  const [currentId, setCurrentId] = useState(0);
  const [history, setHistory] = useState<Pixel[][]>([]);
  const [offerPrice, setOfferPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [spentValue, setSpentValue] = useState(0);
  const [feedback, setFeedback] = useState("");

  const [edit, setEdit] = useState(null);

  useEffect(() => {
    initializeBlockchain().then(({ provider, currentAccount }) => {
      setCurrentAccount(currentAccount);
      setProvider(provider);
    });
  }, []);

  useEffect(() => {
    if (provider && currentAccount) {
      const build = buildMfpContract(provider, currentAccount);

      setTokenContract(build);

      build.getTiles().then((res) => setPixels(res));
      build.getMinPrice().then((res) => setMinPrice(Number(res)));
      build.getCurrentId().then((res) => setCurrentId(Number(res)));
      build.getMaxMintable().then((res) => setMaxMintable(Number(res)));
      build.getTileById(currentId).then((res) => setHistory(res));
      build.getSpentValue().then((res) => setSpentValue(res));
    }
  }, [provider, currentAccount]);

  const isConnected = TokenContract;

  const selected = activePixel !== null ? pixels[activePixel] : null;

  function handlePixelClick(event: React.MouseEvent<HTMLButtonElement>) {
    const { index } = event.currentTarget.dataset;

    setActivePixel(Number(index));
    setFeedback("");
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

  function handlePriceInput(event: any) {
    setOfferPrice(event?.target.value);
  }

  async function handleSubmit() {
    const op = await TokenContract?.paintPixel(
      activePixel,
      selected?.r,
      selected?.g,
      selected?.b,
      offerPrice
    );

    setFeedback(op?.message);

    if (op?.success) {
      console.log(currentAccount);

      setPixels(
        pixels.map((item, index) =>
          index === activePixel
            ? ({
                ...item,
                owner: currentAccount,
              } as Pixel)
            : item
        )
      );
    }
  }

  return (
    <div>
      <Head>
        <title>Motherfucking pixel</title>
      </Head>

      <div className="flex justify-center bg-gray-100">
        <div className="w-2/12 flex flex-col">
          <div className="p-4 relative">
            <h1 className="font-pixel text-5xl break-all">
              Motherfucking pixel
            </h1>
            <h1 className="font-pixel text-5xl break-all transform -translate-x-1 translate-y-3 absolute top-0 text-green-500">
              Motherfucking pixel
            </h1>
          </div>
          <p className="font-pixel p-4">
            NFT: <br />
            {currentId} / {maxMintable}
          </p>
          <p className="font-pixel p-4">
            total traded: <br />
            {spentValue}
          </p>
        </div>
        <div
          className="flex flex-wrap p-4 max-w-8/12 h-screen"
          style={{ aspectRatio: "1" }}
        >
          {pixels && pixels.length > 0 ? (
            <>
              {pixels.map((pixel, ind) => (
                <button
                  type="button"
                  key={ind}
                  data-index={ind}
                  style={{
                    width: "calc(100% / 16)",
                    background: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`,
                    outline: "1px solid #eee",
                    aspectRatio: "1",
                  }}
                  onClick={handlePixelClick}
                />
              ))}
            </>
          ) : (
            <div className="flex h-full w-full">
              <p className="m-auto font-pixel text-lg">loading the pixels...</p>
            </div>
          )}
        </div>
        <div className="w-2/12">
          {selected !== null && (
            <div className="p-4">
              <p className="font-pixel text-xl mb-10 text-green-500">
                Pixel #{activePixel}
              </p>
              <div className="mb-6">
                <p className="text-sm text-gray-400 font-pixel">
                  Pixel owned by
                </p>
                <p className="font-pixel">{selected.owner.substr(0, 10)}...</p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-400 font-pixel">
                  Current price
                </p>
                <p className="font-pixel">
                  {selected.currentValue || minPrice}
                </p>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-400 font-pixel">paint it</p>
                <input
                  type="color"
                  name="color"
                  value={rgbToHex([selected.r, selected.g, selected.b])}
                  onChange={handleColorInput}
                />
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-400 font-pixel">Your offer</p>
                <input
                  type="number"
                  name="price"
                  className="text-sm border-gray-400 my-3 border border-2 border-green-500"
                  min={selected.currentValue || minPrice}
                  onChange={handlePriceInput}
                />
                <p className="text-xs font-pixel text-gray-400">
                  The more you offer, the better your chance of claiming the
                  final artwork is
                </p>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="absolute -left-1 -top-1 font-pixel text-l bg-red-500 p-4"
                >
                  Claim this
                </button>
                <button
                  type="button"
                  className="font-pixel text-l bg-black border border-2 p-4"
                >
                  Claim this
                </button>
              </div>
              {feedback && (
                <p className="mt-3 font-pixel text-sm">{feedback}</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-30 p-4 bg-gray-100">
        <p className="font-pixel text-xl my-10 text-green-500">
          the history of this incredible thing
        </p>
        {}
        {history.length === 0 && (
          <p className="font-pixel text-xl my-10 text-green-500">
            no nfts minted yet
          </p>
        )}
        {history.map((item) => {
          item.length > 0 && (
            <>
              <p className="font-pixel">NFT #1</p>
              <div className="mr-10 mb-10 w-80 h-80 flex flex-wrap">
                {item.map((pixel, ind) => (
                  <div
                    key={ind}
                    data-index={ind}
                    style={{
                      width: "calc(100% / 16)",
                      background: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`,
                      outline: "1px solid #eee",
                      aspectRatio: "1",
                    }}
                  />
                ))}
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
