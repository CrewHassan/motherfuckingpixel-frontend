import { Contract, ethers, providers } from "ethers";
import { relative } from "path/posix";

const ABI = [
   "function getTilesColor() public view returns (uint256[32] tiles)",
   "function getTilesColorById(uint16 id) public view returns (uint256[32] tiles)",
   "function getTilesInfo() public view returns (tuple(address payable _owner, uint256 _currentValue, uint256 _paidValue)[256] tileInfo)",
   "function paint(uint16 coordinate, uint8 r, uint8 g, uint8 b, uint8 a) public payable"  ,
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
      [...Array(currentId)].map(async (id, index ) => [])// this.contract.getTilesColorById(index))
    ]);

    return a.filter((item) => item.length > 0);
  }

  async getTiles() {
    const pages = await Promise.all([
      this.contract.getTilesColor(),
      this.contract.getTilesInfo(),
    ]);

    const allInfo = pages[1];

    const breakPixelsPack = (pixelBytes: Uint8Array, index: number, relativePosition: number) => {
      return {
        r: pixelBytes[relativePosition * 4] || 0,
        g: pixelBytes[relativePosition * 4 + 1] || 0,
        b: pixelBytes[relativePosition * 4 + 2] || 0,
        a: pixelBytes[relativePosition * 4 + 3] || 0,
        ...allInfo[index],
        owner: allInfo[index][0],
        currentValue: Number(ethers.utils.formatEther(allInfo[index]._currentValue._hex)),
        paidValue: Number(ethers.utils.formatEther(allInfo[index]._paidValue._hex)),
      }
    }

    const pixels = pages[0].map((item: any, index: number) => {
      console.log(item);
      const pixelBytes: Uint8Array = ethers.utils.arrayify(item);

      return [
        breakPixelsPack(pixelBytes, index * 8, 0),
        breakPixelsPack(pixelBytes, index * 8 + 1, 1),
        breakPixelsPack(pixelBytes, index * 8 + 2, 2),
        breakPixelsPack(pixelBytes, index * 8 + 3, 3),
        breakPixelsPack(pixelBytes, index * 8 + 4, 4),
        breakPixelsPack(pixelBytes, index * 8 + 5, 5),
        breakPixelsPack(pixelBytes, index * 8 + 6, 6),
        breakPixelsPack(pixelBytes, index * 8 + 7, 7),
      ]
      // breakPixelsPack(pixelBytes, index, 3);
      // return [];
    //   ...item,
    //   ...allInfo[index],
    //   owner: allInfo[index][0],
    //   currentValue: Number(ethers.utils.formatEther(allInfo[index]._currentValue._hex)),
    //   paidValue: Number(ethers.utils.formatEther(allInfo[index]._paidValue._hex)),
    // }))
  })

    console.log(pixels);
    return pixels.flat();
  }

  async paintPixel(coord: number, r: number, g: number, b: number, a: number, offer: number) {
    try {
      const op = await this.contract.paint(coord, r, g, b, a, {
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
