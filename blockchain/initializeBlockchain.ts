import detectEthereumProvider from "@metamask/detect-provider";
import { providers } from "ethers";

export default async function initializeBlockchain() {
  let web3Provider = await detectEthereumProvider();
  await (window.ethereum as any).request({ method: "eth_requestAccounts" });
  const provider = new providers.Web3Provider(web3Provider);
  const signer = await provider.getSigner();
  const currentAccount = await signer.getAddress();

  return { provider, currentAccount };
}
