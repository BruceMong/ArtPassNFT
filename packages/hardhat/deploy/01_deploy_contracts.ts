import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  console.log(deployer);

  const { deploy } = hre.deployments;
  console.log(deploy);

  // Déploiement du premier contrat (ArtNFT)
  const artNFTDeployment = await deploy("ArtNFT", {
    from: deployer,
    log: true,
    autoMine: true,
  });
  console.log(`ArtNFT deployed to: ${artNFTDeployment.address}`);

  // Déploiement du second contrat (ProofOfOwnNFT)
  const proofOfOwnNFTDeployment = await deploy("ProofOfOwnNFT", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });
  console.log(`ProofOfOwnNFT deployed to: ${proofOfOwnNFTDeployment.address}`);

  // Obtention de l'instance du premier contrat pour appeler sa méthode
  const signer = await hre.ethers.getSigner(deployer);
  const artNFT = await hre.ethers.getContractAt("ArtNFT", artNFTDeployment.address, signer);
  const proofOfOwnNFT = await hre.ethers.getContractAt("ProofOfOwnNFT", proofOfOwnNFTDeployment.address, signer);

  await artNFT.setProofOfOwnContractAddress(proofOfOwnNFTDeployment.address);
  console.log(`ProofOfOwnNFT address set in ArtNFT.`);
  await proofOfOwnNFT.setArtContractAddress(artNFTDeployment.address);
  console.log(`ArtNFT address set in ProofOfOwnNFT.`);
};

export default deployContracts;
deployContracts.tags = ["ArtNFT", "ProofOfOwnNFT"];
