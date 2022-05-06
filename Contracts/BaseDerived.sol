pragma solidity ^0.8.4;

// Inheritance
import "./interfaces/IERC20.sol";
import "./ExternStateToken.sol";
import "./MixinResolver.sol";
import "./interfaces/IDerived.sol";

// Internal references
import "./interfaces/ISynth.sol";
import "./TokenState.sol";
import "./interfaces/IDerivedState.sol";
import "./interfaces/ISystemStatus.sol";
import "./interfaces/IExchanger.sol";
import "./interfaces/IIssuer.sol";
import "./interfaces/IRewardsDistribution.sol";
import "./interfaces/IVirtualSynth.sol";

contract BaseDerived is ExternStateToken, MixinResolver, IDerived {
    // ========== STATE VARIABLES ==========

    // Available Synths which can be used with the system
    string internal constant TOKEN_NAME = "Derived Network Token";
    string internal constant TOKEN_SYMBOL = "DVDX";
    uint8 internal constant DECIMAL = 18;
    bytes32 internal constant USDx = "USDx";

    // ========== ADDRESS RESOLVER CONFIGURATION ==========
    bytes32 private constant CONTRACT_DerivedSTATE = "DerivedState";
    bytes32 private constant CONTRACT_SYSTEMSTATUS = "SystemStatus";
    bytes32 private constant CONTRACT_EXCHANGER = "Exchanger";
    bytes32 private constant CONTRACT_ISSUER = "Issuer";
    bytes32 private constant CONTRACT_REWARDSDISTRIBUTION = "RewardsDistribution";

    // ========== CONSTRUCTOR ==========

    constructor(
        address payable _proxy,
        TokenState _tokenState,
        address _owner,
        uint _totalSupply,
        address _resolver
    )
        ExternStateToken(_proxy, _tokenState, TOKEN_NAME, TOKEN_SYMBOL, _totalSupply, DECIMAL, _owner)
        MixinResolver(_resolver)
    {}

    // ========== VIEWS ==========

    // Note: use public visibility so that it can be invoked in a subclass
    function resolverAddressesRequired() public virtual override view returns (bytes32[] memory addresses) {
        addresses = new bytes32[](5);
        addresses[0] = CONTRACT_DerivedSTATE;
        addresses[1] = CONTRACT_SYSTEMSTATUS;
        addresses[2] = CONTRACT_EXCHANGER;
        addresses[3] = CONTRACT_ISSUER;
        addresses[4] = CONTRACT_REWARDSDISTRIBUTION;
    }

    function DerivedState() internal view returns (IDerivedState) {
        return IDerivedState(requireAndGetAddress(CONTRACT_DerivedSTATE));
    }

    function systemStatus() internal view returns (ISystemStatus) {
        return ISystemStatus(requireAndGetAddress(CONTRACT_SYSTEMSTATUS));
    }

    function exchanger() internal view returns (IExchanger) {
        return IExchanger(requireAndGetAddress(CONTRACT_EXCHANGER));
    }

    function issuer() internal view returns (IIssuer) {
        return IIssuer(requireAndGetAddress(CONTRACT_ISSUER));
    }

    function rewardsDistribution() internal view returns (IRewardsDistribution) {
        return IRewardsDistribution(requireAndGetAddress(CONTRACT_REWARDSDISTRIBUTION));
    }

    function debtBalanceOf(address account, bytes32 currencyKey) external override view returns (uint) {
        return issuer().debtBalanceOf(account, currencyKey);
    }

    function totalIssuedSynths(bytes32 currencyKey) external override view returns (uint) {
        return issuer().totalIssuedSynths(currencyKey, false);
    }

    function availableCurrencyKeys() external override view returns (bytes32[] memory) {
        return issuer().availableCurrencyKeys();
    }

    function availableSynthCount() external override view returns (uint) {
        return issuer().availableSynthCount();
    }

    function availableSynths(uint index) external override view returns (ISynth) {
        return issuer().availableSynths(index);
    }

    function synths(bytes32 currencyKey) external override view returns (ISynth) {
        return issuer().synths(currencyKey);
    }

    function synthsByAddress(address synthAddress) external override view returns (bytes32) {
        return issuer().synthsByAddress(synthAddress);
    }

    function isWaitingPeriod(bytes32 currencyKey) external override view returns (bool) {
        return exchanger().maxSecsLeftInWaitingPeriod(messageSender, currencyKey) > 0;
    }

    function anySynthOrDVDXRateIsInvalid() external override view returns (bool anyRateInvalid) {
        return issuer().anySynthOrDVDXRateIsInvalid();
    }

    function maxIssuableSynths(address account) external override view returns (uint maxIssuable) {
        return issuer().maxIssuableSynths(account);
    }

    function remainingIssuableSynths(address account)
        external
        override 
        view
        returns (
            uint maxIssuable,
            uint alreadyIssued,
            uint totalSystemDebt
        )
    {
        return issuer().remainingIssuableSynths(account);
    }

    function collateralisationRatio(address _issuer) external override view returns (uint) {
        return issuer().collateralisationRatio(_issuer);
    }

    function collateral(address account) external override view returns (uint) {
        return issuer().collateral(account);
    }

    function transferableDerived(address account) external override view returns (uint transferable) {
        (transferable, ) = issuer().transferableDerivedAndAnyRateIsInvalid(account, tokenState.balanceOf(account));
    }

    function _canTransfer(address account, uint value) internal view returns (bool) {
        (uint initialDebtOwnership, ) = DerivedState().issuanceData(account);

        if (initialDebtOwnership > 0) {
            (uint transferable, bool anyRateIsInvalid) =
                issuer().transferableDerivedAndAnyRateIsInvalid(account, tokenState.balanceOf(account));
            require(value <= transferable, "Cannot transfer staked or escrowed DVDX");
            require(!anyRateIsInvalid, "A synth or DVDX rate is invalid");
        }
        return true;
    }

    // ========== MUTATIVE FUNCTIONS ==========

    function settle(bytes32 currencyKey)
        external
        virtual 
        override 
        optionalProxy
        returns (
            uint reclaimed,
            uint refunded,
            uint numEntriesSettled
        )
    {
        return exchanger().settle(messageSender, currencyKey);
    }

    function transfer(address to, uint value) external optionalProxy systemActive returns (bool) {
        // Ensure they're not trying to exceed their locked amount -- only if they have debt.
        _canTransfer(messageSender, value);

        // Perform the transfer: if there is a problem an exception will be thrown in this call.
        _transferByProxy(messageSender, to, value);

        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint value
    ) external optionalProxy systemActive returns (bool) {
        // Ensure they're not trying to exceed their locked amount -- only if they have debt.
        _canTransfer(from, value);

        // Perform the transfer: if there is a problem,
        // an exception will be thrown in this call.
        return _transferFromByProxy(messageSender, from, to, value);
    }

    function issueSynths(uint amount) external override issuanceActive optionalProxy {
        return issuer().issueSynths(messageSender, amount);
    }

    function issueMaxSynths() external override issuanceActive optionalProxy {
        return issuer().issueMaxSynths(messageSender);
    }

    function burnSynths(uint amount) external override issuanceActive optionalProxy {
        return issuer().burnSynths(messageSender, amount);
    }

    function burnSynthsToTarget() external override issuanceActive optionalProxy {
        return issuer().burnSynthsToTarget(messageSender);
    }
    
    // ========== MODIFIERS ==========

    modifier systemActive() {
        _systemActive();
        _;
    }

    function _systemActive() private {
        systemStatus().requireSystemActive();
    }

    modifier issuanceActive() {
        _issuanceActive();
        _;
    }

    function _issuanceActive() private {
        systemStatus().requireIssuanceActive();
    }

    modifier exchangeActive(bytes32 src, bytes32 dest) {
        _exchangeActive(src, dest);
        _;
    }

    function _exchangeActive(bytes32 src, bytes32 dest) private {
        systemStatus().requireExchangeBetweenSynthsAllowed(src, dest);
    }

    modifier onlyExchanger() {
        _onlyExchanger();
        _;
    }

    function _onlyExchanger() private {
        require(msg.sender == address(exchanger()), "Only Exchanger can invoke this");
    }

    // ========== EVENTS ==========
    event SynthExchange(
        address indexed account,
        bytes32 fromCurrencyKey,
        uint256 fromAmount,
        bytes32 toCurrencyKey,
        uint256 toAmount,
        address toAddress
    );
    bytes32 internal constant SYNTHEXCHANGE_SIG =
        keccak256("SynthExchange(address,bytes32,uint256,bytes32,uint256,address)");

    function emitSynthExchange(
        address account,
        bytes32 fromCurrencyKey,
        uint256 fromAmount,
        bytes32 toCurrencyKey,
        uint256 toAmount,
        address toAddress
    ) external onlyExchanger {
        proxy._emit(
            abi.encode(fromCurrencyKey, fromAmount, toCurrencyKey, toAmount, toAddress),
            2,
            SYNTHEXCHANGE_SIG,
            addressToBytes32(account),
            0,
            0
        );
    }

    event ExchangeTracking(bytes32 indexed trackingCode, bytes32 toCurrencyKey, uint256 toAmount);
    bytes32 internal constant EXCHANGE_TRACKING_SIG = keccak256("ExchangeTracking(bytes32,bytes32,uint256)");

    function emitExchangeTracking(
        bytes32 trackingCode,
        bytes32 toCurrencyKey,
        uint256 toAmount
    ) external onlyExchanger {
        proxy._emit(abi.encode(toCurrencyKey, toAmount), 2, EXCHANGE_TRACKING_SIG, trackingCode, 0, 0);
    }

    event ExchangeReclaim(address indexed account, bytes32 currencyKey, uint amount);
    bytes32 internal constant EXCHANGERECLAIM_SIG = keccak256("ExchangeReclaim(address,bytes32,uint256)");

    function emitExchangeReclaim(
        address account,
        bytes32 currencyKey,
        uint256 amount
    ) external onlyExchanger {
        proxy._emit(abi.encode(currencyKey, amount), 2, EXCHANGERECLAIM_SIG, addressToBytes32(account), 0, 0);
    }

    event ExchangeRebate(address indexed account, bytes32 currencyKey, uint amount);
    bytes32 internal constant EXCHANGEREBATE_SIG = keccak256("ExchangeRebate(address,bytes32,uint256)");

    function emitExchangeRebate(
        address account,
        bytes32 currencyKey,
        uint256 amount
    ) external onlyExchanger {
        proxy._emit(abi.encode(currencyKey, amount), 2, EXCHANGEREBATE_SIG, addressToBytes32(account), 0, 0);
    }
}
