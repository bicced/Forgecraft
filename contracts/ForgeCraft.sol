// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Game is ERC1155, Ownable {
    
    uint256 public constant WOOD = 0;
    uint256 public constant STONE = 1;
    uint256 public constant CLOTH = 2;
    uint256 public constant AXE = 3;
    uint256 public constant SLING = 4;
    uint256 public constant BAG = 5;
    uint256 public constant HUT = 6;

    uint256 public lastMint;

    address public forgeAddress;

    constructor() ERC1155("https://ipfs.io/ipfs/QmRdvtwMRN2XNjD5wwsiTouzmvKKeqMhcczCWDKUx8zRaS/{id}.json") {
        lastMint = block.timestamp;
    }

    modifier onlyForge() {
        require(msg.sender == forgeAddress, "Only Forge contract can call this");
        _;
    }

    function setForgeAddress(address _forgeAddress) public onlyOwner {
        forgeAddress = _forgeAddress;
    }

    function mint(uint256 id) public {
        require(id == WOOD || id == STONE || id == CLOTH, "You did not select a valid item to mint");
        require(block.timestamp - lastMint > 1 minutes , "Only 1 item can be minted every minute");
        lastMint = block.timestamp;
        _mint(msg.sender, id, 1, "");
    }

    function burn(uint256 id) public {
        require(id == AXE || id == SLING || id == BAG || id == HUT, "You did not select a valid item to burn");
        _burn(msg.sender, id, 1);
    }

    function trade(uint256 from, uint256 to) public {
        require(to == WOOD || to == STONE || to == CLOTH, "You cannot trade for this item");
        require(balanceOf(msg.sender, from) >= 1, "You do not have this item to trade");
        _burn(msg.sender, from, 1);
        _mint(msg.sender, to, 1, "");
    }

    function forgeMint(address to, uint256 id, uint256 amount, bytes memory data) external onlyForge() {
        require(id == AXE || id == SLING || id == BAG || id == HUT, "You did not select a valid item to mint");
        _mint(to, id, amount, data);
    }

    function burnBatch(address account, uint256[] memory ids, uint256[] memory amounts) external onlyForge() {
        _burnBatch(account, ids, amounts);
    }

}

interface IGameActions {
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function forgeMint(address to, uint256 id, uint256 amount, bytes memory data) external;
    function burnBatch(address account, uint256[] memory ids, uint256[] memory amounts) external;
}

contract Forge {
  uint256 public constant WOOD = 0;
  uint256 public constant STONE = 1;
  uint256 public constant CLOTH = 2;
  uint256 public constant AXE = 3;
  uint256 public constant SLING = 4;
  uint256 public constant BAG = 5;
  uint256 public constant HUT = 6;

  mapping(uint256 => ForgeRequirement) internal forgeRequirements;

  address public immutable source;

  struct ForgeRequirement {
      uint256[] ids;
      uint256[] amounts;
  }

  constructor(address gameAddress) {
      source = gameAddress;
      initForgeRequirements();
  }

  function forge(uint256 id) public {
    require(id == AXE || id == SLING || id == BAG || id == HUT, "You did not select a valid item to forge");
    ForgeRequirement memory requirement = forgeRequirements[id];
    for (uint256 i = 0; i < requirement.ids.length; i++) {
        require(
            IGameActions(source).balanceOf(msg.sender, requirement.ids[i]) >=
                requirement.amounts[i],
            "You do not have the required resources to forge this"
        );
    }
    IGameActions(source).burnBatch(msg.sender, requirement.ids, requirement.amounts);
    IGameActions(source).forgeMint(msg.sender, id, 1, "");
  }

  function initForgeRequirements() internal {
      forgeRequirements[AXE] = ForgeRequirement({
          ids: new uint256[](2),
          amounts: new uint256[](2)
      });
      forgeRequirements[AXE].ids[0] = WOOD;
      forgeRequirements[AXE].ids[1] = STONE;
      forgeRequirements[AXE].amounts[0] = 1;
      forgeRequirements[AXE].amounts[1] = 1;

      forgeRequirements[SLING] = ForgeRequirement({
          ids: new uint256[](2),
          amounts: new uint256[](2)
      });
      forgeRequirements[SLING].ids[0] = STONE;
      forgeRequirements[SLING].ids[1] = CLOTH;
      forgeRequirements[SLING].amounts[0] = 1;
      forgeRequirements[SLING].amounts[1] = 1;

      forgeRequirements[BAG] = ForgeRequirement({
          ids: new uint256[](2),
          amounts: new uint256[](2)
      });
      forgeRequirements[BAG].ids[0] = WOOD;
      forgeRequirements[BAG].ids[1] = CLOTH;
      forgeRequirements[BAG].amounts[0] = 1;
      forgeRequirements[BAG].amounts[1] = 1;

      forgeRequirements[HUT] = ForgeRequirement({
          ids: new uint256[](3),
          amounts: new uint256[](3)
      });
      forgeRequirements[HUT].ids[0] = WOOD;
      forgeRequirements[HUT].ids[1] = STONE;
      forgeRequirements[HUT].ids[2] = CLOTH;
      forgeRequirements[HUT].amounts[0] = 1;
      forgeRequirements[HUT].amounts[1] = 1;
      forgeRequirements[HUT].amounts[2] = 1;
  }
}
