import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { utils } from "ethers";

import TokenContract, { buildMfpContract } from "../blockchain/mfpContract";
import initializeBlockchain from "../blockchain/initializeBlockchain";

function Home() {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [TokenContract, setTokenContract] = useState<TokenContract | null>(
    null
  );
  const [balance, setBalance] = useState<string>("");
  /* 
  useEffect(() => {
    initializeBlockchain().then(({provider, currentAccount}) => {
      setCurrentAccount(currentAccount);
      setProvider(provider);
    })
  }, [])

  useEffect(() => {
    if (provider && currentAccount) {
      setTokenContract(buildGreeterContract(provider, currentAccount));
    }
  }, [provider, currentAccount])

  const isConnected = TokenContract;

  if(isConnected){
    TokenContract.balance().then(balance => setBalance(utils.formatEther(balance)))
  } */

  return (
    <div>
      <Head>
        <title>pixel</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          {currentAccount ? <p>My account Address: {currentAccount}</p> : null}
        </nav>
      </header>

      <main>
        <h1>Welcome to our Starter</h1>

        {/* {isConnected && (
          <section>
            <p>My balance {balance}</p>
          </section>
        )} */}
      </main>
    </div>
  );
}

export default Home;
