pragma solidity ^0.8.4;

import "../interfaces/ISynth.sol";

interface IIssuer {
    // Views
    function anySynthOrDVDXRateIsInvalid()
        external
        view
        returns (bool anyRateInvalid);

    function availableCurrencyKeys() external view returns (bytes32[] memory);

    function availableSynthCount() external view returns (uint256);

    function availableSynths(uint256 index) external view returns (ISynth);

    function canBurnSynths(address account) external view returns (bool);

    function collateral(address account) external view returns (uint256);

    function collateralisationRatio(address issuer)
        external
        view
        returns (uint256);

    function collateralisationRatioAndAnyRatesInvalid(address _issuer)
        external
        view
        returns (uint256 cratio, bool anyRateIsInvalid);

    function debtBalanceOf(address issuer, bytes32 currencyKey)
        external
        view
        returns (uint256 debtBalance);

    function issuanceRatio() external view returns (uint256);

    function lastIssueEvent(address account) external view returns (uint256);

    function maxIssuableSynths(address issuer)
        external
        view
        returns (uint256 maxIssuable);

    function minimumStakeTime() external view returns (uint256);

    function remainingIssuableSynths(address issuer)
        external
        view
        returns (
            uint256 maxIssuable,
            uint256 alreadyIssued,
            uint256 totalSystemDebt
        );

    function synths(bytes32 currencyKey) external view returns (ISynth);

    function getSynths(bytes32[] calldata currencyKeys)
        external
        view
        returns (ISynth[] memory);

    function synthsByAddress(address synthAddress)
        external
        view
        returns (bytes32);

    function totalIssuedSynths(bytes32 currencyKey, bool excludeEtherCollateral)
        external
        view
        returns (uint256);

    function transferableDerivedAndAnyRateIsInvalid(
        address account,
        uint256 balance
    ) external view returns (uint256 transferable, bool anyRateIsInvalid);

    // Restricted: used internally to Derived
    function issueSynths(address from, uint256 amount) external;

    function issueSynthsOnBehalf(
        address issueFor,
        address from,
        uint256 amount
    ) external;

    function issueMaxSynths(address from) external;

    function issueMaxSynthsOnBehalf(address issueFor, address from) external;

    function burnSynths(address from, uint256 amount) external;

    function burnSynthsOnBehalf(
        address burnForAddress,
        address from,
        uint256 amount
    ) external;

    function burnSynthsToTarget(address from) external;

    function burnSynthsToTargetOnBehalf(address burnForAddress, address from)
        external;

    function liquidateDelinquentAccount(
        address account,
        uint256 USDxAmount,
        address liquidator
    ) external returns (uint256 totalRedeemed, uint256 amountToLiquidate);
}
