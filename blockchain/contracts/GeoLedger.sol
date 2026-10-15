// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GeoLedger {

    struct Property {
        string propertyId;
        address owner;
        uint256 registeredAt;
        bool exists;
    }

    mapping(string => Property) private properties;
    address public registrar;

    constructor() {
        registrar = msg.sender;
    }

    event PropertyRegistered(
        string indexed propertyId,
        address indexed owner,
        uint256 timestamp
    );

    event OwnershipTransferred(
        string indexed propertyId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );

    function registerProperty(
        string calldata propertyId,
        address owner
    ) external {

        require(
            bytes(propertyId).length > 0,
            "Property ID required"
        );

        require(
            owner != address(0),
            "Invalid owner address"
        );

        require(
            !properties[propertyId].exists,
            "Property already registered"
        );

        properties[propertyId] = Property({
            propertyId: propertyId,
            owner: owner,
            registeredAt: block.timestamp,
            exists: true
        });

        emit PropertyRegistered(
            propertyId,
            owner,
            block.timestamp
        );
    }

    function transferOwnership(
        string calldata propertyId,
        address newOwner
    ) external {

        require(
            properties[propertyId].exists,
            "Property does not exist"
        );

        require(
            msg.sender == properties[propertyId].owner || msg.sender == registrar,
            "Only current owner or authorized registrar can transfer ownership"
        );

        require(
            newOwner != address(0),
            "Invalid new owner"
        );

        address previousOwner =
            properties[propertyId].owner;

        properties[propertyId].owner = newOwner;

        emit OwnershipTransferred(
            propertyId,
            previousOwner,
            newOwner,
            block.timestamp
        );
    }

    function getProperty(
        string calldata propertyId
    )
        external
        view
        returns (
            string memory,
            address,
            uint256,
            bool
        )
    {
        Property memory property =
            properties[propertyId];

        return (
            property.propertyId,
            property.owner,
            property.registeredAt,
            property.exists
        );
    }
}