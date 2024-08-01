"use client";

import React from "react";
import NFTBox from "../_components/NFTBox";
import { useQuery } from "@apollo/client";
import { cp } from "fs";
// Importation de React
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { GET_NFTS_ART } from "~~/constants/subgraphQueries";

const CollectionArts: NextPage = () => {
  const {
    loading,
    error,
    data: listedNftsArt,
  } = useQuery(GET_NFTS_ART, {
    variables: {
      first: 20, // Nombre de tokenBooks à récupérer
      skip: 0, // À partir de quel point de la liste commencer, utile pour la pagination
    },
  });
  //console.log(listedNftsBook);
  const { address: connectedAddress } = useAccount();
  console.log(listedNftsArt);

  // Utiliser `reduce` pour séparer les NFTs possédés de ceux des autres en une seule itération
  const { ownedNfts, otherNfts } = listedNftsArt?.tokenArts?.reduce(
    (acc, nft) => {
      if (nft.owner.toLowerCase() === connectedAddress?.toLowerCase()) {
        acc.ownedNfts.push(nft);
      } else {
        acc.otherNfts.push(nft);
      }
      return acc;
    },
    { ownedNfts: [], otherNfts: [] },
  ) || { ownedNfts: [], otherNfts: [] };

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-2xl font-bold mb-4">Collection de NFT Art</h1>
      {loading || !listedNftsArt ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="text-lg font-semibold mb-2">NFT possédés</div>
          <div className="flex flex-row w-full max-w-7xl p-5 overflow-x-auto space-x-4 mb-8">
            {ownedNfts.length > 0 ? (
              ownedNfts.map((nft: any) => <NFTBox key={nft.tokenId} subgraph={nft} />)
            ) : (
              <div>Vous ne possédez aucun NFT dans cette collection.</div>
            )}
          </div>

          <div className="text-lg font-semibold mb-2">Autres NFTs</div>
          <div className="flex flex-row w-full max-w-7xl p-5 overflow-x-auto space-x-4">
            {otherNfts.map((nft: any) => (
              <NFTBox key={nft.tokenId} subgraph={nft} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CollectionArts;
