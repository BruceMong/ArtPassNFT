"use client";

import { useEffect } from "react";
import BookForm from "./_components/BookForm";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useScaffoldContractRead, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

//const selectedContractStorageKey = "scaffoldEth2.selectedContract";
//const contractsData = getAllContracts();
//const contractNames = Object.keys(contractsData) as ContractName[];

const CreateBook: NextPage = () => {
  const ContractName = "ArtNFT";
  const { data: ownerAdress } = useScaffoldContractRead({
    contractName: ContractName,
    functionName: "owner",
  });

  const { address } = useAccount();
  //const { data: deployedContractData } = useDeployedContractInfo(ContractName);
  // Utilisation de `useScaffoldEventSubscriber` pour écouter l'événement `Transfer`
  useScaffoldEventSubscriber({
    contractName: ContractName,
    eventName: "Transfer",
    listener: logs => {
      // Traitez et stockez les logs des événements dans l'état local
      const formattedLogs = logs.map(log => {
        // Assurez-vous que les noms de propriété correspondent à ceux émis par votre événement
        const { from, to, tokenId } = log.args;
        return { from, to, tokenId: tokenId }; // Convertissez tokenId en chaîne si nécessaire
      });
      console.log(formattedLogs); // Mettez à jour l'état avec les logs formatés
    },
  });

  return (
    <>
      {address == ownerAdress ? (
        <div className="flex flex-col items-center mt-8">
          <h1 className="text-2xl font-bold mb-4">Créer un livre :</h1>

          <BookForm ContractName={ContractName} />
        </div>
      ) : (
        <div>
          {" "}
          <p>Vous ne disposez pas des droits permettant de créer des livres</p>
          <p>
            {address} != {ownerAdress}
          </p>
        </div>
      )}
    </>
  );
};

export default CreateBook;
