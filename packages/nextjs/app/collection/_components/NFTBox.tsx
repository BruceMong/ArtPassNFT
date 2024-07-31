import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
// Simulant l'utilisation d'un hook personnalisé pour lire les contrats.
// Remplacez par votre importation réelle.
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

interface NFTBoxProps {
  owner: string;
  tokenId: number;
}

export default function NFTBox({ owner, tokenId }: NFTBoxProps) {
  const router = useRouter();

  const [imageURI, setImageURI] = useState("");
  const [data, setData] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  const { data: tokenURI } = useScaffoldContractRead({
    contractName: "ArtNFT",
    functionName: "tokenURI",
    args: [tokenId.toString()],
  });

  useEffect(() => {
    async function updateUI() {
      if (tokenURI) {
        console.log(`The TokenURI is ${tokenURI}`);

        const requestURL = tokenURI.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
        const tokenURIResponse = await (await fetch(requestURL)).json();
        const imageURI = tokenURIResponse.image;
        const imageURIURL = imageURI.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/");
        setImageURI(imageURIURL);
        setData(tokenURIResponse);
      }
    }
    updateUI();
  }, [tokenURI]);

  // Gestion du clic pour afficher/masquer la description.
  const toggleDescription = () => setShowDescription(!showDescription);

  return (
    <div className="p-2 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      {imageURI && (
        <div className="flex flex-col items-center gap-2">
          <Image
            onClick={() => {
              router.push("/book/" + tokenId);
            }}
            loader={() => imageURI}
            src={imageURI}
            unoptimized={true}
            width="200"
            height="200"
            alt={data.name || "NFT Image"}
            className="rounded-t-lg"
          />
          <div className="px-5 pb-5">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{data.name}</h5>
            <div className="italic text-sm">Owned by {owner}</div>
            <div className="italic text-sm">Token ID: {tokenId}</div>

            <div className="text-gray-700 dark:text-gray-400">{data.creator}</div>
            {showDescription && <p className="text-gray-500 dark:text-gray-400 mt-2">{data.description}</p>}
            <button onClick={toggleDescription} className="mt-3 text-sm underline">
              {showDescription ? "Hide Description" : "Show Description"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
