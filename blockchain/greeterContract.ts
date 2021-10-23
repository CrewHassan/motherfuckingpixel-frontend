import { Contract, providers } from "ethers";

const ABI = [
  /* "function balance() public view returns (uint256)", */
  "function getTilesColor(uint8 page) public view returns (TileColor[512] memory)"
  // "function tokensOfOwner(address owner) external view returns (uint256[] memory ownerTokens)",
  // "function tokenURI(uint256 tokenId) public view virtual override returns (string memory)",
  // "function burn(uint256 tokenId) public",
  // "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
];

export default class GreeterContract {
  /* private writeContract: Contract; */
  private contract: Contract;
  private address: string;

  constructor(provider: providers.Web3Provider, address: string) {
    this.contract = new Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
      ABI,
      provider.getSigner()
    );
    /* this.readContract = new Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
      ABI,
      provider
    ); */
    this.address = address;
  }

  /* async balance() {
    return this.writeContract.balance();
  } */

  async getTiles(page: number) {
    return this.contract.getTilesColor(1);
  }

  // async mint(ipfsUrl: string) {
  //   const transaction: providers.TransactionResponse =
  //     await this.writeContract.mint(this.address, ipfsUrl);

  //   await transaction.wait(1);
  // }

  // async burn(tokenId: string) {
  //   const transaction: providers.TransactionResponse =
  //     await this.writeContract.burn(tokenId);

  //   await transaction.wait(1);
  // }

  // async tokensOfOwner(): Promise<string[]> {
  //   const tokenIdsBigNumber = await this.readContract.tokensOfOwner(
  //     this.address
  //   );

  //   return tokenIdsBigNumber.map((tokenIdBigNumber) =>
  //     tokenIdBigNumber.toString()
  //   );
  // }

  // tokenURI(tokenId: string): Promise<string> {
  //   return this.readContract.tokenURI(tokenId);
  // }
}

export function buildGreeterContract(provider, address) {
  return new GreeterContract(provider, address);
}
