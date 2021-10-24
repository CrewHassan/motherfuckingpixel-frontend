import { Contract, ethers, providers } from "ethers";

const ABI = [
   "function getTilesColor() public view returns (tuple(uint8 r, uint8 g, uint8 b)[256] tiles)",
   "function getTilesColorById(uint16 id) public view returns (tuple(uint8 r, uint8 g, uint8 b)[256] tiles)",
   "function getTilesInfo() public view returns (tuple(address payable _owner, uint256 _currentValue, uint256 _paidValue)[256] tileInfo)",
   "function paint(uint16 coordinate, uint8 r, uint8 g, uint8 b) public payable"  ,
   "function _minPrice() public view returns(uint256)",
   "function _maxMintable() public view returns(uint16)",
   "function _currentId() public view returns(uint16)",
   "function getNftSpentValue() public view returns (uint256)"
];

export default class MfpContract {
  private contract: Contract;
  private address: string;

  constructor(provider: providers.Web3Provider, address: string) {
    this.contract = new Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string,
      ABI,
      provider.getSigner(),
    );
  
    this.address = address;
  }

  async getMinPrice() {
    return ethers.utils.formatEther(await this.contract._minPrice());
  }

  async getMaxMintable() {
    return  this.contract._maxMintable();
  }

  async getCurrentId() {
    return  Number(await this.contract._currentId());
  }

  async getSpentValue() {
    return  ethers.utils.formatEther(await this.contract.getNftSpentValue());
  }

  async getTileById(currentId: number) {
    const a = await Promise.all([
      [...Array(currentId)].map(async (id, index ) => this.contract.getTilesColorById(index))
    ]);

    return a.filter((item) => item.length > 0);
  }

  async getTiles() {
    const pages = await Promise.all([
      this.contract.getTilesColor(),
      this.contract.getTilesInfo(),
    ]);

    const allInfo = pages[1];

    return pages[0].map((item: any, index: number) => ({
      ...item,
      ...allInfo[index],
      owner: allInfo[index][0],
      currentValue: Number(ethers.utils.formatEther(allInfo[index]._currentValue._hex)),
      paidValue: Number(ethers.utils.formatEther(allInfo[index]._paidValue._hex)),
    }))
  }

  async paintPixel(coord: number, r: number, g: number, b: number, offer: number) {
    try {
      const op = await this.contract.paint(coord, r, g, b, {
        value: ethers.utils.parseEther(offer.toString())
      });

      return { success: true, message: "it's yours" }
      
    } catch(err) {
      console.log(err);

      return {
        success: false,
        message: err?.data?.message,
      };
    }
  }
}

export function buildMfpContract(provider, address) {
  return new MfpContract(provider, address);
}
