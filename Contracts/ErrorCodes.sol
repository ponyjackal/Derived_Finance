//Error Codes Reference - SystemSettings.sol
//1 = Out of range xDomain gasLimit
//2 = New issuance ratio cannot exceed MAX_ISSUANCE_RATIO
//3 = value < MIN_FEE_PERIOD_DURATION
//4 = value > MAX_FEE_PERIOD_DURATION
//5 = Threshold too high
//6 = Must be less than 30 days
//7 = Must be greater than 1 day
//8 = liquidationRatio > MAX_LIQUIDATION_RATIO / (1 + penalty)
//9 = liquidationRatio < MIN_LIQUIDATION_RATIO
//10 = penalty > MAX_LIQUIDATION_PENALTY
//11 = Array lengths dont match
//12 = MAX_EXCHANGE_FEE_RATE exceeded
//13 = stake time exceed maximum 1 week
//14 = Valid address must be given
//15 = rate > MAX_ETHER_WRAPPER_MINT_FEE_RATE
//16 = rate > MAX_ETHER_WRAPPER_BURN_FEE_RATE

//Error Codes Reference - ExchangeRates.sol
//17 = lowerLimit must be above 0
//18 = upperLimit must be above the entryPoint
//19 = upperLimit must be less than double entryPoint
//20 = lowerLimit must be below the entryPoint
//21 = Cannot freeze at both limits
//22 = No inverted price exists
//23 = Only the oracle can perform this action
//24 = Negative rate not supported
//25 = Zero is not a valid rate, please call deleteRate instead.
//26 = Rate of USDx cannot be updated, it's always UNIT.