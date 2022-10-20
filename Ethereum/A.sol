// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

contract A {
    struct User {
        string userName;
        string org;
    }

    address owner;
    mapping(string => User[]) users;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOnwer() {
        require(msg.sender == owner);
        _;
    }

    function addOrgUsers(string[] calldata userNames, string calldata org)
        external
        onlyOnwer
    {
        for (uint256 i = 0; i < userNames.length; i++) {
            User memory user = User(userNames[i], org);
            users[org].push(user);
        }
    }

    function getOrgUsers(
        string calldata org,
        uint256 start,
        uint256 stop
    ) external view returns (User[] memory res) {
        require(stop >= start, "range error");
        res = new User[](stop - start);
        User[] storage org_users = users[org];
        for (uint256 i = 0; i < stop - start; i++) {
            res[i] = org_users[start + i];
        }

    }

    function getOrgLength(string calldata org) external view returns (uint256) {
        return users[org].length;
    }
}
