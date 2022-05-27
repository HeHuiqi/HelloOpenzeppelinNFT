// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract HqNFT{

    mapping(address=>uint256[]) private userOwnersMap; //某个用户所有的tokenId
    mapping(address=> mapping(uint256=>uint256)) public  userTokenIdIndexMap; //某个用户拥有的tokenID索引

    //获取用户所有的tokenIds
    function userOwnerTokenIds(address owner) public view returns(uint256[] memory){
        return userOwnersMap[owner];
    }

    //向用户添加一个tokenid
    function addTokenIdToUser(uint256 tokenId) public returns(bool) { 
        userOwnersMap[msg.sender].push(tokenId);
        uint256[] memory userTokenIds = userOwnersMap[msg.sender];
        uint256 index = userTokenIds.length;
        if(index > 0){
            index = index - 1;
        }
        userTokenIdIndexMap[msg.sender][tokenId] = index + 1;
        return true;
    }
    //删除用户拥有的一个tokenId
    function removeTokenIdFromUser(uint256 tokenId) public returns(bool){
        uint256 len =  userOwnersMap[msg.sender].length;
        require(len > 0, "you can't remove this tokenId");
        uint256 index = userTokenIdIndexMap[msg.sender][tokenId];
        require(index > 0,"tokenId not exist!");

        //如果删除的就是最后一个元素，那么就不用复制了
        if(index == len){
            //删除该tokenId对应的index，不过这里只是将其对应的index设置为0，故尔我们存储是要加1
            delete userTokenIdIndexMap[msg.sender][tokenId];
            // 最后的元素已经覆盖删除位置的值，所以也要删除该元素，更新数组长度
             userOwnersMap[msg.sender].pop();
            return true;
        }
        // 添加时将存储的index加1了，故这里从数组去值时应减去1
        index = index - 1;
        
        //取出最后一个值，覆盖要删除的下标的值
        uint256 lastTokenId = userOwnersMap[msg.sender][len-1];
        userOwnersMap[msg.sender][index] = lastTokenId;
        //保持新的index要加1，和添加一样
        userTokenIdIndexMap[msg.sender][lastTokenId] = index + 1;
        //删除该tokenId对应的index，不过这里只是将其对应的index设置为0，故尔我们存储是要加1
        delete userTokenIdIndexMap[msg.sender][tokenId];
        // 最后的元素已经覆盖删除位置的值，所以也要删除该元素，更新数组长度
        userOwnersMap[msg.sender].pop();

        return true;
    }

}