import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export default function NFTProofBox({ subgraph }) {
  console.log(subgraph);
  console.log(subgraph.tokenId);
  const {
    data: onChainDataProof,
    isLoading: isLoadingProof,
    error: errorProof,
  } = useScaffoldContractRead({
    contractName: "ProofOfOwnNFT",
    functionName: "getProofOwnArt",
    args: [subgraph.tokenId],
  });

  if (isLoadingProof) return <div>Loading proof data...</div>;
  if (errorProof) return <div>Error loading proof data: {errorProof.message}</div>;

  return (
    <>
      {onChainDataProof ? (
        <NFTProofBoxDisplay subgraph={subgraph} onChainDataProof={onChainDataProof} />
      ) : (
        <div>No proof data found</div>
      )}
    </>
  );
}

export function NFTProofBoxDisplay({ subgraph, onChainDataProof }) {
  const router = useRouter();

  const [imageURI, setImageURI] = useState("");
  const [data, setData] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  console.log(onChainDataProof);
  console.log(onChainDataProof[1]);
  console.log(onChainDataProof[0]);
  console.log("onChainDataProof");

  const {
    data: onChainData,
    isLoading: isLoadingArt,
    error: errorArt,
  } = useScaffoldContractRead({
    contractName: "ArtNFT",
    functionName: "getArtDetails",
    args: [onChainDataProof[1]],
  });

  const {
    data: tokenURI,
    isLoading: isLoadingTokenURI,
    error: errorTokenURI,
  } = useScaffoldContractRead({
    contractName: "ProofOfOwnNFT",
    functionName: "tokenURI",
    args: [onChainDataProof[1]],
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
        } catch (error) {
          console.error(`Error fetching token URI details:`, error);
        }
      }
    }
    updateUI();
  }, [tokenURI]);

  if (isLoadingArt || isLoadingTokenURI) return <div>Loading art data...</div>;
  if (errorArt) return <div>Error loading art data: {errorArt.message}</div>;
  if (errorTokenURI) return <div>Error loading token URI: {errorTokenURI.message}</div>;

  const toggleDescription = () => setShowDescription(!showDescription);

  return (
    <div className="p-2 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-white dark:border-gray-700">
      {imageURI ? (
        <div className="flex flex-col items-center gap-2">
          <Image
            onClick={() => {
              router.push("/art/" + subgraph.tokenId);
            }}
            loader={() => imageURI}
            src={imageURI}
            unoptimized={true}
            width="200"
            height="200"
            alt={subgraph?.name || "NFT Image"}
            className="rounded-t-lg"
          />
          <div className="px-5 pb-5">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {onChainData && onChainData[0]}
            </h5>
            <div className="italic text-sm">Token ID Proof: {subgraph.tokenId}</div>
            <div className="italic text-sm">Date d'obtention: {onChainDataProof && onChainDataProof[0]}</div>
            <div className="text-gray-700 dark:text-gray-400">{onChainData && onChainData[1]}</div>
            {showDescription && <p className="text-gray-500 dark:text-gray-400 mt-2">{data?.description}</p>}
            <button onClick={toggleDescription} className="mt-3 text-sm underline">
              {showDescription ? "Hide Description" : "Show Description"}
            </button>
          </div>
        </div>
      ) : (
        <div>Loading image...</div>
      )}
    </div>
  );
}
