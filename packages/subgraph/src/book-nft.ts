import {
  Transfer as TransferEvent
} from "../generated/BookNFT/BookNFT"
import {
  TokenBook, TransferBook
} from "../generated/schema"

export function handleTransfer(event: TransferEvent): void {
  let token = TokenBook.load(event.params.tokenId.toString())
  if (!token) {
    token = new TokenBook(event.params.tokenId.toString())
  }
  token.owner = event.params.to
  token.tokenId = event.params.tokenId
  token.save()

  let transfer = new TransferBook(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.tokenId = event.params.tokenId
  transfer.save()
}