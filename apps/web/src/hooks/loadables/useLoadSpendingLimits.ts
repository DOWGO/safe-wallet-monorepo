import { useEffect } from 'react'
import useAsync, { type AsyncResult } from '@safe-global/utils/hooks/useAsync'
import useSafeInfo from '../useSafeInfo'
import { Errors, logError } from '@/services/exceptions'
import type { SpendingLimitState } from '@/store/spendingLimitsSlice'
import useChainId from '@/hooks/useChainId'
import { useWeb3ReadOnly } from '@/hooks/wallets/web3'
import type { JsonRpcProvider } from 'ethers'
import { getSpendingLimitContract } from '@/services/contracts/spendingLimitContracts'
import type { TokenInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { type AddressInfo } from '@safe-global/store/gateway/AUTO_GENERATED/safes'
import { type AllowanceModule } from '@safe-global/utils/types/contracts'
import { getERC20TokenInfoOnChain } from '@/utils/tokens'

import { sameString } from '@safe-global/protocol-kit/dist/src/utils'
import { useAppSelector } from '@/store'
import { selectTokens } from '@/store/balancesSlice'
import isEqual from 'lodash/isEqual'
import { multicall } from '@safe-global/utils/utils/multicall'
import { sameAddress } from '@safe-global/utils/utils/addresses'

const DEFAULT_TOKEN_INFO = {
  decimals: 18,
  symbol: '',
}

const discardZeroAllowance = (spendingLimit: SpendingLimitState): boolean =>
  !(sameString(spendingLimit.amount, '0') && sameString(spendingLimit.resetTimeMin, '0'))

const getTokenInfoFromBalances = (tokenInfoFromBalances: TokenInfo[], address: string): TokenInfo | undefined =>
  tokenInfoFromBalances.find((token) => token.address === address)

export const getTokenAllowances = async (
  contract: AllowanceModule,
  provider: JsonRpcProvider,
  safeAddress: string,
  allowanceRequests: { delegate: string; token: string }[],
  tokenInfoFromBalances: TokenInfo[],
): Promise<SpendingLimitState[]> => {
  const moduleAddress = await contract.getAddress()
  const calls = allowanceRequests.map(({ delegate, token }) => ({
    to: moduleAddress,
    data: contract.interface.encodeFunctionData('getTokenAllowance', [safeAddress, delegate, token]),
  }))
  const results = await multicall(provider, calls)

  const tokenAllowances = results.map(
    (result) => contract.interface.decodeFunctionResult('getTokenAllowance', result.returnData)[0],
  )

  const missingTokenAddresses = tokenAllowances
    .map((_, index) => allowanceRequests[index].token)
    .filter((tokenAddress) => !getTokenInfoFromBalances(tokenInfoFromBalances, tokenAddress))

  const missingTokenInfos = await getERC20TokenInfoOnChain(missingTokenAddresses)

  return tokenAllowances.map((tokenAllowance, index) => {
    const { delegate, token } = allowanceRequests[index]
    const [amount, spent, resetTimeMin, lastResetMin, nonce] = tokenAllowance
    return {
      beneficiary: delegate,
      token: getTokenInfoFromBalances(tokenInfoFromBalances, token) ||
        missingTokenInfos?.find((tokenInfo) => sameAddress(tokenInfo.address, token)) || {
          ...DEFAULT_TOKEN_INFO,
          address: token,
        },
      amount: amount.toString(),
      spent: spent.toString(),
      resetTimeMin: resetTimeMin.toString(),
      lastResetMin: lastResetMin.toString(),
      nonce: nonce.toString(),
    }
  })
}

export const getTokensForDelegates = async (
  contract: AllowanceModule,
  provider: JsonRpcProvider,
  safeAddress: string,
  delegates: string[],
  tokenInfoFromBalances: TokenInfo[],
) => {
  const allowanceAddress = await contract.getAddress()
  const calls = delegates.map((delegate) => ({
    to: allowanceAddress,
    data: contract.interface.encodeFunctionData('getTokens', [safeAddress, delegate]),
  }))

  const results = await multicall(provider, calls)
  const tokens = results.map(
    (result) => contract.interface.decodeFunctionResult('getTokens', result.returnData)[0] as string[],
  )

  const spendingLimitRequests = delegates.flatMap((delegate, idx) => {
    const tokensForDelegate = tokens[idx]
    return tokensForDelegate.map((token) => ({
      delegate,
      token,
    }))
  })

  return getTokenAllowances(contract, provider, safeAddress, spendingLimitRequests, tokenInfoFromBalances)
}

export const getSpendingLimits = async (
  provider: JsonRpcProvider,
  safeModules: AddressInfo[],
  safeAddress: string,
  chainId: string,
  tokenInfoFromBalances: TokenInfo[],
): Promise<SpendingLimitState[] | undefined> => {
  let contract: ReturnType<typeof getSpendingLimitContract>
  try {
    contract = getSpendingLimitContract(chainId, safeModules, provider)
  } catch {
    return
  }
  const delegates = await contract.getDelegates(safeAddress, 0, 100)

  const spendingLimits = await getTokensForDelegates(
    contract,
    provider,
    safeAddress,
    delegates.results,
    tokenInfoFromBalances,
  )

  return spendingLimits.flat().filter(discardZeroAllowance)
}

export const useLoadSpendingLimits = (): AsyncResult<SpendingLimitState[]> => {
  const { safeAddress, safe, safeLoaded } = useSafeInfo()
  const chainId = useChainId()
  const provider = useWeb3ReadOnly()
  const tokenInfoFromBalances = useAppSelector(selectTokens, isEqual)

  const [data, error, loading] = useAsync<SpendingLimitState[] | undefined>(
    () => {
      if (!provider || !safeLoaded || !safe.modules || tokenInfoFromBalances.length === 0) return

      return getSpendingLimits(provider, safe.modules, safeAddress, chainId, tokenInfoFromBalances)
    },
    // Need to check length of modules array to prevent new request every time Safe info polls
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [provider, safeLoaded, safe.modules?.length, tokenInfoFromBalances, safeAddress, chainId, safe.txHistoryTag],
    false,
  )

  useEffect(() => {
    if (error) {
      logError(Errors._609, error.message)
    }
  }, [error])

  return [data, error, loading]
}

export default useLoadSpendingLimits
