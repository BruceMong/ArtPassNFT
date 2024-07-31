//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol"; // Import for burnable functionality
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";


interface ArtInterface {
    function getArtURI(uint256 tokenId) external view returns (string memory);
}

contract ProofOfOwnNFT is Ownable, ERC721Burnable {
 	using Strings for uint256;
    
 	ArtInterface public artContract;

	struct ProofOwnArt  {  //string description; (off-chain) => via idrefToken on retrieve sur l'autre contract
		uint32 dateOwn;
        uint256 idRefTokenArt;
	}

   	address private allowedCaller;
	ProofOwnArt [] private proofOwnArt;
	constructor(address _caller) ERC721("ArtProofToken", "APT") {
        allowedCaller = _caller;

    }

    function burnProofOfOwn(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Caller is not owner nor approved");
        _burn(tokenId);
    }

    function setArtContractAddress(address _address) external onlyOwner {
		artContract = ArtInterface(_address);
	}

    function getProofOwnArt(uint256 index) public view returns (uint32 dateOwn, uint256 idRefTokenArt, string memory uri) {
    require(index < proofOwnArt.length, "Invalid index.");  

    ProofOwnArt memory art = proofOwnArt[index];
    string memory uriArt = artContract.getArtURI(art.idRefTokenArt);
    return (art.dateOwn, art.idRefTokenArt, uriArt);
}

    function setAllowedCaller(address _caller) external onlyOwner {
        allowedCaller = _caller;
    }

    function createProofOfOwnNFT(address _to, uint256 idRefTokenArt) external {

        require(msg.sender == address(artContract), "Caller is not authorized");
		proofOwnArt.push(ProofOwnArt(uint32(block.timestamp), idRefTokenArt));
		uint256 id = proofOwnArt.length - 1; 
        console.log(idRefTokenArt);

		_mint(_to, id);
    }

	// Surcharge de transferFrom pour empêcher tout transfert
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721) {
        require(false, "NonTransferableERC721: token transfer disabled.");
    }

    // Surcharge de safeTransferFrom pour empêcher tout transfert
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721) {
        require(false, "NonTransferableERC721: token transfer disabled.");
    }

    // Surcharge de safeTransferFrom avec data pour empêcher tout transfert
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public override(ERC721) {
        require(false, "NonTransferableERC721: token transfer disabled.");
    }

    // Désactiver l'approbation de tous les transferts
    function setApprovalForAll(address operator, bool approved) public override(ERC721) {
        require(false, "NonTransferableERC721: approvals are disabled.");
    }

    // Désactiver l'approbation pour le transfert de tokens spécifiques
    function approve(address to, uint256 tokenId) public override(ERC721) {
        require(false, "NonTransferableERC721: token approval disabled.");
    }

}
