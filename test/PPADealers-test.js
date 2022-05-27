const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PPADealers", function () {
  it("PPADealers isValidSignature test", async function () {
    const [signer] = await ethers.getSigners();
    const PPADealers = await ethers.getContractFactory("PPADealers");
    const pnft = await PPADealers.deploy();
    await pnft.deployed();
    console.log('pnft.address:',pnft.address);

    let tx  = await pnft.setSignerAddress(signer.address);
    tx = tx.wait();

    let signAdr = await pnft.signerAddress();
    console.log('signAdr:',signAdr);

    const adr = signer.address;
    const minCount = 1;
    const saleState = 3;
    let messageHash;

    // ethers.utils.solidityPack([types],[values]) 相当于
    // solidity中的abi.encodePacked()的方法
    // let msg = ethers.utils.solidityPack(['address','uint256','uint256'],[adr,minCount,saleState]);
    // console.log('msg-encode:',msg);
    // messageHash = ethers.utils.keccak256(msg);
    // console.log("Message Hash: ", messageHash);

    //这里和以上代码功能相同
    messageHash = ethers.utils.solidityKeccak256(['address','uint256','uint256'],[adr,minCount,saleState]);
    console.log("Message Hash: ", messageHash);

    let messageBytes = ethers.utils.arrayify(messageHash);
    // //由合约的创建者签名这些白名单地址，将签名信息和消息hash与对应的地址存储在服务器
    let signature = await signer.signMessage(messageBytes);
    console.log("Signature: ", signature);

    //调用合约查看编码
    let encodeRes = await pnft.encodeParams(adr,minCount,saleState);
    console.log('encodeRes:',encodeRes);

    //验证签名
    let isSign = await pnft.isValidSignature(adr,minCount,saleState,signature);
    console.log('isSign:',isSign);
    expect(isSign).to.equal(true);

  });
});
