const { VAULT_CATEGORIES_IDS, POOL_TYPES } = require('../../data/constants')

const poolType = `^(${Object.values(POOL_TYPES).join('|')})$`
const vaultsCategory = `^(${Object.values(VAULT_CATEGORIES_IDS).join('|')})$`

const vaultsPattern = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          chain: {
            type: 'number',
            minimum: 0,
            maximum: 1000,
          },
          category: {
            anyOf: [
              {
                type: 'string',
                pattern: vaultsCategory,
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                  pattern: vaultsCategory,
                },
              },
            ],
          },
          displayName: {
            type: 'string',
          },
          apyIconUrls: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          apyTokenSymbols: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          logoUrl: {
            type: 'string',
          },
          tokenAddress: {
            anyOf: [
              {
                type: 'string',
                pattern: '^0x[a-fA-F0-9]{40}$',
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                  pattern: '^0x[a-fA-F0-9]{40}$',
                },
              },
            ],
          },
          decimals: {
            type: 'number',
            minimum: 0,
            maximum: 100,
          },
          vaultAddress: {
            type: 'string',
            pattern: '^0x[a-fA-F0-9]{40}$',
          },
          id: {
            type: 'string',
          },
          pricePerFullShare: {
            type: 'number',
            minimum: 0,
          },
          estimatedApy: {
            type: 'number',
            minimum: 0,
          },
          estimatedApyBreakdown: {
            type: 'array',
            items: {
              type: 'number',
              minimum: 0,
            },
          },
          boostedEstimatedAPY: {
            type: ['number', 'null'],
          },
          underlyingBalanceWithInvestment: {
            type: 'number',
            minimum: 0,
          },
          usdPrice: {
            type: 'number',
            minimum: 0,
          },
          totalSupply: {
            type: 'number',
            minimum: 0,
          },
          totalValueLocked: {
            type: 'number',
            minimum: 0,
          },
          uniswapV3PositionId: {
            type: ['number', 'null'],
          },
          uniswapV3UnderlyingTokenPrices: {
            type: 'array',
            items: {
              type: 'number',
              minimum: 0,
            },
          },
          rewardPool: {
            type: ['string', 'null'],
            pattern: '^0x[a-fA-F0-9]{40}$',
          },
          inactive: {
            type: 'boolean',
          },
        },
        required: [
          'chain',
          'id',
          'displayName',
          'totalSupply',
          'totalValueLocked',
          'apyIconUrls',
          'apyTokenSymbols',
          'logoUrl',
          'tokenAddress',
          'decimals',
          'vaultAddress',
          'pricePerFullShare',
          'estimatedApy',
          'estimatedApyBreakdown',
          'boostedEstimatedAPY',
          'underlyingBalanceWithInvestment',
          'usdPrice',
          'uniswapV3PositionId',
          'uniswapV3UnderlyingTokenPrices',
          'rewardPool',
        ],
      },
    },
  },
}

const poolsPattern = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      chain: {
        type: 'number',
        minimum: 0,
        maximum: 1000,
      },
      id: {
        type: 'string',
      },
      type: {
        type: 'string',
        pattern: poolType,
      },
      fullBuyback: {
        type: 'boolean',
      },
      isDegen: {
        type: 'boolean',
      },
      contractAddress: {
        type: 'string',
        pattern: '^0x[a-fA-F0-9]{40}$',
      },
      collateralAddress: {
        type: 'string',
        pattern: '^0x[a-fA-F0-9]{40}$',
      },
      oldPoolContractAddress: {
        type: 'string',
        pattern: '^0x[a-fA-F0-9]{40}$',
      },
      externalPoolURL: {
        type: ['string', 'null'],
      },
      hideNativeApy: {
        type: 'boolean',
      },
      rewardAPY: {
        type: 'array',
        items: {
          type: 'number',
          minimum: 0,
        },
      },
      rewardAPR: {
        type: 'array',
        items: {
          type: 'number',
          minimum: 0,
        },
      },
      rewardTokens: {
        type: 'array',
        items: {
          type: 'string',
          pattern: '^0x[a-fA-F0-9]{40}$',
          minLength: 42,
          maxLength: 42,
        },
      },
      rewardTokenSymbols: {
        type: 'array',
        items: {
          type: 'string',
          maxLength: 50,
        },
      },
      stakeAndDepositHelpMessage: {
        type: 'string',
      },
      lpTokenData: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            pattern: '^0x[a-fA-F0-9]{40}$',
          },
          decimals: {
            type: 'number',
            minimum: 0,
            maximum: 100,
          },
          symbol: {
            type: 'string',
            maxLength: 50,
          },
          price: {
            type: 'number',
            minimum: 0,
          },
        },
        required: ['address', 'decimals', 'symbol', 'price'],
      },
      amountToStakeForBoost: {
        type: ['number', 'null'],
      },
      boostedRewardAPY: {
        type: ['number', 'null'],
      },
      rewardPerToken: {
        type: 'array',
        items: {
          type: 'number',
          minimum: 0,
        },
      },
      totalSupply: {
        type: 'number',
        minimum: 0,
      },
      finishTime: {
        type: 'number',
        minimum: 0,
      },
      totalValueLocked: {
        type: 'number',
        minimum: 0,
      },
      tradingApy: {
        type: ['number', 'null'],
      },
    },
    required: [
      'chain',
      'id',
      'type',
      'contractAddress',
      'collateralAddress',
      'rewardAPY',
      'rewardAPR',
      'rewardTokens',
      'rewardTokenSymbols',
      'lpTokenData',
      'amountToStakeForBoost',
      'boostedRewardAPY',
      'rewardPerToken',
      'totalSupply',
      'finishTime',
      'totalValueLocked',
      'tradingApy',
    ],
  },
}

const POOLS_SCHEMA = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  properties: {
    updatedAt: {
      type: 'object',
      properties: {
        apiData: {
          type: 'string',
          format: 'date-time',
        },
        lastUpdated: {
          type: 'string',
        },
      },
      required: ['apiData', 'lastUpdated'],
    },
    bsc: poolsPattern,
    eth: poolsPattern,
    matic: poolsPattern,
  },
  required: ['updatedAt', 'bsc', 'eth', 'matic'],
}

const VAULTS_SCHEMA = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  properties: {
    updatedAt: {
      type: 'object',
      properties: {
        apiData: {
          type: 'string',
          format: 'date-time',
        },
        lastUpdated: {
          type: 'string',
        },
      },
      required: ['apiData', 'lastUpdated'],
    },
    bsc: vaultsPattern,
    eth: vaultsPattern,
    matic: vaultsPattern,
  },
  required: ['updatedAt', 'bsc', 'eth', 'matic'],
}

module.exports = {
  POOLS_SCHEMA,
  VAULTS_SCHEMA,
}
