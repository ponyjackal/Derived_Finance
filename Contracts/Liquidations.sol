pragma solidity ^0.8.4;

// Inheritance
import "./Owned.sol";
import "./MixinResolver.sol";
import "./MixinSystemSettings.sol";
import "./interfaces/ILiquidations.sol";

// Libraries
import "./SafeDecimalMath.sol";

// Internal references
import "./EternalStorage.sol";
import "./interfaces/IDerived.sol";
import "./interfaces/IExchangeRates.sol";
import "./interfaces/IIssuer.sol";
import "./interfaces/ISystemStatus.sol";

contract Liquidations is Owned, MixinSystemSettings, ILiquidations {
    using SafeMath for uint256;
    using SafeDecimalMath for uint256;

    struct LiquidationEntry {
        uint256 deadline;
        address caller;
    }

    /* ========== ADDRESS RESOLVER CONFIGURATION ========== */

    bytes32 private constant CONTRACT_SYSTEMSTATUS = "SystemStatus";
    bytes32 private constant CONTRACT_Derived = "Derived";
    bytes32 private constant CONTRACT_ETERNALSTORAGE_LIQUIDATIONS =
        "EternalStorageLiquidations";
    bytes32 private constant CONTRACT_ISSUER = "Issuer";
    bytes32 private constant CONTRACT_EXRATES = "ExchangeRates";

    /* ========== CONSTANTS ========== */

    // Storage keys
    bytes32 public constant LIQUIDATION_DEADLINE = "LiquidationDeadline";
    bytes32 public constant LIQUIDATION_CALLER = "LiquidationCaller";

    constructor(address _owner, address _resolver)
        public
        Owned(_owner)
        MixinSystemSettings(_resolver)
    {}

    /* ========== VIEWS ========== */
    function resolverAddressesRequired()
        public
        view
        override
        returns (bytes32[] memory addresses)
    {
        bytes32[] memory existingAddresses =
            MixinSystemSettings.resolverAddressesRequired();
        bytes32[] memory newAddresses = new bytes32[](5);
        newAddresses[0] = CONTRACT_SYSTEMSTATUS;
        newAddresses[1] = CONTRACT_Derived;
        newAddresses[2] = CONTRACT_ETERNALSTORAGE_LIQUIDATIONS;
        newAddresses[3] = CONTRACT_ISSUER;
        newAddresses[4] = CONTRACT_EXRATES;
        addresses = combineArrays(existingAddresses, newAddresses);
    }

    function Derived() internal view returns (IDerived) {
        return IDerived(requireAndGetAddress(CONTRACT_Derived));
    }

    function systemStatus() internal view returns (ISystemStatus) {
        return ISystemStatus(requireAndGetAddress(CONTRACT_SYSTEMSTATUS));
    }

    function issuer() internal view returns (IIssuer) {
        return IIssuer(requireAndGetAddress(CONTRACT_ISSUER));
    }

    function exchangeRates() internal view returns (IExchangeRates) {
        return IExchangeRates(requireAndGetAddress(CONTRACT_EXRATES));
    }

    // refactor to Derived storage eternal storage contract once that's ready
    function eternalStorageLiquidations()
        internal
        view
        returns (EternalStorage)
    {
        return
            EternalStorage(
                requireAndGetAddress(CONTRACT_ETERNALSTORAGE_LIQUIDATIONS)
            );
    }

    function issuanceRatio() external view returns (uint256) {
        return getIssuanceRatio();
    }

    function liquidationDelay() external view override returns (uint256) {
        return getLiquidationDelay();
    }

    function liquidationRatio() external view override returns (uint256) {
        return getLiquidationRatio();
    }

    function liquidationPenalty() external view override returns (uint256) {
        return getLiquidationPenalty();
    }

    function liquidationCollateralRatio() external view returns (uint256) {
        return SafeDecimalMath.unit().divideDecimalRound(getLiquidationRatio());
    }

    function getLiquidationDeadlineForAccount(address account)
        external
        view
        override
        returns (uint256)
    {
        LiquidationEntry memory liquidation =
            _getLiquidationEntryForAccount(account);
        return liquidation.deadline;
    }

    function isOpenForLiquidation(address account)
        external
        view
        override
        returns (bool)
    {
        uint256 accountCollateralisationRatio =
            Derived().collateralisationRatio(account);

        // Liquidation closed if collateral ratio less than or equal target issuance Ratio
        // Account with no DVDX collateral will also not be open for liquidation (ratio is 0)
        if (accountCollateralisationRatio <= getIssuanceRatio()) {
            return false;
        }

        LiquidationEntry memory liquidation =
            _getLiquidationEntryForAccount(account);

        // liquidation cap at issuanceRatio is checked above
        if (_deadlinePassed(liquidation.deadline)) {
            return true;
        }
        return false;
    }

    function isLiquidationDeadlinePassed(address account)
        external
        view
        override
        returns (bool)
    {
        LiquidationEntry memory liquidation =
            _getLiquidationEntryForAccount(account);
        return _deadlinePassed(liquidation.deadline);
    }

    function _deadlinePassed(uint256 deadline) internal view returns (bool) {
        // check deadline is set > 0
        // check now > deadline
        return deadline > 0 && block.timestamp > deadline;
    }

    /**
     * r = target issuance ratio
     * D = debt balance
     * V = Collateral
     * P = liquidation penalty
     * Calculates amount of synths = (D - V * r) / (1 - (1 + P) * r)
     */
    function calculateAmountToFixCollateral(
        uint256 debtBalance,
        uint256 collateral
    ) external view override returns (uint256) {
        uint256 ratio = getIssuanceRatio();
        uint256 unit = SafeDecimalMath.unit();

        uint256 dividend = debtBalance.sub(collateral.multiplyDecimal(ratio));
        uint256 divisor =
            unit.sub(unit.add(getLiquidationPenalty()).multiplyDecimal(ratio));

        return dividend.divideDecimal(divisor);
    }

    // get liquidationEntry for account
    // returns deadline = 0 when not set
    function _getLiquidationEntryForAccount(address account)
        internal
        view
        returns (LiquidationEntry memory _liquidation)
    {
        _liquidation.deadline = eternalStorageLiquidations().getUIntValue(
            _getKey(LIQUIDATION_DEADLINE, account)
        );

        // liquidation caller not used
        _liquidation.caller = address(0);
    }

    function _getKey(bytes32 _scope, address _account)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_scope, _account));
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    // totalIssuedSynths checks synths for staleness
    // check DVDX rate is not stale
    function flagAccountForLiquidation(address account)
        external
        override
        rateNotInvalid("DVDX")
    {
        systemStatus().requireSystemActive();

        require(getLiquidationRatio() > 0, "Liquidation ratio not set");
        require(getLiquidationDelay() > 0, "Liquidation delay not set");

        LiquidationEntry memory liquidation =
            _getLiquidationEntryForAccount(account);
        require(
            liquidation.deadline == 0,
            "Account already flagged for liquidation"
        );

        uint256 accountsCollateralisationRatio =
            Derived().collateralisationRatio(account);

        // if accounts issuance ratio is greater than or equal to liquidation ratio set liquidation entry
        require(
            accountsCollateralisationRatio >= getLiquidationRatio(),
            "Account issuance ratio is less than liquidation ratio"
        );

        uint256 deadline = block.timestamp.add(getLiquidationDelay());

        _storeLiquidationEntry(account, deadline, msg.sender);

        emit AccountFlaggedForLiquidation(account, deadline);
    }

    // Internal function to remove account from liquidations
    // Does not check collateral ratio is fixed
    function removeAccountInLiquidation(address account)
        external
        override
        onlyIssuer
    {
        LiquidationEntry memory liquidation =
            _getLiquidationEntryForAccount(account);
        if (liquidation.deadline > 0) {
            _removeLiquidationEntry(account);
        }
    }

    // Public function to allow an account to remove from liquidations
    // Checks collateral ratio is fixed - below target issuance ratio
    // Check DVDX rate is not stale
    function checkAndRemoveAccountInLiquidation(address account)
        external
        override
        rateNotInvalid("DVDX")
    {
        systemStatus().requireSystemActive();

        LiquidationEntry memory liquidation =
            _getLiquidationEntryForAccount(account);

        require(liquidation.deadline > 0, "Account has no liquidation set");

        uint256 accountsCollateralisationRatio =
            Derived().collateralisationRatio(account);

        // Remove from liquidations if accountsCollateralisationRatio is fixed (less than equal target issuance ratio)
        if (accountsCollateralisationRatio <= getIssuanceRatio()) {
            _removeLiquidationEntry(account);
        }
    }

    function _storeLiquidationEntry(
        address _account,
        uint256 _deadline,
        address _caller
    ) internal {
        // record liquidation deadline
        eternalStorageLiquidations().setUIntValue(
            _getKey(LIQUIDATION_DEADLINE, _account),
            _deadline
        );
        eternalStorageLiquidations().setAddressValue(
            _getKey(LIQUIDATION_CALLER, _account),
            _caller
        );
    }

    function _removeLiquidationEntry(address _account) internal {
        // delete liquidation deadline
        eternalStorageLiquidations().deleteUIntValue(
            _getKey(LIQUIDATION_DEADLINE, _account)
        );
        // delete liquidation caller
        eternalStorageLiquidations().deleteAddressValue(
            _getKey(LIQUIDATION_CALLER, _account)
        );

        emit AccountRemovedFromLiquidation(_account, block.timestamp);
    }

    /* ========== MODIFIERS ========== */
    modifier onlyIssuer() {
        require(
            msg.sender == address(issuer()),
            "Liquidations: Only the Issuer contract can perform this action"
        );
        _;
    }

    modifier rateNotInvalid(bytes32 currencyKey) {
        require(
            !exchangeRates().rateIsInvalid(currencyKey),
            "Rate invalid or not a synth"
        );
        _;
    }

    /* ========== EVENTS ========== */

    event AccountFlaggedForLiquidation(
        address indexed account,
        uint256 deadline
    );
    event AccountRemovedFromLiquidation(address indexed account, uint256 time);
}
