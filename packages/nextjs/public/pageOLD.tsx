"use client";


//import  BookForm  from "./_components/sss";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useScaffoldEventSubscriber, useDeployedContractInfo, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from "wagmi";
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';


// Vous pouvez nécessiter d'importer d'autres dépendances selon votre setup

const contractName = "BooksNFT"; // Assurez-vous que ceci est l'adresse du contrat si c'est ce que vous voulez utiliser

const Collection: NextPage = ({nfts} : any) => {
  // Le hook `useAccount` doit être utilisé dans le corps du composant pour récupérer l'adresse de l'utilisateur
  // const { address } = useAccount();

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-2xl font-bold mb-4">Collection de NFT Books</h1>
      <div className="w-full max-w-2xl p-5">
        {/* Ici, vous pouvez mapper sur les NFTs et les afficher */}
        {nfts && nfts.map((nft:any, index:any) => (
          <div key={index}>
            {/* Afficher les détails du NFT */}
            <p>{nft.tokenId}</p>
            {/* Ajoutez plus de détails selon ce que vous avez besoin d'afficher */}
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  let nfts = [];

  try {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

    const response = await Moralis.EvmApi.nft.getContractNFTs({
      chain: "eth", // ou "0x1", à ajuster selon vos besoins
      address: "ADRESSE_DU_CONTRAT", // Remplacez par l'adresse de votre contrat
    });

    if (response && response.result) {
      nfts = response.result.map((item) => ({
        tokenId: item.tokenId,
        // Ajoutez ici d'autres propriétés que vous souhaitez utiliser
      }));
    }

  } catch (e) {
    console.error(e);
  }

  // Retournez les NFTs en tant que props
  return { props: { nfts } };
}

export default Collection;