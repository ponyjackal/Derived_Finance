pragma solidity ^0.8.4;

interface ISynth {
    // Views
    function currencyKey() external view returns (bytes32);

    function transferableSynths(address account)
        external
        view
        returns (uint256);

    // Mutative functions
    function transferAndSettle(address to, uint256 value)
        external
        returns (bool);

    function transferFromAndSettle(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    // Restricted: used internally to Derived
    function burn(address account, uint256 amount) external;

    function issue(address account, uint256 amount) external;
}
