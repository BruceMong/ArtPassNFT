import { gql } from "@apollo/client";

export const GET_NFTS_ART = gql`
  query GetTokenArts($first: Int!, $skip: Int) {
    tokenArts(first: $first, skip: $skip) {
      id
      owner
      tokenId
    }
  }
`;

export const GET_NFT_ART_BY_ID = gql`
  query GetTokenArt($id: ID!) {
    tokenArt(id: $id) {
      id
      owner
      tokenId
    }
  }
`;

export const GET_NFTS_PROOF_ART = gql`
  query GetTokenProofArts($first: Int!, $skip: Int) {
    tokenProofArts(first: $first, skip: $skip) {
      id
      owner
      tokenId
    }
  }
`;

export const GET_NFT_PROOF_ART_BY_ID = gql`
  query GetTokenProofArt($id: ID!) {
    tokenProofArt(id: $id) {
      id
      owner
      tokenId
    }
  }
`;

export const GET_NFTS_PROOF_ART_BY_OWNER = gql`
  query GetTokenProofArtsByOwner($owner: String!, $first: Int!, $skip: Int) {
    tokenProofArts(first: $first, skip: $skip, where: { owner: $owner }) {
      id
      owner
      tokenId
    }
  }
`;
