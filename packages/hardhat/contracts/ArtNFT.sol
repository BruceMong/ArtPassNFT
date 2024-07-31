// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface ProofOfOwnInterface {
    function createProofOfOwnNFT(address _to,  uint256 idRefTokenArt) external;
}

contract ArtNFT is Ownable, ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Artwork {
        string name;
        string creator;
        bytes32 metadataHash;
    }

    mapping(uint256 => Artwork) private _artworks;

    ProofOfOwnInterface public proofOfOwnContract;

    constructor() ERC721("ArtToken", "ART") {}

    function createArt(
        string memory metadataUrl,
        string memory name,
        string memory creator,
        bytes32 metadataHash
    ) external onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, metadataUrl);

        _artworks[newItemId] = Artwork({
            name: name,
            creator: creator,
            metadataHash: metadataHash
        });

        return newItemId;
    }

    function getArtDetails(uint256 tokenId) external view returns (string memory, string memory, bytes32) {
        require(_exists(tokenId), "ArtNFT: Query for nonexistent token");
        Artwork memory art = _artworks[tokenId];
        return (art.name,  art.creator, art.metadataHash);
    }

    function updateArtURI(uint256 tokenId, string memory newURI) external onlyOwner {
        require(_exists(tokenId), "ArtNFT: URI set of nonexistent token");
        _setTokenURI(tokenId, newURI);
    }

    function getArtNFT(uint256 tokenId) external {
        address lastHolder = ownerOf(tokenId);
        require(msg.sender != lastHolder, "You already have the token");

        _transfer(lastHolder, msg.sender, tokenId);

        proofOfOwnContract.createProofOfOwnNFT(lastHolder, tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
        require(false, "MyCustomERC721: direct transfers disabled, use getArtNFT instead.");
    }

    function setProofOfOwnContractAddress(address _address) external onlyOwner {
        proofOfOwnContract = ProofOfOwnInterface(_address);
    }
}
