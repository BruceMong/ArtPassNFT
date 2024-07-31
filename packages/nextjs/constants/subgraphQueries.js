import {gql} from '@apollo/client'


export const GET_NFTS_BOOK = gql`
  query GetTokenBooks($first: Int!, $skip: Int) {
    tokenBooks(first: $first, skip: $skip) {
      id
      owner
      tokenId
    }
  }
`;

export const GET_NFT_BOOK_BY_ID = gql`
  query GetTokenBook($id: ID!) {
    tokenBook(id: $id) {
      id
      owner
      tokenId
    }
  }
`;


export const GET_NFTS_PROOF_BOOK = gql`
  query GetTokenReadBooks($first: Int!, $skip: Int) {
    tokenReadBooks(first: $first, skip: $skip) {
      id
      owner
      tokenId
    }
  }
`;

export const GET_NFT_BOOK_PROOF_BY_ID = gql`
  query GetTokenReadBooks($id: ID!) {
    tokenReadBook(id: $id) {
      id
      owner
      tokenId
    }
  }
`;

export const GET_NFTS_PROOF_BOOK_BY_OWNER = gql`
  query GetTokenReadBooksByOwner($owner: String!, $first: Int!, $skip: Int) {
    tokenReadBooks(first: $first, skip: $skip, where: {owner: $owner}) {
      id
      owner
      tokenId
    }
  }
`;