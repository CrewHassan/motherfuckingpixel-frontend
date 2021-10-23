import React, { useEffect, useState } from "react";
import initializeBlockchain from "../blockchain/initializeBlockchain";
import { buildMfpContract } from "../blockchain/mfpContract";

export default function History() {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [TokenContract, setTokenContract] = useState(null);
  const [currentId, setCurrentId] = useState(0);
  const [history, setHistory] = useState([]);

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

      build.getCurrentId().then((res) => setCurrentId(Number(res)));

      build.getTileById(currentId).then((res) => setHistory(res));
    }
  }, [provider, currentAccount]);

  const isConnected = TokenContract;

  return (
    <div>
      <h1>the history</h1>
      <div>
        {history.map((item) => (
          <div
            className="flex flex-wrap p-4 w-96 h-96"
            style={{ aspectRatio: "1" }}
          >
            {item.map((pixel, ind) => (
              <button
                type="button"
                key={ind}
                data-index={ind}
                style={{
                  width: "calc(100% / 25)",
                  background: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`,
                  outline: "1px solid #eee",
                  aspectRatio: "1",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
