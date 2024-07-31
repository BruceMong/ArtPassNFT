"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {GET_NFT_BOOK_BY_ID } from "~~/constants/subgraphQueries";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import type { NextPage } from "next";
import Image from "next/image";
import QRCode from 'qrcode.react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'


interface BookPageProps {
  params: {
    id: string
  }
}

const BookPage: NextPage<BookPageProps> = ({ params }) => {
  const router = useRouter()
  const pathname = usePathname()

  const [key, setKey] = useState(0); // Utilisez une clé pour forcer le re-rendu
  const reloadComponent = () => setKey(prevKey => prevKey + 1);

  const { loading, error, data: nftBook} = useQuery(GET_NFT_BOOK_BY_ID, {
    variables: {
      id: params.id,  // À partir de quel point de la liste commencer, utile pour la pagination
    },
  });

 
  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "BooksNFT",
    functionName: "getBookNFT",
    args: [ params.id],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      reloadComponent()
    },
  });


  const [imageURI, setImageURI] = useState("");
  const [data, setData] = useState("");
  
  const { data: tokenURI} = useScaffoldContractRead({
    contractName: "BooksNFT",
    functionName: "tokenURI",
    args: [params.id],
  });

  
useEffect(() => {
    async function updateUI() {
    if (tokenURI) {
        console.log(`The TokenURI is ${tokenURI}`)
        
        const requestURL = tokenURI.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
        const tokenURIResponse = await (await fetch(requestURL)).json()
        const imageURI = tokenURIResponse.image
        const imageURIURL = imageURI.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
        setImageURI(imageURIURL)
        setData(tokenURIResponse);
      }
    }
    updateUI();
}, [tokenURI]);

if(loading)
  return <div>loading</div>

  return (
<div className="max-w-4xl mx-auto my-8 p-5 bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
      {imageURI && (
        <div className="flex flex-col items-center">
          <span  className="flex flex-row items-center">
          <Image loader={() => imageURI} src={imageURI} unoptimized={true} width="300" height="300" alt={data.name || "NFT Image"} className="rounded-lg" />
          <div className="flex flex-col items-center ml-16">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center ">Print this QR on book : </h2>
          <QRCode  size={256} title={"Print on book :"} value={pathname} /> 
          </div>
          </span>
          <div className="text-center mt-5">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{data.name}</h2>
            <p className="italic text-gray-500">Owned by {nftBook?.tokenBook.owner}</p>
            <button onClick={() => { 
                writeAsync()
              }} className="btn btn-primary mt-2">Get this NFT Book</button>
            <p className="text-xl text-gray-900 dark:text-white mt-3">Author: {data.author}</p>
            <p className="text-lg text-gray-700 dark:text-gray-400">Published: {data.yearPublished}</p>
            <p className="text-lg text-gray-700 dark:text-gray-400">ISBN: {data.isbn}</p>
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-400 text-base text-justify">{data.description}</p>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default BookPage;
