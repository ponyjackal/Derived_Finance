/*
Derived Finance token contract. DVDX is a transferable ERC20 token,
and also give its holders the following privileges.
An owner of DVDX has the right to issue synths in all synth flavours.

After a fee period terminates, the duration and fees collected for that
period are computed, and the next period begins. Thus an account may only
withdraw the fees owed to them for the previous period, and may only do
so once per period. Any unclaimed fees roll over into the common pot for
the next period.

== Average Balance Calculations ==

The fee entitlement of a DVDX holder is proportional to their average
issued synth balance over the last fee period. This is computed by
measuring the area under the graph of a user's issued synth balance over
time, and then when a new fee period begins, dividing through by the
duration of the fee period.

We need only update values when the balances of an account is modified.
This occurs when issuing or burning for issued synth balances,
and when transferring for DVDX balances. This is for efficiency,
and adds an implicit friction to interacting with DVDX.
A DVDX holder pays for his own recomputation whenever he wants to change
his position, which saves the foundation having to maintain a pot dedicated
to resourcing this.

A hypothetical user's balance history over one fee period, pictorially:

      s ____
       |    |
       |    |___ p
       |____|___|___ __ _  _
       f    t   n

Here, the balance was s between times f and t, at which time a transfer
occurred, updating the balance to p, until n, when the present transfer occurs.
When a new transfer occurs at time n, the balance being p,
we must:

  - Add the area p * (n - t) to the total area recorded so far
  - Update the last transfer time to n

So if this graph represents the entire current fee period,
the average DVDX held so far is ((t-f)*s + (n-t)*p) / (n-f).
The complementary computations must be performed for both sender and
recipient.

Note that a transfer keeps global supply of DVDX invariant.
The sum of all balances is constant, and unmodified by any transfer.
So the sum of all balances multiplied by the duration of a fee period is also
constant, and this is equivalent to the sum of the area of every user's
time/balance graph. Dividing through by that duration yields back the total
DVDX supply. So, at the end of a fee period, we really do yield a user's
average share in the DVDX supply over that period.

A slight wrinkle is introduced if we consider the time r when the fee period
rolls over. Then the previous fee period k-1 is before r, and the current fee
period k is afterwards. If the last transfer took place before r,
but the latest transfer occurred afterwards:

k-1       |        k
      s __|_
       |  | |
       |  | |____ p
       |__|_|____|___ __ _  _
          |
       f  | t    n
          r

In this situation the area (r-f)*s contributes to fee period k-1, while
the area (t-r)*s contributes to fee period k. We will implicitly consider a
zero-value transfer to have occurred at time r. Their fee entitlement for the
previous period will be finalised at the time of their first transfer during the
current fee period, or when they query or withdraw their fee entitlement.

In the implementation, the duration of different fee periods may be slightly irregular,
as the check that they have rolled over occurs only when state-changing DVDX
operations are performed.

== Issuance and Burning ==

In this version of the DVDX contract, synths can only be issued by
those that have been nominated by the DVDX foundation. Synths are assumed
to be valued at $1, as they are a stable unit of account.

All synths issued require a proportional value of DVDX to be locked,
where the proportion is governed by the current issuance ratio. This
means for every $1 of DVDX locked up, $(issuanceRatio) synths can be issued.
i.e. to issue 100 synths, 100/issuanceRatio dollars of DVDX need to be locked up.

To determine the value of some amount of DVDX(S), an oracle is used to push
the price of DVDX(P_S) in dollars to the contract. The value of S
would then be: S * P_S.

Any DVDX that are locked up by this issuance process cannot be transferred.
The amount that is locked floats based on the price of DVDX. If the price
of DVDX moves up, less DVDX are locked, so they can be issued against,
or transferred freely. If the price of DVDX moves down, more DVDX are locked,
even going above the initial wallet balance.

-----------------------------------------------------------------
*/

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


import "./ExternStateToken.sol";
import "./TokenState.sol";
import "./SupplySchedule.sol";
import "./ExchangeRates.sol";
import "./DVDXState.sol";
import "./Synth.sol";
import "./IDVDXEscrow.sol";
import "./IFeePool.sol";

/**
 * @title DVDX ERC20 contract.
 * @notice The DVDX contracts not only facilitates transfers, exchanges, and tracks balances,
 * but it also computes the quantity of fees each DVDX holder is entitled to.
 */
contract DVDX is ExternStateToken {
    using SafeDecimalMath for uint;
    // ========== STATE VARIABLES ==========

    // Available Synths which can be used with the system
    Synth[] public availableSynths;
    mapping(bytes4 => Synth) public synths;

    IFeePool public feePool;
    IDVDXEscrow public escrow;
    IDVDXEscrow public rewardEscrow;
    ExchangeRates public exchangeRates;
    DVDXState public dvdxState;
    SupplySchedule public supplySchedule;

    string constant TOKEN_NAME = "Derived Finance Token";
    string constant TOKEN_SYMBOL = "DVDX";
    uint8 constant DECIMALS = 18;
    // ========== CONSTRUCTOR ==========

    /**
     * @dev Constructor
     * @param _tokenState A pre-populated contract containing token balances.
     * If the provided address is 0x0, then a fresh one will be constructed with the contract owning all tokens.
     * @param _owner The owner of this contract.
     */
    constructor(address _proxy, TokenState _tokenState, DVDXState _dvdxState,
        address _owner, ExchangeRates _exchangeRates, IFeePool _feePool, SupplySchedule _supplySchedule,
        IDVDXEscrow _rewardEscrow, IDVDXEscrow _escrow, uint _totalSupply
    )
        ExternStateToken(_proxy, _tokenState, TOKEN_NAME, TOKEN_SYMBOL, _totalSupply, DECIMALS, _owner)
    {
        dvdxState = _dvdxState;
        exchangeRates = _exchangeRates;
        feePool = _feePool;
        supplySchedule = _supplySchedule;
        rewardEscrow = _rewardEscrow;
        escrow = _escrow;
    }
    // ========== SETTERS ========== */

    function setFeePool(IFeePool _feePool)
        external
        optionalProxy_onlyOwner
    {
        feePool = _feePool;
    }

    function setExchangeRates(ExchangeRates _exchangeRates)
        external
        optionalProxy_onlyOwner
    {
        exchangeRates = _exchangeRates;
    }

    /**
     * @notice Add an associated Synth contract to the DVDX system
     * @dev Only the contract owner may call this.
     */
    function addSynth(Synth synth)
        external
        optionalProxy_onlyOwner
    {
        bytes4 currencyKey = synth.currencyKey();

        require(synths[currencyKey] == Synth(address(0)), "Synth already exists");

        availableSynths.push(synth);
        synths[currencyKey] = synth;
    }

    /**
     * @notice Remove an associated Synth contract from the DVDX system
     * @dev Only the contract owner may call this.
     */
    function removeSynth(bytes4 currencyKey)
        external
        optionalProxy_onlyOwner
    {
        require(address(synths[currencyKey]) != address(0), "Synth does not exist");
        require(synths[currencyKey].totalSupply() == 0, "Synth supply exists");
        require(currencyKey != "XDR", "Cannot remove XDR synth");

        // Save the address we're removing for emitting the event at the end.
        address synthToRemove = address(synths[currencyKey]);

        // Remove the synth from the availableSynths array.
        for (uint8 i = 0; i < availableSynths.length; i++) {
            if (address(availableSynths[i]) == synthToRemove) {
                delete availableSynths[i];

                // Copy the last synth into the place of the one we just deleted
                // If there's only one synth, this is synths[0] = synths[0].
                // If we're deleting the last one, it's also a NOOP in the same way.
                availableSynths[i] = availableSynths[availableSynths.length - 1];

                // Decrease the size of the array by one.
                availableSynths.pop();

                break;
            }
        }

        // And remove it from the synths mapping
        delete synths[currencyKey];

        // Note: No event here as our contract exceeds max contract size
        // with these events, and it's unlikely people will need to
        // track these events specifically.
    }

    // ========== VIEWS ==========

    /**
     * @notice A function that lets you easily convert an amount in a source currency to an amount in the destination currency
     * @param sourceCurrencyKey The currency the amount is specified in
     * @param sourceAmount The source amount, specified in UNIT base
     * @param destinationCurrencyKey The destination currency
     */
    function effectiveValue(bytes4 sourceCurrencyKey, uint sourceAmount, bytes4 destinationCurrencyKey)
        public
        view
        rateNotStale(sourceCurrencyKey)
        rateNotStale(destinationCurrencyKey)
        returns (uint)
    {
        // If there's no change in the currency, then just return the amount they gave us
        if (sourceCurrencyKey == destinationCurrencyKey) return sourceAmount;

        // Calculate the effective value by going from source -> USD -> destination
        return sourceAmount.multiplyDecimalRound(exchangeRates.rateForCurrency(sourceCurrencyKey))
            .divideDecimalRound(exchangeRates.rateForCurrency(destinationCurrencyKey));
    }

    /**
     * @notice Total amount of synths issued by the system, priced in currencyKey
     * @param currencyKey The currency to value the synths in
     */
    function totalIssuedSynths(bytes4 currencyKey)
        public
        view
        rateNotStale(currencyKey)
        returns (uint)
    {
        uint total = 0;
        uint currencyRate = exchangeRates.rateForCurrency(currencyKey);

        require(!exchangeRates.anyRateIsStale(availableCurrencyKeys()), "Rates are stale");

        for (uint8 i = 0; i < availableSynths.length; i++) {
            // What's the total issued value of that synth in the destination currency?
            // Note: We're not using our effectiveValue function because we don't want to go get the
            //       rate for the destination currency and check if it's stale repeatedly on every
            //       iteration of the loop
            uint synthValue = availableSynths[i].totalSupply()
                .multiplyDecimalRound(exchangeRates.rateForCurrency(availableSynths[i].currencyKey()))
                .divideDecimalRound(currencyRate);
            total = total + synthValue;
        }

        return total;
    }

    /**
     * @notice Returns the currencyKeys of availableSynths for rate checking
     */
    function availableCurrencyKeys()
        internal
        view
        returns (bytes4[] memory)
    {
        bytes4[] memory availableCurrencyKeys = new bytes4[](availableSynths.length);

        for (uint8 i = 0; i < availableSynths.length; i++) {
            availableCurrencyKeys[i] = availableSynths[i].currencyKey();
        }

        return availableCurrencyKeys;
    }

    /**
     * @notice Returns the count of available synths in the system, which you can use to iterate availableSynths
     */
    function availableSynthCount()
        public
        view
        returns (uint)
    {
        return availableSynths.length;
    }

    // ========== MUTATIVE FUNCTIONS ==========

    /**
     * @notice ERC20 transfer function.
     */
    function transfer(address to, uint value)
        public
        returns (bool)
    {
        bytes memory empty;
        return transfer(to, value, empty);
    }

    /**
     * @notice ERC223 transfer function. Does not conform with the ERC223 spec, as:
     *         - Transaction doesn't revert if the recipient doesn't implement tokenFallback()
     *         - Emits a standard ERC20 event without the bytes data parameter so as not to confuse
     *           tooling such as Etherscan.
     */
    function transfer(address to, uint value, bytes memory data)
        public
        optionalProxy
        returns (bool)
    {
        // Ensure they're not trying to exceed their locked amount
        require(value <= transferableDVDX(messageSender), "Insufficient balance");

        // Perform the transfer: if there is a problem an exception will be thrown in this call.
        _transfer_byProxy(messageSender, to, value, data);

        return true;
    }

    /**
     * @notice ERC20 transferFrom function.
     */
    function transferFrom(address from, address to, uint value)
        public
        returns (bool)
    {
        bytes memory empty;
        return transferFrom(from, to, value, empty);
    }

    /**
     * @notice ERC223 transferFrom function. Does not conform with the ERC223 spec, as:
     *         - Transaction doesn't revert if the recipient doesn't implement tokenFallback()
     *         - Emits a standard ERC20 event without the bytes data parameter so as not to confuse
     *           tooling such as Etherscan.
     */
    function transferFrom(address from, address to, uint value, bytes memory data)
        public
        optionalProxy
        returns (bool)
    {
        // Ensure they're not trying to exceed their locked amount
        require(value <= transferableDVDX(from), "Insufficient balance");

        // Perform the transfer: if there is a problem,
        // an exception will be thrown in this call.
        _transferFrom_byProxy(messageSender, from, to, value, data);

        return true;
    }

    /**
     * @notice Function that allows you to exchange synths you hold in one flavour for another.
     * @param sourceCurrencyKey The source currency you wish to exchange from
     * @param sourceAmount The amount, specified in UNIT of source currency you wish to exchange
     * @param destinationCurrencyKey The destination currency you wish to obtain.
     * @param destinationAddress Where the result should go. If this is address(0) then it sends back to the message sender.
     * @return Boolean that indicates whether the transfer succeeded or failed.
     */
    function exchange(bytes4 sourceCurrencyKey, uint sourceAmount, bytes4 destinationCurrencyKey, address destinationAddress)
        external
        optionalProxy
        // Note: We don't need to insist on non-stale rates because effectiveValue will do it for us.
        returns (bool)
    {
        require(sourceCurrencyKey != destinationCurrencyKey, "Exchange must use different synths");
        require(sourceAmount > 0, "Zero amount");

        // Pass it along, defaulting to the sender as the recipient.
        return _internalExchange(
            messageSender,
            sourceCurrencyKey,
            sourceAmount,
            destinationCurrencyKey,
            destinationAddress == address(0) ? messageSender : destinationAddress,
            true // Charge fee on the exchange
        );
    }

    /**
     * @notice Function that allows synth contract to delegate exchanging of a synth that is not the same sourceCurrency
     * @dev Only the synth contract can call this function
     * @param from The address to exchange / burn synth from
     * @param sourceCurrencyKey The source currency you wish to exchange from
     * @param sourceAmount The amount, specified in UNIT of source currency you wish to exchange
     * @param destinationCurrencyKey The destination currency you wish to obtain.
     * @param destinationAddress Where the result should go.
     * @return Boolean that indicates whether the transfer succeeded or failed.
     */
    function synthInitiatedExchange(
        address from,
        bytes4 sourceCurrencyKey,
        uint sourceAmount,
        bytes4 destinationCurrencyKey,
        address destinationAddress
    )
        external
        onlySynth
        returns (bool)
    {
        require(sourceCurrencyKey != destinationCurrencyKey, "Can't be same synth");
        require(sourceAmount > 0, "Zero amount");

        // Pass it along
        return _internalExchange(
            from,
            sourceCurrencyKey,
            sourceAmount,
            destinationCurrencyKey,
            destinationAddress,
            false // Don't charge fee on the exchange, as they've already been charged a transfer fee in the synth contract
        );
    }

    /**
     * @notice Function that allows synth contract to delegate sending fee to the fee Pool.
     * @dev Only the synth contract can call this function.
     * @param from The address fee is coming from.
     * @param sourceCurrencyKey source currency fee from.
     * @param sourceAmount The amount, specified in UNIT of source currency.
     * @return Boolean that indicates whether the transfer succeeded or failed.
     */
    function synthInitiatedFeePayment(
        address from,
        bytes4 sourceCurrencyKey,
        uint sourceAmount
    )
        external
        onlySynth
        returns (bool)
    {
        // Allow fee to be 0 and skip minting XDRs to feePool
        if (sourceAmount == 0) {
            return true;
        }

        require(sourceAmount > 0, "Source can't be 0");

        // Pass it along, defaulting to the sender as the recipient.
        bool result = _internalExchange(
            from,
            sourceCurrencyKey,
            sourceAmount,
            "XDR",
            feePool.FEE_ADDRESS(),
            false // Don't charge a fee on the exchange because this is already a fee
        );

        // Tell the fee pool about this.
        feePool.feePaid(sourceCurrencyKey, sourceAmount);

        return result;
    }

    /**
     * @notice Function that allows synth contract to delegate sending fee to the fee Pool.
     * @dev fee pool contract address is not allowed to call function
     * @param from The address to move synth from
     * @param sourceCurrencyKey source currency from.
     * @param sourceAmount The amount, specified in UNIT of source currency.
     * @param destinationCurrencyKey The destination currency to obtain.
     * @param destinationAddress Where the result should go.
     * @param chargeFee Boolean to charge a fee for transaction.
     * @return Boolean that indicates whether the transfer succeeded or failed.
     */
    function _internalExchange(
        address from,
        bytes4 sourceCurrencyKey,
        uint sourceAmount,
        bytes4 destinationCurrencyKey,
        address destinationAddress,
        bool chargeFee
    )
        internal
        notFeeAddress(from)
        returns (bool)
    {
        require(destinationAddress != address(0), "Zero destination");
        require(destinationAddress != address(this), "DVDX is invalid destination");
        require(destinationAddress != address(proxy), "Proxy is invalid destination");
        require(address(synths[sourceCurrencyKey]) != address(0), "Source Synth does not exist");
        require(address(synths[destinationCurrencyKey]) != address(0), "Destination Synth does not exist");

        // Note: We don't need to check their balance as the burn() below will do a safe subtraction which requires
        // the subtraction to not overflow, which would happen if their balance is not sufficient.

        // Burn the source amount
        synths[sourceCurrencyKey].burn(from, sourceAmount);

        // How much should they get in the destination currency?
        uint destinationAmount = effectiveValue(sourceCurrencyKey, sourceAmount, destinationCurrencyKey);

        // What's the fee on that currency that we should deduct?
        uint amountReceived = destinationAmount;
        uint fee = 0;

        if (chargeFee) {
            amountReceived = feePool.amountReceivedFromExchange(destinationAmount);
            fee = destinationAmount - amountReceived;
        }

        // Issue their new synths
        synths[destinationCurrencyKey].issue(destinationAddress, amountReceived);

        // Remit the fee in XDRs
        if (fee > 0) {
            uint xdrFeeAmount = effectiveValue(destinationCurrencyKey, fee, "XDR");
            synths["XDR"].issue(feePool.FEE_ADDRESS(), xdrFeeAmount);
            // Tell the fee pool about this.
            feePool.feePaid("XDR", xdrFeeAmount);
        }

        // Nothing changes as far as issuance data goes because the total value in the system hasn't changed.

        // Call the ERC223 transfer callback if needed
        synths[destinationCurrencyKey].triggerTokenFallbackIfNeeded(from, destinationAddress, amountReceived);

        //Let the DApps know there was a Synth exchange
        emitSynthExchange(from, sourceCurrencyKey, sourceAmount, destinationCurrencyKey, amountReceived, destinationAddress);

        return true;
    }

    /**
     * @notice Function that registers new synth as they are isseud. Calculate delta to append to dvdxState.
     * @dev Only internal calls from dvdx address.
     * @param currencyKey The currency to register synths in, for example USDx or sAUD
     * @param amount The amount of synths to register with a base of UNIT
     */
    function _addToDebtRegister(bytes4 currencyKey, uint amount)
        internal
        optionalProxy
    {
        // What is the value of the requested debt in XDRs?
        uint xdrValue = effectiveValue(currencyKey, amount, "XDR");

        // What is the value of all issued synths of the system (priced in XDRs)?
        uint totalDebtIssued = totalIssuedSynths("XDR");

        // What will the new total be including the new value?
        uint newTotalDebtIssued = xdrValue + totalDebtIssued;

        // What is their percentage (as a high precision int) of the total debt?
        uint debtPercentage = xdrValue.divideDecimalRoundPrecise(newTotalDebtIssued);

        // And what effect does this percentage change have on the global debt holding of other issuers?
        // The delta specifically needs to not take into account any existing debt as it's already
        // accounted for in the delta from when they issued previously.
        // The delta is a high precision integer.
        uint delta = SafeDecimalMath.preciseUnit() - debtPercentage;

        // How much existing debt do they have?
        uint existingDebt = debtBalanceOf(messageSender, "XDR");

        // And what does their debt ownership look like including this previous stake?
        if (existingDebt > 0) {
            debtPercentage = (xdrValue + existingDebt).divideDecimalRoundPrecise(newTotalDebtIssued);
        }

        // Are they a new issuer? If so, record them.
        if (!dvdxState.hasIssued(messageSender)) {
            dvdxState.incrementTotalIssuerCount();
        }

        // Save the debt entry parameters
        dvdxState.setCurrentIssuanceData(messageSender, debtPercentage);

        // And if we're the first, push 1 as there was no effect to any other holders, otherwise push
        // the change for the rest of the debt holders. The debt ledger holds high precision integers.
        if (dvdxState.debtLedgerLength() > 0) {
            dvdxState.appendDebtLedgerValue(
                dvdxState.lastDebtLedgerEntry().multiplyDecimalRoundPrecise(delta)
            );
        } else {
            dvdxState.appendDebtLedgerValue(SafeDecimalMath.preciseUnit());
        }
    }

    /**
     * @notice Issue synths against the sender's DVDX.
     * @dev Issuance is only allowed if the dvdx price isn't stale. Amount should be larger than 0.
     * @param currencyKey The currency you wish to issue synths in, for example USDx or sAUD
     * @param amount The amount of synths you wish to issue with a base of UNIT
     */
    function issueSynths(bytes4 currencyKey, uint amount)
        public
        optionalProxy
        // No need to check if price is stale, as it is checked in issuableSynths.
    {
        require(amount <= remainingIssuableSynths(messageSender, currencyKey), "Amount too large");
        require(address(synths[currencyKey]) != address(0), "Synth does not exist");

        // Keep track of the debt they're about to create
        _addToDebtRegister(currencyKey, amount);

        // Create their synths
        synths[currencyKey].issue(messageSender, amount);

        // Store their locked DVDX amount to determine their fee % for the period
        _appendAccountIssuanceRecord();
    }

    /**
     * @notice Issue the maximum amount of Synths possible against the sender's DVDX.
     * @dev Issuance is only allowed if the dvdx price isn't stale.
     * @param currencyKey The currency you wish to issue synths in, for example USDx or sAUD
     */
    function issueMaxSynths(bytes4 currencyKey)
        external
        optionalProxy
    {
        // Figure out the maximum we can issue in that currency
        uint maxIssuable = remainingIssuableSynths(messageSender, currencyKey);

        // And issue them
        issueSynths(currencyKey, maxIssuable);
    }

    /**
     * @notice Burn synths to clear issued synths/free DVDX.
     * @param currencyKey The currency you're specifying to burn
     * @param amount The amount (in UNIT base) you wish to burn
     * @dev The amount to burn is debased to XDR's
     */
    function burnSynths(bytes4 currencyKey, uint amount)
        external
        optionalProxy
        // No need to check for stale rates as effectiveValue checks rates
    {
        require(address(synths[currencyKey]) != address(0), "Synth does not exist");
        // How much debt do they have?
        uint debtToRemove = effectiveValue(currencyKey, amount, "XDR");
        uint debt = debtBalanceOf(messageSender, "XDR");
        uint debtInCurrencyKey = debtBalanceOf(messageSender, currencyKey);

        require(debt > 0, "No debt to forgive");

        // If they're trying to burn more debt than they actually owe, rather than fail the transaction, let's just
        // clear their debt and leave them be.
        uint amountToRemove = debt < debtToRemove ? debt : debtToRemove;

        // Remove their debt from the ledger
        _removeFromDebtRegister(amountToRemove);

        uint amountToBurn = debtInCurrencyKey < amount ? debtInCurrencyKey : amount;

        // synth.burn does a safe subtraction on balance (so it will revert if there are not enough synths).
        synths[currencyKey].burn(messageSender, amountToBurn);

        // Store their debtRatio against a feeperiod to determine their fee/rewards % for the period
        _appendAccountIssuanceRecord();
    }

    /**
     * @notice Store in the FeePool the users current debt value in the system in XDRs.
     * @dev debtBalanceOf(messageSender, "XDR") to be used with totalIssuedSynths("XDR") to get
     *  users % of the system within a feePeriod.
     */
    function _appendAccountIssuanceRecord()
        internal
    {
        uint initialDebtOwnership;
        uint debtEntryIndex;
        (initialDebtOwnership, debtEntryIndex) = dvdxState.issuanceData(messageSender);

        feePool.appendAccountIssuanceRecord(
            messageSender,
            initialDebtOwnership,
            debtEntryIndex
        );
    }

    /**
     * @notice Remove a debt position from the register
     * @param amount The amount (in UNIT base) being presented in XDRs
     */
    function _removeFromDebtRegister(uint amount)
        internal
    {
        uint debtToRemove = amount;

        // How much debt do they have?
        uint existingDebt = debtBalanceOf(messageSender, "XDR");

        // What is the value of all issued synths of the system (priced in XDRs)?
        uint totalDebtIssued = totalIssuedSynths("XDR");

        // What will the new total after taking out the withdrawn amount
        uint newTotalDebtIssued = totalDebtIssued - debtToRemove;

        uint delta;

        // What will the debt delta be if there is any debt left?
        // Set delta to 0 if no more debt left in system after user
        if (newTotalDebtIssued > 0) {

            // What is the percentage of the withdrawn debt (as a high precision int) of the total debt after?
            uint debtPercentage = debtToRemove.divideDecimalRoundPrecise(newTotalDebtIssued);

            // And what effect does this percentage change have on the global debt holding of other issuers?
            // The delta specifically needs to not take into account any existing debt as it's already
            // accounted for in the delta from when they issued previously.
            delta = SafeDecimalMath.preciseUnit() + debtPercentage;
        } else {
            delta = 0;
        }

        // Are they exiting the system, or are they just decreasing their debt position?
        if (debtToRemove == existingDebt) {
            dvdxState.setCurrentIssuanceData(messageSender, 0);
            dvdxState.decrementTotalIssuerCount();
        } else {
            // What percentage of the debt will they be left with?
            uint newDebt = existingDebt - debtToRemove;
            uint newDebtPercentage = newDebt.divideDecimalRoundPrecise(newTotalDebtIssued);

            // Store the debt percentage and debt ledger as high precision integers
            dvdxState.setCurrentIssuanceData(messageSender, newDebtPercentage);
        }

        // Update our cumulative ledger. This is also a high precision integer.
        dvdxState.appendDebtLedgerValue(
            dvdxState.lastDebtLedgerEntry().multiplyDecimalRoundPrecise(delta)
        );
    }

    // ========== Issuance/Burning ==========

    /**
     * @notice The maximum synths an issuer can issue against their total dvdx quantity, priced in XDRs.
     * This ignores any already issued synths, and is purely giving you the maximimum amount the user can issue.
     */
    function maxIssuableSynths(address issuer, bytes4 currencyKey)
        public
        view
        // We don't need to check stale rates here as effectiveValue will do it for us.
        returns (uint)
    {
        // What is the value of their DVDX balance in the destination currency?
        uint destinationValue = effectiveValue("DVDX", collateral(issuer), currencyKey);

        // They're allowed to issue up to issuanceRatio of that value
        return destinationValue.multiplyDecimal(dvdxState.issuanceRatio());
    }

    /**
     * @notice The current collateralisation ratio for a user. Collateralisation ratio varies over time
     * as the value of the underlying DVDX asset changes, e.g. if a user issues their maximum available
     * synths when they hold $10 worth of DVDX, they will have issued $2 worth of synths. If the value
     * of DVDX changes, the ratio returned by this function will adjust accordlingly. Users are
     * incentivised to maintain a collateralisation ratio as close to the issuance ratio as possible by
     * altering the amount of fees they're able to claim from the system.
     */
    function collateralisationRatio(address issuer)
        public
        view
        returns (uint)
    {
        uint totalOwnedDVDX = collateral(issuer);
        if (totalOwnedDVDX == 0) return 0;

        uint debtBalance = debtBalanceOf(issuer, "DVDX");
        return debtBalance.divideDecimalRound(totalOwnedDVDX);
    }

    /**
     * @notice If a user issues synths backed by DVDX in their wallet, the DVDX become locked. This function
     * will tell you how many synths a user has to give back to the system in order to unlock their original
     * debt position. This is priced in whichever synth is passed in as a currency key, e.g. you can price
     * the debt in USDx, XDR, or any other synth you wish.
     */
    function debtBalanceOf(address issuer, bytes4 currencyKey)
        public
        view
        // Don't need to check for stale rates here because totalIssuedSynths will do it for us
        returns (uint)
    {
        // What was their initial debt ownership?
        uint initialDebtOwnership;
        uint debtEntryIndex;
        (initialDebtOwnership, debtEntryIndex) = dvdxState.issuanceData(issuer);

        // If it's zero, they haven't issued, and they have no debt.
        if (initialDebtOwnership == 0) return 0;

        // Figure out the global debt percentage delta from when they entered the system.
        // This is a high precision integer.
        uint currentDebtOwnership = dvdxState.lastDebtLedgerEntry()
            .divideDecimalRoundPrecise(dvdxState.debtLedger(debtEntryIndex))
            .multiplyDecimalRoundPrecise(initialDebtOwnership);

        // What's the total value of the system in their requested currency?
        uint totalSystemValue = totalIssuedSynths(currencyKey);

        // Their debt balance is their portion of the total system value.
        uint highPrecisionBalance = totalSystemValue.decimalToPreciseDecimal()
            .multiplyDecimalRoundPrecise(currentDebtOwnership);

        return highPrecisionBalance.preciseDecimalToDecimal();
    }

    /**
     * @notice The remaining synths an issuer can issue against their total dvdx balance.
     * @param issuer The account that intends to issue
     * @param currencyKey The currency to price issuable value in
     */
    function remainingIssuableSynths(address issuer, bytes4 currencyKey)
        public
        view
        // Don't need to check for synth existing or stale rates because maxIssuableSynths will do it for us.
        returns (uint)
    {
        uint alreadyIssued = debtBalanceOf(issuer, currencyKey);
        uint max = maxIssuableSynths(issuer, currencyKey);

        if (alreadyIssued >= max) {
            return 0;
        } else {
            return max - alreadyIssued;
        }
    }

    /**
     * @notice The total DVDX owned by this account, both escrowed and unescrowed,
     * against which synths can be issued.
     * This includes those already being used as collateral (locked), and those
     * available for further issuance (unlocked).
     */
    function collateral(address account)
        public
        view
        returns (uint)
    {
        uint balance = tokenState.balanceOf(account);

        if (address(escrow) != address(0)) {
            balance = balance + escrow.balanceOf(account);
        }

        if (address(rewardEscrow) != address(0)) {
            balance = balance + rewardEscrow.balanceOf(account);
        }

        return balance;
    }

    /**
     * @notice The number of DVDX that are free to be transferred by an account.
     * @dev When issuing, escrowed DVDX are locked first, then non-escrowed
     * DVDX are locked last, but escrowed DVDX are not transferable, so they are not included
     * in this calculation.
     */
    function transferableDVDX(address account)
        public
        view
        rateNotStale("DVDX")
        returns (uint)
    {
        // How many DVDX do they have, excluding escrow?
        // Note: We're excluding escrow here because we're interested in their transferable amount
        // and escrowed DVDX are not transferable.
        uint balance = tokenState.balanceOf(account);

        // How many of those will be locked by the amount they've issued?
        // Assuming issuance ratio is 20%, then issuing 20 DVDX of value would require
        // 100 DVDX to be locked in their wallet to maintain their collateralisation ratio
        // The locked dvdx value can exceed their balance.
        uint lockedDVDXValue = debtBalanceOf(account, "DVDX").divideDecimalRound(dvdxState.issuanceRatio());

        // If we exceed the balance, no DVDX are transferable, otherwise the difference is.
        if (lockedDVDXValue >= balance) {
            return 0;
        } else {
            return balance - lockedDVDXValue;
        }
    }

    function mint()
        external
        returns (bool)
    {
        require(address(rewardEscrow) != address(0), "Reward Escrow destination missing");

        uint supplyToMint = supplySchedule.mintableSupply();
        require(supplyToMint > 0, "No supply is mintable");

        supplySchedule.updateMintValues();

        // Set minted DVDX balance to RewardEscrow's balance
        // Minus the minterReward and set balance of minter to add reward
        uint minterReward = supplySchedule.minterReward();

        tokenState.setBalanceOf(address(rewardEscrow), tokenState.balanceOf(address(rewardEscrow)) + supplyToMint - minterReward);
        emitTransfer(address(this), address(rewardEscrow), supplyToMint - minterReward);

        // Tell the FeePool how much it has to distribute
        feePool.rewardsMinted(supplyToMint - minterReward);

        // Assign the minters reward.
        tokenState.setBalanceOf(msg.sender, tokenState.balanceOf(msg.sender) + minterReward);
        emitTransfer(address(this), msg.sender, minterReward);

        totalSupply = totalSupply + supplyToMint;
    }

    // ========== MODIFIERS ==========

    modifier rateNotStale(bytes4 currencyKey) {
        require(!exchangeRates.rateIsStale(currencyKey), "Rate stale or nonexistant currency");
        _;
    }

    modifier notFeeAddress(address account) {
        require(account != feePool.FEE_ADDRESS(), "Fee address not allowed");
        _;
    }

    modifier onlySynth() {
        bool isSynth = false;

        // No need to repeatedly call this function either
        for (uint8 i = 0; i < availableSynths.length; i++) {
            if (address(availableSynths[i]) == msg.sender) {
                isSynth = true;
                break;
            }
        }

        require(isSynth, "Only synth allowed");
        _;
    }

    modifier nonZeroAmount(uint _amount) {
        require(_amount > 0, "Amount needs to be larger than 0");
        _;
    }

    // ========== EVENTS ==========
    /* solium-disable */
    event SynthExchange(address indexed account, bytes4 fromCurrencyKey, uint256 fromAmount, bytes4 toCurrencyKey,  uint256 toAmount, address toAddress);
    bytes32 constant SYNTHEXCHANGE_SIG = keccak256("SynthExchange(address,bytes4,uint256,bytes4,uint256,address)");
    function emitSynthExchange(address account, bytes4 fromCurrencyKey, uint256 fromAmount, bytes4 toCurrencyKey, uint256 toAmount, address toAddress) internal {
        proxy._emit(abi.encode(fromCurrencyKey, fromAmount, toCurrencyKey, toAmount, toAddress), 2, SYNTHEXCHANGE_SIG, addressToBytes32(account), 0, 0);
    }
    /* solium-enable */
}