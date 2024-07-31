"use client";

import { useEffect } from 'react';
import Moralis from 'moralis';

// Ce flag est utilisé pour s'assurer que Moralis.start() est appelé une seule fois
let isMoralisStarted = false;

export const useMoralisInitializer = () => {
  useEffect(() => {
    if (!isMoralisStarted) {
      Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY })
        .then(() => {
          console.log('Moralis initialized');
          isMoralisStarted = true;
        })
        .catch((error) => {
          console.error('Error initializing Moralis:', error);
        });
    }
  }, []);
};