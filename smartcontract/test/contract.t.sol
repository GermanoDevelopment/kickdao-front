// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Test} from "forge-std/Test.sol";
import {KickDAO} from "../src/KickDAO.sol";
import {console} from "forge-std/console.sol";

contract KickDAOTest is Test {
    KickDAO public kickDAO;
    address public owner;
    address public user1;
    address public user2;
    
    function setUp() public {
        owner = makeAddr("owner");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        vm.prank(owner);
        kickDAO = new KickDAO(owner);
    }
    
    function testInitialState() public view {
        assertEq(kickDAO.name(), "KickDAO");
        assertEq(kickDAO.symbol(), "KDAO");
        assertEq(kickDAO.owner(), owner);
        assertEq(kickDAO.balanceOf(owner), 0);
    }
    
    function testBaseURI() public {
        vm.prank(owner);
        uint256 tokenId = kickDAO.safeMint(user1);
        
        string memory actualURI = kickDAO.tokenURI(tokenId);
        console.log("Actual tokenURI:", actualURI);
        
        string memory baseURI = "bafybeibqox746zpn7vadb6kthz2uwegbs7llb6augztkk4xl6awswuifvy";
        
        assertTrue(
            stringContains(actualURI, baseURI),
            "TokenURI should contain the IPFS hash"
        );
    }

    function stringContains(string memory source, string memory search) internal pure returns (bool) {
        bytes memory sourceBytes = bytes(source);
        bytes memory searchBytes = bytes(search);
        
        if (searchBytes.length > sourceBytes.length) {
            return false;
        }
        
        for (uint i = 0; i <= sourceBytes.length - searchBytes.length; i++) {
            bool foundHere = true;
            for (uint j = 0; j < searchBytes.length; j++) {
                if (sourceBytes[i + j] != searchBytes[j]) {
                    foundHere = false;
                    break;
                }
            }
            if (foundHere) {
                return true;
            }
        }
        
        return false;
    }
    
    function testSafeMint() public {
        vm.startPrank(owner);
        
        uint256 tokenId1 = kickDAO.safeMint(user1);
        assertEq(tokenId1, 0);
        assertEq(kickDAO.ownerOf(tokenId1), user1);
        assertEq(kickDAO.balanceOf(user1), 1);
        
        uint256 tokenId2 = kickDAO.safeMint(user2);
        assertEq(tokenId2, 1);
        assertEq(kickDAO.ownerOf(tokenId2), user2);
        assertEq(kickDAO.balanceOf(user2), 1);
        
        vm.stopPrank();
    }
    
    function testTokenIdIncrement() public {
        vm.startPrank(owner);
        
        uint256 tokenId1 = kickDAO.safeMint(user1);
        uint256 tokenId2 = kickDAO.safeMint(user1);
        uint256 tokenId3 = kickDAO.safeMint(user1);
        
        assertEq(tokenId1, 0);
        assertEq(tokenId2, 1);
        assertEq(tokenId3, 2);
        
        vm.stopPrank();
    }
    
    function testOnlyOwnerCanMint() public {
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", user1));
        kickDAO.safeMint(user2);
        
        vm.prank(owner);
        kickDAO.safeMint(user2);
        assertEq(kickDAO.balanceOf(user2), 1);
    }
    
    function testTransfer() public {
        vm.prank(owner);
        uint256 tokenId = kickDAO.safeMint(user1);
        
        vm.prank(user1);
        kickDAO.transferFrom(user1, user2, tokenId);
        
        assertEq(kickDAO.balanceOf(user1), 0);
        assertEq(kickDAO.balanceOf(user2), 1);
        assertEq(kickDAO.ownerOf(tokenId), user2);
    }
    
    function testApproveAndTransfer() public {
        vm.prank(owner);
        uint256 tokenId = kickDAO.safeMint(user1);
        
        vm.prank(user1);
        kickDAO.approve(user2, tokenId);
        
        assertEq(kickDAO.getApproved(tokenId), user2);
        
        vm.prank(user2);
        kickDAO.transferFrom(user1, user2, tokenId);
        
        assertEq(kickDAO.balanceOf(user1), 0);
        assertEq(kickDAO.balanceOf(user2), 1);
        assertEq(kickDAO.ownerOf(tokenId), user2);
    }
    
    function testTransferFromUnauthorized() public {
        vm.prank(owner);
        uint256 tokenId = kickDAO.safeMint(user1);
        
        vm.prank(user2);
        vm.expectRevert(abi.encodeWithSignature("ERC721InsufficientApproval(address,uint256)", user2, tokenId));
        kickDAO.transferFrom(user1, user2, tokenId);
    }
    
    function testOwnershipTransfer() public {
        assertEq(kickDAO.owner(), owner);
        
        vm.prank(owner);
        kickDAO.transferOwnership(user1);
        
        assertEq(kickDAO.owner(), user1);
        
        vm.prank(user1);
        kickDAO.safeMint(user2);
        
        vm.prank(owner);
        vm.expectRevert(abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", owner));
        kickDAO.safeMint(user2);
    }
    
    function testCompleteLifecycle() public {
        vm.prank(owner);
        uint256 tokenId = kickDAO.safeMint(user1);
        
        vm.prank(user1);
        kickDAO.approve(user2, tokenId);
        
        vm.prank(user2);
        kickDAO.transferFrom(user1, user2, tokenId);
        
        vm.prank(user2);
        kickDAO.transferFrom(user2, owner, tokenId);
        
        assertEq(kickDAO.balanceOf(user1), 0);
        assertEq(kickDAO.balanceOf(user2), 0);
        assertEq(kickDAO.balanceOf(owner), 1);
        assertEq(kickDAO.ownerOf(tokenId), owner);
    }
}