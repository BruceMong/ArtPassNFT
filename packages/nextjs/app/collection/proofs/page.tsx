"use client";

import React from 'react'; // Importation de React
import type { NextPage } from "next";
import { useQuery } from "@apollo/client";
import {GET_NFTS_PROOF_BOOK} from "~~/constants/subgraphQueries";
import {NFTProofBox} from '../_components/NFTProofBox';
import { useAccount } from "wagmi";
import { cp } from 'fs';
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const CollectionProofs: NextPage = () => {


  const { loading, error, data: listedNftsReadBook} = useQuery(GET_NFTS_PROOF_BOOK, {
    variables: {
      first: 20, // Nombre de tokenBooks à récupérer
      skip: 0,  // À partir de quel point de la liste commencer, utile pour la pagination
    },
  });
  console.log(listedNftsReadBook);
  const { address: connectedAddress } = useAccount();



  // Utiliser `reduce` pour séparer les NFTs possédés de ceux des autres en une seule itération
  const { ownedNfts, otherNfts } = listedNftsReadBook?.tokenReadBooks?.reduce((acc, nft) => {
    if (nft.owner.toLowerCase() === connectedAddress?.toLowerCase()) {
      acc.ownedNfts.push(nft);
    } else {
      acc.otherNfts.push(nft);

    }
    return acc;
  }, { ownedNfts: [], otherNfts: [] }) || { ownedNfts: [], otherNfts: [] };



    
  

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-2xl font-bold mb-4">Collection de NFT Proof Books</h1>
      {loading || !listedNftsReadBook ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="text-lg font-semibold mb-2">NFT possédés</div>
          <div className="flex flex-row w-full max-w-7xl p-5 overflow-x-auto space-x-4 mb-8">
            {ownedNfts.length > 0 ? (
              ownedNfts.map((nft: any) => {
                
                return <NFTProofBox key={nft.tokenId} owner={nft.owner} tokenId={nft.tokenId} />;
              })
            ) : (
              <div>Vous ne possédez aucun NFT dans cette collection.</div>
            )}
          </div>

          <div className="text-lg font-semibold mb-2">Autres NFTs</div>
          <div className="flex flex-row w-full max-w-7xl p-5 overflow-x-auto space-x-4">
            {otherNfts.map((nft: any) => ( 
              <NFTProofBox key={nft.tokenId} owner={nft.owner} tokenId={nft.tokenId} /> //+1 prochaine fois que je redeploie
            ))}
          </div>
        </>
      )}
    </div>
  );
};


export default CollectionProofs;

