"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import axios from "axios";
import type { NextPage } from "next";
import QRCode from "qrcode.react";
import { useAccount } from "wagmi";
import { GET_NFT_ART_BY_ID } from "~~/constants/subgraphQueries";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

interface ArtPageProps {
  params: {
    id: string;
  };
}

const ArtPage: NextPage<ArtPageProps> = ({ params }) => {
  /*   const router = useRouter() */
  const pathname = usePathname();
  const { address: connectedAddress } = useAccount();

  const [key, setKey] = useState(0); // Utilisez une clé pour forcer le re-rendu
  const reloadComponent = () => setKey(prevKey => prevKey + 1);

  const {
    loading,
    error,
    data: nftArt,
  } = useQuery(GET_NFT_ART_BY_ID, {
    variables: {
      id: params.id, // À partir de quel point de la liste commencer, utile pour la pagination
    },
  });

  const [imageURI, setImageURI] = useState("");
  const [data, setData] = useState("");

  const { data: tokenURI } = useScaffoldContractRead({
    contractName: "ArtNFT",
    functionName: "tokenURI",
    args: [params.id],
  });
  const { data: onChainData } = useScaffoldContractRead({
    contractName: "ArtNFT",
    functionName: "getArtDetails",
    args: [params.id],
  });

  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "ArtNFT",
    functionName: "getArtNFT",
    args: [params.id],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      reloadComponent();
    },
  });

  useEffect(() => {
    async function updateUI() {
      if (tokenURI) {
        console.log(`The TokenURI is ${tokenURI}`);

        const requestURL = "https://gateway.pinata.cloud/ipfs/" + tokenURI;
        try {
          const response = await axios.get(requestURL, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });
          const tokenURIResponse = response.data;
          setData(tokenURIResponse);
          setImageURI(tokenURIResponse.image);

          /*         const tokenURIResponse = await (await fetch(requestURL)).json();
        const imageURI = tokenURIResponse.image;
        const imageURIURL = "https://cloudflare-ipfs.com/ipfs/" + imageURI;
        setImageURI(imageURIURL);
        setData(tokenURIResponse); */
        } catch (error) {
          console.error(`Error fetching event details for event ${params.id}:`, error);
        }
      }
    }
    updateUI();
  }, [tokenURI]);

  /*   useEffect(() => {
    console.log("cd", onChainData);
  }, [onChainData]); */

  if (loading) return <div>loading</div>;

  return (
    <div className="max-w-4xl mx-auto my-8 p-5 bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-white-800 dark:border-gray-700">
      {imageURI && (
        <div className="flex flex-col items-center">
          <span className="flex flex-row items-center">
            <Image
              loader={() => imageURI}
              src={imageURI}
              unoptimized={true}
              width="300"
              height="300"
              alt={onChainData.name || "NFT Image"}
              className="rounded-lg"
            />
            <div className="flex flex-col items-center ml-16">
              <h2 className="text-2xl font-bold tracking-tight text-gray-600 dark:text-gray-400 text-center ">
                Share :{" "}
              </h2>
              <QRCode size={256} title={"Print :"} value={pathname} />
            </div>
          </span>
          <div className="text-center mt-5">
            <h2 className="text-3xl font-bold tracking-tight text-gray-600 dark:text-gray-400">
              Name: {onChainData[0]}
            </h2>
            <p className="italic text-gray-500">Owned by {nftArt?.tokenArt.owner}</p>

            {nftArt?.tokenArt.owner == connectedAddress?.toLowerCase() ? (
              <p>You Own the NFT</p>
            ) : (
              <button
                onClick={() => {
                  writeAsync();
                }}
                className="btn btn-primary mt-2"
              >
                Get this NFT
              </button>
            )}

            <p className="text-xl text-gray-600 dark:text-gray-400 mt-3">Creator: {onChainData[1]}</p>
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-400 text-base text-justify">{data.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtPage;
