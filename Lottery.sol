// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public manager; // Address of the contract manager
    address[] public players; // Array to store the addresses of players
    
    constructor() {
        manager = msg.sender; // Assign the contract deployer as the manager
    }
    
    function buyTicket() public payable {
        require(msg.value > 0.01 ether, "Minimum ticket price is 0.01 ether");
        players.push(msg.sender); // Add the player's address to the array of players
    }
    
    function getRandomNumber() private view returns (uint) {
        // Generate a pseudo-random number using a combination of block information and player addresses
        uint rand = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
        return rand % players.length;
    }
    
    function selectWinner() public restricted {
        require(players.length > 0, "No players in the lottery");
        
        uint randomIndex = getRandomNumber();
        address payable winner = payable(players[randomIndex]);
        uint totalPrize = address(this).balance;
        winner.transfer(totalPrize);
        
        // Reset the players array for the next round
        players = new address[](0);
    }
    
    modifier restricted() {
        require(msg.sender == manager, "Only the manager can call this function");
        _;
    }
    
    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}
