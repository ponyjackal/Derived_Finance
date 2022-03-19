/*
DerivedFi-backed stablecoin contract.

This contract issues synths, which are tokens that mirror various
flavours of fiat currency.

Synths are issuable by Derived Finance Network Token (DVDX) holders who
have to lock up some value of their DVDXto issue S * Cmax synths.
Where Cmax issome value less than 1.

A configurable fee is charged on synth transfers and deposited
into a common pot, which DVDX holders may withdraw from once
per fee period.
*/

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ExternStateToken.sol";
import "./IFeePool.sol";
import "./DVDX.sol";

contract Synth is ExternStateToken {

    /* ========== STATE VARIABLES ========== */

    IFeePool public feePool;
    DVDX public dvdx;

    // Currency key which identifies this Synth to the DVDX system
    bytes4 public currencyKey;

    uint8 constant DECIMALS = 18;

    /* ========== CONSTRUCTOR ========== */

    constructor(address _proxy, TokenState _tokenState, DVDX _dvdx, IFeePool _feePool,
        string memory _tokenName, string memory _tokenSymbol, address _owner, bytes4 _currencyKey
    )
        ExternStateToken(_proxy, _tokenState, _tokenName, _tokenSymbol, 0, DECIMALS, _owner)
    {
        require(_proxy != address(0), "_proxy cannot be 0");
        require(address(_dvdx) != address(0), "_dvdx cannot be 0");
        require(address(_feePool) != address(0), "_feePool cannot be 0");
        require(_owner != address(0), "_owner cannot be 0");
        require(_dvdx.synths(_currencyKey) == Synth(address(0)), "Currency key is already in use");

        feePool = _feePool;
        dvdx = _dvdx;
        currencyKey = _currencyKey;
    }

    /* ========== SETTERS ========== */

    function setDVDX(DVDX _dvdx)
        external
        optionalProxy_onlyOwner
    {
        dvdx = _dvdx;
        emitDVDXUpdated(address(_dvdx));
    }

    function setFeePool(IFeePool _feePool)
        external
        optionalProxy_onlyOwner
    {
        feePool = _feePool;
        emitFeePoolUpdated(address(_feePool));
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
     * @notice Override ERC20 transfer function in order to
     * subtract the transaction fee and send it to the fee pool
     * for DVDXholders to claim. */
    function transfer(address to, uint value)
        public
        optionalProxy
        notFeeAddress(messageSender)
        returns (bool)
    {
        uint amountReceived = feePool.amountReceivedFromTransfer(value);
        uint fee = value - amountReceived;

        // Send the fee off to the fee pool.
        dvdx.synthInitiatedFeePayment(messageSender, currencyKey, fee);

        // And send their result off to the destination address
        bytes memory empty;
        return _internalTransfer(messageSender, to, amountReceived, empty);
    }

    /**
     * @notice Override ERC223 transfer function in order to
     * subtract the transaction fee and send it to the fee pool
     * for DVDXholders to claim. */
    function transfer(address to, uint value, bytes memory data)
        public
        optionalProxy
        notFeeAddress(messageSender)
        returns (bool)
    {
        uint amountReceived = feePool.amountReceivedFromTransfer(value);
        uint fee = value - amountReceived;

        // Send the fee off to the fee pool, which we don't want to charge an additional fee on
        dvdx.synthInitiatedFeePayment(messageSender, currencyKey, fee);

        // And send their result off to the destination address
        return _internalTransfer(messageSender, to, amountReceived, data);
    }

    /**
     * @notice Override ERC20 transferFrom function in order to
     * subtract the transaction fee and send it to the fee pool
     * for DVDXholders to claim. */
    function transferFrom(address from, address to, uint value)
        public
        optionalProxy
        notFeeAddress(from)
        returns (bool)
    {
        // The fee is deducted from the amount sent.
        uint amountReceived = feePool.amountReceivedFromTransfer(value);
        uint fee = value - amountReceived;

        // Reduce the allowance by the amount we're transferring.
        // The safeSub call will handle an insufficient allowance.
        tokenState.setAllowance(from, messageSender, tokenState.allowance(from, messageSender) - value);

        // Send the fee off to the fee pool.
        dvdx.synthInitiatedFeePayment(from, currencyKey, fee);

        bytes memory empty;
        return _internalTransfer(from, to, amountReceived, empty);
    }

    /**
     * @notice Override ERC223 transferFrom function in order to
     * subtract the transaction fee and send it to the fee pool
     * for DVDXholders to claim. */
    function transferFrom(address from, address to, uint value, bytes memory data)
        public
        optionalProxy
        notFeeAddress(from)
        returns (bool)
    {
        // The fee is deducted from the amount sent.
        uint amountReceived = feePool.amountReceivedFromTransfer(value);
        uint fee = value - amountReceived;

        // Reduce the allowance by the amount we're transferring.
        // The safeSub call will handle an insufficient allowance.
        tokenState.setAllowance(from, messageSender, tokenState.allowance(from, messageSender) - value);

        // Send the fee off to the fee pool, which we don't want to charge an additional fee on
        dvdx.synthInitiatedFeePayment(from, currencyKey, fee);

        return _internalTransfer(from, to, amountReceived, data);
    }

    /* Subtract the transfer fee from the senders account so the
     * receiver gets the exact amount specified to send. */
    function transferSenderPaysFee(address to, uint value)
        public
        optionalProxy
        notFeeAddress(messageSender)
        returns (bool)
    {
        uint fee = feePool.transferFeeIncurred(value);

        // Send the fee off to the fee pool, which we don't want to charge an additional fee on
        dvdx.synthInitiatedFeePayment(messageSender, currencyKey, fee);

        // And send their transfer amount off to the destination address
        bytes memory empty;
        return _internalTransfer(messageSender, to, value, empty);
    }

    /* Subtract the transfer fee from the senders account so the
     * receiver gets the exact amount specified to send. */
    function transferSenderPaysFee(address to, uint value, bytes memory data)
        public
        optionalProxy
        notFeeAddress(messageSender)
        returns (bool)
    {
        uint fee = feePool.transferFeeIncurred(value);

        // Send the fee off to the fee pool, which we don't want to charge an additional fee on
        dvdx.synthInitiatedFeePayment(messageSender, currencyKey, fee);

        // And send their transfer amount off to the destination address
        return _internalTransfer(messageSender, to, value, data);
    }

    /* Subtract the transfer fee from the senders account so the
     * to address receives the exact amount specified to send. */
    function transferFromSenderPaysFee(address from, address to, uint value)
        public
        optionalProxy
        notFeeAddress(from)
        returns (bool)
    {
        uint fee = feePool.transferFeeIncurred(value);

        // Reduce the allowance by the amount we're transferring.
        // The safeSub call will handle an insufficient allowance.
        tokenState.setAllowance(from, messageSender, tokenState.allowance(from, messageSender) - value + fee);

        // Send the fee off to the fee pool, which we don't want to charge an additional fee on
        dvdx.synthInitiatedFeePayment(from, currencyKey, fee);

        bytes memory empty;
        return _internalTransfer(from, to, value, empty);
    }

    /* Subtract the transfer fee from the senders account so the
     * to address receives the exact amount specified to send. */
    function transferFromSenderPaysFee(address from, address to, uint value, bytes memory data)
        public
        optionalProxy
        notFeeAddress(from)
        returns (bool)
    {
        uint fee = feePool.transferFeeIncurred(value);

        // Reduce the allowance by the amount we're transferring.
        // The safeSub call will handle an insufficient allowance.
        tokenState.setAllowance(from, messageSender, tokenState.allowance(from, messageSender) - value + fee);

        // Send the fee off to the fee pool, which we don't want to charge an additional fee on
        dvdx.synthInitiatedFeePayment(from, currencyKey, fee);

        return _internalTransfer(from, to, value, data);
    }

    // Override our internal transfer to inject preferred currency support
    function _internalTransfer(address from, address to, uint value, bytes memory data)
        internal
        override
        returns (bool)
    {
        bytes4 preferredCurrencyKey = dvdx.dvdxState().preferredCurrency(to);

        // Do they have a preferred currency that's not us? If so we need to exchange
        if (preferredCurrencyKey != 0 && preferredCurrencyKey != currencyKey) {
            return dvdx.synthInitiatedExchange(from, currencyKey, value, preferredCurrencyKey, to);
        } else {
            // Otherwise we just transfer
            return super._internalTransfer(from, to, value, data);
        }
    }

    // Allow dvdx to issue a certain number of synths from an account.
    function issue(address account, uint amount)
        external
        onlyDVDXOrFeePool
    {
        tokenState.setBalanceOf(account, tokenState.balanceOf(account) + amount);
        totalSupply = totalSupply + amount;
        emitTransfer(address(0), account, amount);
        emitIssued(account, amount);
    }

    // Allow dvdx or another synth contract to burn a certain number of synths from an account.
    function burn(address account, uint amount)
        external
        onlyDVDXOrFeePool
    {
        tokenState.setBalanceOf(account, tokenState.balanceOf(account) - amount);
        totalSupply = totalSupply - amount;
        emitTransfer(account, address(0), amount);
        emitBurned(account, amount);
    }

    // Allow owner to set the total supply on import.
    function setTotalSupply(uint amount)
        external
        optionalProxy_onlyOwner
    {
        totalSupply = amount;
    }

    // Allow dvdx to trigger a token fallback call from our synths so users get notified on
    // exchange as well as transfer
    function triggerTokenFallbackIfNeeded(address sender, address recipient, uint amount)
        external
        onlyDVDXOrFeePool
    {
        bytes memory empty;
        callTokenFallbackIfNeeded(sender, recipient, amount, empty);
    }

    /* ========== MODIFIERS ========== */

    modifier onlyDVDXOrFeePool() {
        bool isDVDX = msg.sender == address(dvdx);
        bool isFeePool = msg.sender == address(feePool);

        require(isDVDX || isFeePool, "Only the DVDX or FeePool contracts can perform this action");
        _;
    }

    modifier notFeeAddress(address account) {
        require(account != feePool.FEE_ADDRESS(), "Cannot perform this action with the fee address");
        _;
    }

    /* ========== EVENTS ========== */

    event DVDXUpdated(address newDVDX);
    bytes32 constant DVDXUPDATED_SIG = keccak256("DVDXUpdated(address)");
    function emitDVDXUpdated(address newDVDX) internal {
        proxy._emit(abi.encode(newDVDX), 1, DVDXUPDATED_SIG, 0, 0, 0);
    }

    event FeePoolUpdated(address newFeePool);
    bytes32 constant FEEPOOLUPDATED_SIG = keccak256("FeePoolUpdated(address)");
    function emitFeePoolUpdated(address newFeePool) internal {
        proxy._emit(abi.encode(newFeePool), 1, FEEPOOLUPDATED_SIG, 0, 0, 0);
    }

    event Issued(address indexed account, uint value);
    bytes32 constant ISSUED_SIG = keccak256("Issued(address,uint256)");
    function emitIssued(address account, uint value) internal {
        proxy._emit(abi.encode(value), 2, ISSUED_SIG, addressToBytes32(account), 0, 0);
    }

    event Burned(address indexed account, uint value);
    bytes32 constant BURNED_SIG = keccak256("Burned(address,uint256)");
    function emitBurned(address account, uint value) internal {
        proxy._emit(abi.encode(value), 2, BURNED_SIG, addressToBytes32(account), 0, 0);
    }
}