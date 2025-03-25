import {
  CustomTransactionInfo,
  QueuedItemPage,
  TransactionItemPage,
  SwapOrderTransactionInfo,
  TwapOrderTransactionInfo,
  SwapTransferTransactionInfo,
  ModuleExecutionInfo,
  MultisigExecutionInfo,
  AddressInfo,
  TransferTransactionInfo,
  TransactionDetails,
  NativeStakingDepositTransactionInfo,
  NativeStakingValidatorsExitTransactionInfo,
  NativeStakingWithdrawTransactionInfo,
  ModuleExecutionDetails,
  MultisigExecutionDetails
} from './AUTO_GENERATED/transactions'
import { SafeOverview } from './AUTO_GENERATED/safes'
import { Chain } from './AUTO_GENERATED/chains';
import { MessagePage, TypedData } from './AUTO_GENERATED/messages';

export type ExecutionInfo = ModuleExecutionInfo | MultisigExecutionInfo

// safe messages
export enum SafeMessageListItemType {
  DATE_LABEL = "DATE_LABEL",
  MESSAGE = "MESSAGE"
}
export enum SafeMessageStatus {
  NEEDS_CONFIRMATION = "NEEDS_CONFIRMATION",
  CONFIRMED = "CONFIRMED"
}
export type TypedMessageTypes = TypedData['types']

export type SafeMessageListItem = MessagePage['results'][number]


// notifications
export enum DeviceType {
  ANDROID = "ANDROID",
  IOS = "IOS",
  WEB = "WEB"
}

// Chains
export enum RPC_AUTHENTICATION {
  API_KEY_PATH = "API_KEY_PATH",
  NO_AUTHENTICATION = "NO_AUTHENTICATION",
  UNKNOWN = "UNKNOWN"
}

export enum GAS_PRICE_TYPE {
  ORACLE = "ORACLE",
  FIXED = "FIXED",
  FIXED_1559 = "FIXED1559",
  UNKNOWN = "UNKNOWN"
}

export type GasPrice = Chain['gasPrice']

export enum FEATURES {
  ERC721 = "ERC721",
  SAFE_APPS = "SAFE_APPS",
  CONTRACT_INTERACTION = "CONTRACT_INTERACTION",
  DOMAIN_LOOKUP = "DOMAIN_LOOKUP",
  SPENDING_LIMIT = "SPENDING_LIMIT",
  EIP1559 = "EIP1559",
  SAFE_TX_GAS_OPTIONAL = "SAFE_TX_GAS_OPTIONAL",
  TX_SIMULATION = "TX_SIMULATION",
  EIP1271 = "EIP1271"
}

export type ChainInfo = Omit<Chain, 'features'> & {
  features: FEATURES[]
}

// Safe info
export enum ImplementationVersionState {
  UP_TO_DATE = "UP_TO_DATE",
  OUTDATED = "OUTDATED",
  UNKNOWN = "UNKNOWN"
}

// Safe apps
export enum SafeAppAccessPolicyTypes {
  NoRestrictions = "NO_RESTRICTIONS",
  DomainAllowlist = "DOMAIN_ALLOWLIST"
}

export type SafeAppNoRestrictionsPolicy = {
  type: SafeAppAccessPolicyTypes.NoRestrictions;
};
export type SafeAppDomainAllowlistPolicy = {
  type: SafeAppAccessPolicyTypes.DomainAllowlist;
  value: string[];
};
export type SafeAppsAccessControlPolicies = SafeAppNoRestrictionsPolicy | SafeAppDomainAllowlistPolicy

export enum SafeAppFeatures {
  BATCHED_TRANSACTIONS = "BATCHED_TRANSACTIONS"
}

export enum SafeAppSocialPlatforms {
  TWITTER = "TWITTER",
  GITHUB = "GITHUB",
  DISCORD = "DISCORD",
  TELEGRAM = "TELEGRAM"
}


// Transactions
export enum Operation {
  CALL = 0,
  DELEGATE = 1
}
export enum TransactionStatus {
  AWAITING_CONFIRMATIONS = 'AWAITING_CONFIRMATIONS',
  AWAITING_EXECUTION = 'AWAITING_EXECUTION',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

export enum TransferDirection {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
  UNKNOWN = 'UNKNOWN',
}

export enum TokenType {
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  NATIVE_TOKEN = "NATIVE_TOKEN",
  UNKNOWN = "UNKNOWN"
}

export enum TransactionTokenType {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  NATIVE_COIN = 'NATIVE_COIN',
}

export enum SettingsInfoType {
  SET_FALLBACK_HANDLER = 'SET_FALLBACK_HANDLER',
  ADD_OWNER = 'ADD_OWNER',
  REMOVE_OWNER = 'REMOVE_OWNER',
  SWAP_OWNER = 'SWAP_OWNER',
  CHANGE_THRESHOLD = 'CHANGE_THRESHOLD',
  CHANGE_IMPLEMENTATION = 'CHANGE_IMPLEMENTATION',
  ENABLE_MODULE = 'ENABLE_MODULE',
  DISABLE_MODULE = 'DISABLE_MODULE',
  SET_GUARD = 'SET_GUARD',
  DELETE_GUARD = 'DELETE_GUARD',
}

export enum TransactionInfoType {
  TRANSFER = 'Transfer',
  SETTINGS_CHANGE = 'SettingsChange',
  CUSTOM = 'Custom',
  CREATION = 'Creation',
  SWAP_ORDER = 'SwapOrder',
  TWAP_ORDER = 'TwapOrder',
  SWAP_TRANSFER = 'SwapTransfer',
}

export enum ConflictType {
  NONE = 'None',
  HAS_NEXT = 'HasNext',
  END = 'End',
}

export enum TransactionListItemType {
  TRANSACTION = 'TRANSACTION',
  LABEL = 'LABEL',
  CONFLICT_HEADER = 'CONFLICT_HEADER',
  DATE_LABEL = 'DATE_LABEL',
}

export enum DetailedExecutionInfoType {
  MULTISIG = 'MULTISIG',
  MODULE = 'MODULE',
}

export type TransferInfo = TransferTransactionInfo['transferInfo']
export type StakingTxInfo = NativeStakingDepositTransactionInfo | NativeStakingValidatorsExitTransactionInfo | NativeStakingWithdrawTransactionInfo;
export type TransactionInfo = TransactionDetails['txInfo']

export type DetailedExecutionInfo = ModuleExecutionDetails | MultisigExecutionDetails;


export enum LabelValue {
  Queued = "Queued",
  Next = "Next"
}

export type Cancellation = CustomTransactionInfo & {
  isCancellation: true
}

export type MultiSend = CustomTransactionInfo & {
  value: string
  methodName: 'multiSend'
  actionCount: number
  isCancellation: boolean
  humanDescription?: string
}
export type SafeOverviewResult = { data: SafeOverview[]; error: unknown; isLoading: boolean }

export type OrderTransactionInfo = SwapOrderTransactionInfo | TwapOrderTransactionInfo | SwapTransferTransactionInfo

export enum StartTimeValue {
  AT_MINING_TIME = "AT_MINING_TIME",
  AT_EPOCH = "AT_EPOCH"
}

export type PendingTransactionItems = QueuedItemPage['results'][number]
export type HistoryTransactionItems = TransactionItemPage['results'][number]

// TODO: fix CGW DataDecodedParameter type. The decodedValue is typed only as an object or object[] there.
export type ActionValueDecoded = {
  data: string
  dataDecoded: {
    method: string
    parameters: {
      name: string
      type: string
      value: string
    }[]
  }
  operation: number
  to: string
  value: string
}

export type AddressInfoIndex = Record<string, AddressInfo>

export type { BalancesGetSupportedFiatCodesV1ApiResponse as FiatCurrencies } from './AUTO_GENERATED/balances'
