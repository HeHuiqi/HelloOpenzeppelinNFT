const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
    it("MyNFT test", async function () {

        const [signer] = await ethers.getSigners();
        const MyNFT = await ethers.getContractFactory("MyNFT");
        const mynft = await MyNFT.deploy('');
        await mynft.deployed();
        console.log('mynft.address:', mynft.address);


        console.log("Contract deployed by: ", signer.address);
        // 白名单列表
        const allowlistedAddresses = [
            '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
            '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
            '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
            '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
            '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
        ];

        let message = allowlistedAddresses[0];
        // message = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";

        // Compute hash of the address
        // let msg = ethers.utils.arrayify(message);
        // console.log('msg:',msg);
        // let messageHash = ethers.utils.keccak256(message);
        let messageHash = ethers.utils.solidityKeccak256(['address'],[message]);
        console.log("Message Hash: ", messageHash);
        // messageHash = ethers.utils.keccak256(message);
        // console.log("Message Hash: ", messageHash);
        // messageHash = ethers.utils.id(message);
        // console.log("Message Hash: ", messageHash);

        // let hash = await mynft.signUser();

        // console.log('hash:',hash);
        // messageHash = hash;
        // Sign the hashed address
        let messageBytes = ethers.utils.arrayify(messageHash);
        //由合约的创建者签名这些白名单地址，将签名信息和消息hash与对应的地址存储在服务器

        let signature = await signer.signMessage(messageBytes);
        console.log("Signature: ", signature);


        // 然后当用户申请获得预售时，根据用户地址查询其签名信息
        // 用户使用获得其签名信息和消息hash一并传递的合约的preSale方法，然后通过验证签名的地址
        // 是不是有合约创建者，如果是说明就是

        recover = await mynft.recoverSigner(messageHash,signature);
        console.log("Message was signed by: ", recover.toString());


   
    });
});

