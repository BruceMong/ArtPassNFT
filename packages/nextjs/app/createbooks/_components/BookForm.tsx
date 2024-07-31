import React, { useState } from "react";
import { SHA256 } from "crypto-js";
import { toast } from "react-hot-toast";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

const BookForm = () => {
  const { address } = useAccount();

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    creator: "",
    description: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const JWT = process.env.NEXT_PUBLIC_IPFS_PINATA_KEY;

  async function storeNFT(data) {
    try {
      const metadata = {
        image: data.image,
        description: data.description,
      };

      const metadataString = JSON.stringify(metadata);
      const metadataHash = SHA256(metadataString).toString();

      const jsonData = JSON.stringify({
        pinataContent: metadata,
        name: "metadata.json",
      });

      const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JWT}`,
        },
        body: jsonData,
      });

      const resData = await res.json();
      return { ipfsHash: resData.IpfsHash, metadataHash };
    } catch (error) {
      console.error("Error uploading to Pinata:", error.message);
      throw new Error("Could not store NFT");
    }
  }

  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "ArtNFT",
    functionName: "createArtNFT",
    args: [],
    //value: parseEther("0.1"),
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  useScaffoldEventSubscriber({
    contractName: "ArtNFT",
    eventName: "Transfer",
    listener: logs => {
      logs.map(log => {
        const { from, to, tokenId } = log.args;
        console.log("NFT créer event :", from, to, tokenId);
        if (address == to) {
          toast.success("NFT créer !! id du nft : " + tokenId, {
            duration: 10000,
          }); // Displays a success message
        }
      });
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Empêche le rechargement de la page
    console.log("Art Data:", formData);

    const { ipfsHash, metadataHash } = await storeNFT(formData);
    console.log("Metadata URL:", ipfsHash);
    writeAsync({ args: [ipfsHash, formData.name, formData.creator, metadataHash] });
  };

  const fillFormAutomatically = () => {
    setFormData({
      name: "La Joconde",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/f/f9/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_natural_color.jpg", // Remplacez par l'URL réelle de l'image si disponible
      creator: "Leonardo da Vinci",
      description:
        "La Joconde, également connue sous le nom de Mona Lisa, est un portrait réalisé par l'artiste italien Léonard de Vinci, probablement entre 1503 et 1506.",
    });
  };

  return (
    <div className="w-full max-w-10xl p-5">
      <div className="flex justify-center items-start mt-8 space-x-8 w-full">
        <div className="flex flex-col items-center mt-8 bg-secondary p-10 rounded-lg shadow-lg w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="w-full max-w-lg">
            <div className="mb-4">
              <label htmlFor="name" className="block text-neutral text-sm font-bold mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-neutral text-sm font-bold mb-2">
                Image URL:
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="creator" className="block text-neutral text-sm font-bold mb-2">
                Creator:
              </label>
              <input
                type="text"
                id="creator"
                name="creator"
                value={formData.creator}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-neutral text-sm font-bold mb-2">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <button
              type="button"
              onClick={fillFormAutomatically}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
            >
              Fill Example
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="ml-8 p-10 bg-white rounded-lg shadow-lg w-full max-w-xl">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold">NFT Preview</h2>
          </div>
          <div className="mb-4">
            <img src={formData.image} alt="Artwork" className="w-full max-w-xs mx-auto" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold">{formData.name}</h3>
            <p>{formData.creator}</p>
            <p className="mt-4">{formData.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookForm;
