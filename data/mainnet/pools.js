const { CHAINS_ID, TRADING_APY_TYPES, POOL_TYPES } = require('../constants')
const addresses = require('./addresses.json')

const strat30PercentFactor = '0.7'

module.exports = [
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_AUR_USDC_V2',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_AUR_USDC_V2.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_AUR_USDC_V2.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.WMATIC],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0x6Fb2415463e949aF08ce50F83E94b7e008BABf07/0xA623aacf9eB4Fc0a29515F08bdABB0d8Ce385cF7">
            KyberDMM
          </a>
          and add liquidity for AURFEB22-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_BABL_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [addresses.V2.UniV3_BABL_ETH.NewVault, 'UniV3_BABL_ETH', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_BABL_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_BABL_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM, addresses.BABL],
    rewardTokenSymbols: ['iFARM', 'BABL'],
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_DEN_4EUR',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_DEN_4EUR.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_DEN_4EUR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.WMATIC],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://dmm.exchange/#/add/0xAd326c253A84e9805559b73A08724e11E49ca651/0xf379CB529aE58E1A03E62d3e31565f4f7c1F2020/0x4924B6E1207EFb244433294619a5ADD08ACB3dfF">
            KyberDMM
          </a>
          and add liquidity for DEN-4EUR
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_4EUR_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_4EUR_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_4EUR_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.WMATIC],
    rewardTokenSymbols: ['miFARM', 'WMATIC', 'fDEN_4EUR'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.curve.fi/factory/37/deposit">
            Curve
          </a>
          and add liquidity for 4EUR
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'polygon_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.polygon_WETH.NewPool,
    collateralAddress: addresses.MATIC.V2.polygon_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.WMATIC],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'polygon_USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.polygon_USDC.NewPool,
    collateralAddress: addresses.MATIC.V2.polygon_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.WMATIC],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'polygon_DAI',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.polygon_DAI.NewPool,
    collateralAddress: addresses.MATIC.V2.polygon_DAI.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.WMATIC],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_USDC_ETH_4200_5500',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [
        addresses.V2.UniV3_USDC_ETH_4200_5500.NewVault,
        'UniV3_USDC_ETH_4200_5500',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_USDC_ETH_4200_5500.NewPool,
    collateralAddress: addresses.V2.UniV3_USDC_ETH_4200_5500.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_DAI_ETH_4200_5500',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [
        addresses.V2.UniV3_DAI_ETH_4200_5500.NewVault,
        'UniV3_DAI_ETH_4200_5500',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_DAI_ETH_4200_5500.NewPool,
    collateralAddress: addresses.V2.UniV3_DAI_ETH_4200_5500.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_ETH_USDT_4200_5500',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [
        addresses.V2.UniV3_ETH_USDT_4200_5500.NewVault,
        'UniV3_ETH_USDT_4200_5500',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_ETH_USDT_4200_5500.NewPool,
    collateralAddress: addresses.V2.UniV3_ETH_USDT_4200_5500.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_CNG_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [addresses.V2.UniV3_CNG_ETH.NewVault, 'UniV3_CNG_ETH', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_CNG_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_CNG_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM, addresses.ecoCNG],
    rewardTokenSymbols: ['iFARM', 'ecoCNG'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_USDC_ETH_3000_4500',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [
        addresses.V2.UniV3_USDC_ETH_3000_4500.NewVault,
        'UniV3_USDC_ETH_3000_4500',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_USDC_ETH_3000_4500.NewPool,
    collateralAddress: addresses.V2.UniV3_USDC_ETH_3000_4500.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_DAI_ETH_3000_4500',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [
        addresses.V2.UniV3_DAI_ETH_3000_4500.NewVault,
        'UniV3_DAI_ETH_3000_4500',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_DAI_ETH_3000_4500.NewPool,
    collateralAddress: addresses.V2.UniV3_DAI_ETH_3000_4500.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_USDT_ETH_3000_4500',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [
        addresses.V2.UniV3_USDT_ETH_3000_4500.NewVault,
        'UniV3_USDT_ETH_3000_4500',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_USDT_ETH_3000_4500.NewPool,
    collateralAddress: addresses.V2.UniV3_USDT_ETH_3000_4500.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm_curve_ibEUR+sEUR',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.convex_ibEUR.NewPool,
    collateralAddress: addresses.V2.convex_ibEUR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['f-ibeur'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://curve.fi/factory/3/deposit">
              curve.fi
            </a>
            and deposit <b>EUR stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
    </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_DON_WETH_full_range',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [
        addresses.V2.UniV3_DON_WETH_full_range.NewVault,
        'UniV3_DON_WETH_full_range',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_DON_WETH_full_range.NewPool,
    collateralAddress: addresses.V2.UniV3_DON_WETH_full_range.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM, addresses.DON],
    rewardTokenSymbols: ['iFARM', 'DON'],
    vestingDescriptionOverride: {
      iFARM: '',
      DON: '2/3rds of <b>DON</b> rewards are vested for 6 months',
    },
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-mim',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.convex_MIM.NewPool,
    collateralAddress: addresses.V2.convex_MIM.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['mim'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/mim/deposit">
              curve.fi
            </a>
            and deposit <b>USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
    </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-eurt',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.convex_EURT.NewPool,
    collateralAddress: addresses.V2.convex_EURT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['eurt'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/eurt/deposit">
              curve.fi
            </a>
            and deposit <b>EUR stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'LQTY',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.liquity_LQTY.NewPool,
    collateralAddress: addresses.V2.liquity_LQTY.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.quickswap_ETH_USDT.Underlying],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'quick_ETH_USDT',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.quickswap_ETH_USDT.NewPool,
    collateralAddress: addresses.MATIC.V2.quickswap_ETH_USDT.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://quickswap.exchange/#/add/${addresses.MATIC.pWETH}/${addresses.MATIC.pUSDT}">
              quickswap
            </a>
            and supply liquidity to the <b>ETH-USDT</b> pair by depositing <b>ETH</b> and
            <b>USDT</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.quickswap_IFARM_QUICK.Underlying],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'quick_IFARM_QUICK',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.quickswap_IFARM_QUICK.NewPool,
    collateralAddress: addresses.MATIC.V2.quickswap_IFARM_QUICK.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://quickswap.exchange/#/add/${addresses.MATIC.miFARM}/${addresses.MATIC.QUICK}">
            quickswap
          </a>
          and supply liquidity to the <b>IFARM-QUICK</b> pair by depositing <b>IFARM</b> and
            <b>QUICK</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.sushiswap_USDC_ETH.Underlying],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'sushi_USDC_ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.sushiswap_USDC_ETH.NewPool,
    collateralAddress: addresses.MATIC.V2.sushiswap_USDC_ETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/add/${addresses.MATIC.pUSDC}/${addresses.MATIC.pWETH}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>USDC-ETH</b> pair by depositing <b>USDC</b> and
            <b>ETH</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'profit-sharing-farm',
    type: POOL_TYPES.PROFIT_SHARING,
    contractAddress: addresses.pools.ProfitSharingFARMUpstream,
    autoStakePoolAddress: addresses.pools.ProfitSharingFARMAutoStake,
    collateralAddress: addresses.FARM,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: null,
    hideNativeApy: true,
    watchAsset: {
      address: addresses.FARM,
      symbol: 'FARM',
      decimals: '18',
      icon: '/icons/farm.png',
    },
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://app.rari.capital/fuse/pool/24"
          >
            Rari Fuse
          </a>
          and provide liquidity using <b>USDC</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
    id: 'farmstead-usdc',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.pools.FARMSteadUSDCPool,
    collateralAddress: addresses.FARMSteadUSDC,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM, addresses.IDLE],
    rewardTokenSymbols: ['iFARM', 'IDLE'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.RARI_FARMSTEAD_USDC,
      params: [],
    },
    watchAsset: {
      address: addresses.FARMSteadUSDC,
      symbol: 'FARMSteadUSDC',
      decimals: '8',
    },
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-weth',
    displayName: 'FARM/ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.FARM_WETH_LP],
    },
    externalPoolURL: `https://v2.info.uniswap.org/pair/${addresses.FARM_WETH_LP}`,
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.pools.FARM_WETHPool,
    collateralAddress: addresses.FARM_WETH_LP,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    vestingDescriptionOverride: { FARM: '2/3rds of <b>FARM</b> rewards are vested for 6 months' },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.FARM}/ETH"
            >
              Uniswap
            </a>
            and provide liquidity using <b>FARM</b> and <b>ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
            <br />
            The current version of the FARM/ETH pool does not allow partial withdrawals. You can
            only withdraw the maximum amount.
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-grain',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.FARM_GRAIN_LP],
    },
    externalPoolURL: `https://v2.info.uniswap.org/pair/${addresses.FARM_GRAIN_LP}`,
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.pools.GRAINPool,
    collateralAddress: addresses.FARM_GRAIN_LP,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.FARM}/${addresses.GRAIN}"
            >
              Uniswap
            </a>
            and provide liquidity using <b>FARM</b> and <b>GRAIN</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
            <br />
            The current version of the FARM/GRAIN pool does not allow partial withdrawals. You can
            only withdraw the maximum amount.
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-ycrv',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.YCRV.NewPool,
    collateralAddress: addresses.V2.YCRV.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/iearn/deposit">
              curve.fi
            </a>
            deposit <b>USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-three-pool',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.ThreePool.NewPool,
    collateralAddress: addresses.V2.ThreePool.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['3pool'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/3pool/deposit">
              curve.fi
            </a>
            deposit <b>USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
    zapperFiTokens: ['USDC', 'DAI', 'USDT', 'WETH'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-hbtc',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvHBTC.NewPool,
    collateralAddress: addresses.V2.crvHBTC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['hbtc'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/hbtc/deposit">
              curve.fi
            </a>
            deposit <b>BTC assets</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-husd',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvHUSD.NewPool,
    collateralAddress: addresses.V2.crvHUSD.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['husd'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/husd/deposit">
              curve.fi
            </a>
            deposit <b>USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-compound',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvCOMPOUND.NewPool,
    collateralAddress: addresses.V2.crvCOMPOUND.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['compound'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.curve.fi/compound/deposit"
            >
              curve.fi
            </a>
            deposit <b>USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-busd',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvBUSD.NewPool,
    collateralAddress: addresses.V2.crvBUSD.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['busd'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/busd/deposit">
              curve.fi
            </a>
            deposit <b>USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-usdn',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvUSDN.NewPool,
    collateralAddress: addresses.V2.crvUSDN.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['usdn'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/usdn/deposit">
              curve.fi
            </a>
            deposit <b>USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-usdc',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.USDC.NewPool,
    collateralAddress: addresses.V2.USDC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    zapperFiTokens: ['DAI', 'USDT'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-usdt',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.USDT.NewPool,
    collateralAddress: addresses.V2.USDT.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    zapperFiTokens: ['USDC', 'DAI'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-tusd',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.pools.TUSDPool,
    collateralAddress: addresses.ProxiedVaultTUSD,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-dai',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.DAI.NewPool,
    collateralAddress: addresses.V2.DAI.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    zapperFiTokens: ['USDC', 'USDT'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-obtc',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvOBTC.NewPool,
    collateralAddress: addresses.V2.crvOBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['obtc'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/obtc/deposit">
              curve.fi
            </a>
            deposit <b>BTC assets</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-tbtc-mixed-pool',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.TBTCMixed.NewPool,
    collateralAddress: addresses.V2.TBTCMixed.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['tbtc'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/tbtc/deposit">
              curve.fi
            </a>
            deposit <b>BTC assets</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crv-renbtc',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvRenWBTC.NewPool,
    collateralAddress: addresses.V2.crvRenWBTC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['ren'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ren/deposit">
              curve.fi
            </a>
            deposit <b>BTC assets</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-wbtc',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.WBTC.NewPool,
    collateralAddress: addresses.V2.WBTC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-renbtc',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.renBTC.NewPool,
    collateralAddress: addresses.V2.renBTC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    uniPool: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.VaultUNI_LP_WETH_DPI],
    },
    id: 'weth-dpi-uni-farm',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.pools.UNI_LP_WETH_DPIPool,
    collateralAddress: addresses.VaultUNI_LP_WETH_DPI,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b/ETH"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>ETH-DPI</b> pair by depositing <b>ETH</b> and <b>DPI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'fweth-farm',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.WETH.NewPool,
    collateralAddress: addresses.V2.WETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardMultiplier: 3,
    rewardTokens: [addresses.FARM],
    vestingDescriptionOverride: { FARM: '2/3rds of <b>FARM</b> rewards are vested for 6 months' },
    rewardTokenSymbols: ['FARM'],
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.UNI_BAC_DAI.Underlying],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'BAC-DAI',
    isDegen: true,
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.UNI_BAC_DAI.NewPool,
    collateralAddress: addresses.V2.UNI_BAC_DAI.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.BAC}/${addresses.DAI}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.BAC}/${addresses.DAI}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>BAC-DAI</b> pair by depositing <b>BAC</b> and <b>DAI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.UNI_DAI_BAS.Underlying],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'DAI-BAS',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.UNI_DAI_BAS.NewPool,
    collateralAddress: addresses.V2.UNI_DAI_BAS.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.DAI}/${addresses.BAS}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.DAI}/${addresses.BASV2}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>DAI-BASv2</b> pair by depositing <b>DAI</b> and{' '}
            <b>BASv2</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'LFBTC-LIFT',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.lfBTC_LIFT.NewPool,
    collateralAddress: addresses.V2.lfBTC_LIFT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.sushi.com/add/${addresses.lfBTC}/{addresses.LIFT}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/add/${addresses.lfBTC}/${addresses.LIFT}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>LFBTC-LIFT</b> pair by depositing <b>lfBTC</b> and{' '}
            <b>LIFT</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'WBTC-LFBTC',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.wBTC_lfBTC.NewPool,
    collateralAddress: addresses.V2.wBTC_lfBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.sushi.com/add/${addresses.lfBTC}/${addresses.WBTC}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/add/${addresses.lfBTC}/${addresses.WBTC}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>WBTC-LFBTC</b> pair by depositing <b>WBTC</b> and{' '}
            <b>lfBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'MIC-USDT',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.UNI_MIC_USDT.NewPool,
    collateralAddress: addresses.V2.UNI_MIC_USDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://sushiswap.fi/pair/${addresses.V2.UNI_MIC_USDT.Underlying}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://sushiswap.fi/pair/${addresses.V2.UNI_MIC_USDT.Underlying}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>MIC-USDT</b> pair by depositing <b>MIC</b> and{' '}
            <b>USDT</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'MIS-USDT',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.UNI_MIS_USDT.NewPool,
    collateralAddress: addresses.V2.UNI_MIS_USDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://sushiswap.fi/pair/${addresses.V2.UNI_MIS_USDT.Underlying}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://sushiswap.fi/pair/${addresses.V2.UNI_MIS_USDT.Underlying}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>MIS-USDT</b> pair by depositing <b>MIS</b> and{' '}
            <b>USDT</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    id: 'SUSHI-ETH-PERP',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.sushi_PERP_ETH.Underlying],
    },
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.sushi_PERP_ETH.NewPool,
    collateralAddress: addresses.V2.sushi_PERP_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/${addresses.PERP}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/${addresses.PERP}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>PERP-ETH</b> pair by depositing <b>PERP</b> and{' '}
            <b>ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'SUSHI-SUSHI-ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.sushi_SUSHI_WETH.NewVault],
    },
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_SUSHI_WETH.NewPool,
    collateralAddress: addresses.V2.sushi_SUSHI_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>ETH-SUSHI</b> pair by depositing <b>ETH</b> and{' '}
            <b>SUSHI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'SUSHI-ETH-DAI',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_DAI_WETH],
    },
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_DAI_WETH.NewPool,
    collateralAddress: addresses.V2.sushi_DAI_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0x6B175474E89094C44Da98b954EedeAC495271d0F`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0x6B175474E89094C44Da98b954EedeAC495271d0F"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>ETH-DAI</b> pair by depositing <b>ETH</b> and <b>DAI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'SUSHI-ETH-USDC',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_USDC_WETH],
    },
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_USDC_WETH.NewPool,
    collateralAddress: addresses.V2.sushi_USDC_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>ETH-USDC</b> pair by depositing <b>ETH</b> and{' '}
            <b>USDC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'SUSHI-ETH-USDT',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_USDT_WETH],
    },
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_USDT_WETH.NewPool,
    collateralAddress: addresses.V2.sushi_USDT_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0xdAC17F958D2ee523a2206206994597C13D831ec7`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0xdAC17F958D2ee523a2206206994597C13D831ec7"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>ETH-USDT</b> pair by depositing <b>ETH</b> and{' '}
            <b>USDT</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'SUSHI-ETH-WBTC',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_WBTC_WETH],
    },
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_WBTC_WETH.NewPool,
    collateralAddress: addresses.V2.sushi_WBTC_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>ETH-WBTC</b> pair by depositing <b>ETH</b> and{' '}
            <b>WBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'SUSHI-ETH-UST',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_UST_WETH],
    },
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_UST_WETH.NewPool,
    collateralAddress: addresses.V2.sushi_UST_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>UST-ETH</b> pair by depositing <b>UST</b> and <b>ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_ETH_DAI.Underlying],
    },
    id: '1INCH-ETH-DAI',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_ETH_DAI.NewPool,
    collateralAddress: addresses.V2.oneInch_ETH_DAI.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        These vaults are migrated from <b>1INCH</b> to <b>Sushiswap</b> and now earning the same{' '}
        <b>iFARM</b> and <b>fSUSHI</b> yields as <b>SUSHI HODL</b> vaults.
        <br />
        <br /> When you withdraw, you receive <b>Sushiswap LP tokens</b> as well as proportional{' '}
        <b>iFARM</b> and <b>fSUSHI</b> accumulated in the <b>HODL</b> vaults.
        <br />
        <br /> To deposit more assets, use the vaults in the <b>SUSHI HODL</b> section directly.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_ETH_USDC.Underlying],
    },
    id: '1INCH-ETH-USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_ETH_USDC.NewPool,
    collateralAddress: addresses.V2.oneInch_ETH_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        These vaults are migrated from <b>1INCH</b> to <b>Sushiswap</b> and now earning the same{' '}
        <b>iFARM</b> and <b>fSUSHI</b> yields as <b>SUSHI HODL</b> vaults.
        <br />
        <br /> When you withdraw, you receive <b>Sushiswap LP tokens</b> as well as proportional{' '}
        <b>iFARM</b> and <b>fSUSHI</b> accumulated in the <b>HODL</b> vaults.
        <br />
        <br /> To deposit more assets, use the vaults in the <b>SUSHI HODL</b> section directly.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_ETH_USDT.Underlying],
    },
    id: '1INCH-ETH-USDT',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_ETH_USDT.NewPool,
    collateralAddress: addresses.V2.oneInch_ETH_USDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        These vaults are migrated from <b>1INCH</b> to <b>Sushiswap</b> and now earning the same{' '}
        <b>iFARM</b> and <b>fSUSHI</b> yields as <b>SUSHI HODL</b> vaults.
        <br />
        <br /> When you withdraw, you receive <b>Sushiswap LP tokens</b> as well as proportional{' '}
        <b>iFARM</b> and <b>fSUSHI</b> accumulated in the <b>HODL</b> vaults.
        <br />
        <br /> To deposit more assets, use the vaults in the <b>SUSHI HODL</b> section directly.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_ETH_WBTC.Underlying],
    },
    id: '1INCH-ETH-WBTC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_ETH_WBTC.NewPool,
    collateralAddress: addresses.V2.oneInch_ETH_WBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        These vaults are migrated from <b>1INCH</b> to <b>Sushiswap</b> and now earning the same{' '}
        <b>iFARM</b> and <b>fSUSHI</b> yields as <b>SUSHI HODL</b> vaults.
        <br />
        <br /> When you withdraw, you receive <b>Sushiswap LP tokens</b> as well as proportional{' '}
        <b>iFARM</b> and <b>fSUSHI</b> accumulated in the <b>HODL</b> vaults.
        <br />
        <br /> To deposit more assets, use the vaults in the <b>SUSHI HODL</b> section directly.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_ETH_1INCH.Underlying],
    },
    id: '1INCH-ETH-1INCH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_ETH_1INCH.NewPool,
    collateralAddress: addresses.V2.oneInch_ETH_1INCH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://1inch.exchange/#/dao/pools?token0=0x0000000000000000000000000000000000000000&token1=${addresses['1INCH']}"
            >
              1Inch
            </a>
            and supply liquidity to the <b>1INCH-ETH</b> pair by depositing <b>1INCH</b> and{' '}
            <b>ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_1INCH_USDC.Underlying],
    },
    id: '1INCH-USDC-1INCH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_1INCH_USDC.NewPool,
    collateralAddress: addresses.V2.oneInch_1INCH_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://1inch.exchange/#/dao/pools?token0=${addresses.USDC}&token1=${addresses['1INCH']}"
            >
              1Inch
            </a>
            and supply liquidity to the <b>USDC-1INCH</b> pair by depositing <b>1INCH</b> and{' '}
            <b>USDC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_1INCH_WBTC.NewVault],
    },
    id: '1INCH-WBTC-1INCH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_1INCH_WBTC.NewPool,
    collateralAddress: addresses.V2.oneInch_1INCH_WBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://1inch.exchange/#/dao/pools?token0=${addresses.WBTC}&token1=${addresses['1INCH']}"
            >
              1Inch
            </a>
            and supply liquidity to the <b>1INCH-WBTC</b> pair by depositing <b>1INCH</b> and{' '}
            <b>WBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.basisGold_DAI_BSG.Underlying],
    },
    id: 'DAI-BSG',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.basisGold_DAI_BSG.NewPool,
    collateralAddress: addresses.V2.basisGold_DAI_BSG.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.DAI}/${addresses.BSG}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.DAI}/${addresses.BSG}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>DAI-BSG</b> pair by depositing <b>DAI</b> and <b>BSG</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
    hideNativeApy: true,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'DAI-BSGS',
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.basisGold_DAI_BSGS.Underlying],
    },
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.basisGold_DAI_BSGS.NewPool,
    collateralAddress: addresses.V2.basisGold_DAI_BSGS.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.DAI}/${addresses.BSGS}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.DAI}/${addresses.BSGS}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>DAI-BSGS</b> pair by depositing <b>DAI</b> and{' '}
            <b>BSGS</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
    hideNativeApy: true,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-bac',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.basisGold_BAC.NewPool,
    collateralAddress: addresses.V2.basisGold_BAC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-esd',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.basisGold_ESD.NewPool,
    collateralAddress: addresses.V2.basisGold_ESD.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-dsd',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.basisGold_DSD.NewPool,
    collateralAddress: addresses.V2.basisGold_DSD.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-eurs',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvEURS.NewPool,
    collateralAddress: addresses.V2.crvEURS.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['eurs'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/eurs/deposit">
              curve.fi
            </a>
            and deposit <b>EUR stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-gusd',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvGUSD.NewPool,
    collateralAddress: addresses.V2.crvGUSD.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/gusd/deposit">
              curve.fi
            </a>
            and deposit <b>USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-ust',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvUST.NewPool,
    collateralAddress: addresses.V2.crvUST.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['ust'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust/deposit">
              curve.fi
            </a>
            and deposit <b>USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.mirrorAAPL.Underlying],
    },
    id: 'mirrorAAPL',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.mirrorAAPL.NewPool,
    collateralAddress: addresses.V2.mirrorAAPL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.mAAPL}/${addresses.UST}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Got to
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust">
              curve.fi
            </a>
            and buy <b>UST</b> using stablecoins and{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/swap?inputCurrency=${addresses.UST}&outputCurrency=${addresses.mAAPL}"
            >
              buy mAAPL
            </a>
            with some <b>UST</b>. Visit{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.mAAPL}/${addresses.UST}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>MIRROR-AAPL</b> pair by depositing <b>mAAPL</b> and{' '}
            <b>UST</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.mirrorAMZN.Underlying],
    },
    id: 'mirrorAMZN',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.mirrorAMZN.NewPool,
    collateralAddress: addresses.V2.mirrorAMZN.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.mAMZN}/${addresses.UST}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Got to
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust">
              curve.fi
            </a>
            and buy <b>UST</b> using stablecoins and{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/swap?inputCurrency=${addresses.UST}&outputCurrency=${addresses.mAMZN}"
            >
              buy mAMZN
            </a>
            with some <b>UST</b>. Visit{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.mAMZN}/${addresses.UST}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>MIRROR-AMZN</b> pair by depositing <b>mAMZN</b> and{' '}
            <b>UST</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.mirrorGOOG.Underlying],
    },
    id: 'mirrorGOOG',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.mirrorGOOG.NewPool,
    collateralAddress: addresses.V2.mirrorGOOG.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.mGOOGL}/${addresses.UST}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Got to
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust">
              curve.fi
            </a>
            and buy <b>UST</b> using stablecoins and{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/swap?inputCurrency=${addresses.UST}&outputCurrency=${addresses.mGOOGL}"
            >
              buy mGOOGL
            </a>
            with some <b>UST</b>. Visit{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.mGOOGL}/${addresses.UST}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>MIRROR-GOOG</b> pair by depositing <b>mGOOGL</b> and{' '}
            <b>UST</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.mirrorTSLA.Underlying],
    },
    id: 'mirrorTSLA',
    isDegen: true,
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.mirrorTSLA.NewPool,
    collateralAddress: addresses.V2.mirrorTSLA.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.mTSLA}/${addresses.UST}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Got to
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust">
              curve.fi
            </a>
            and buy <b>UST</b> using stablecoins and{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/swap?inputCurrency=${addresses.UST}&outputCurrency=${addresses.mTSLA}"
            >
              buy mTSLA
            </a>
            with some <b>UST</b>. Visit{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.mTSLA}/${addresses.UST}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>MIRROR-TSLA</b> pair by depositing <b>mTSLA</b> and{' '}
            <b>UST</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.mirrorNFLX.Underlying],
    },
    id: 'mirrorNFLX',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.mirrorNFLX.NewPool,
    collateralAddress: addresses.V2.mirrorNFLX.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.mNFLX}/${addresses.UST}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Got to
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust">
              curve.fi
            </a>
            and buy <b>UST</b> using stablecoins and{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/swap?inputCurrency=${addresses.UST}&outputCurrency=${addresses.mNFLX}"
            >
              buy mNFLX
            </a>
            with some <b>UST</b>. Visit{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.mNFLX}/${addresses.UST}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>MIRROR-NFLX</b> pair by depositing <b>mNFLX</b> and{' '}
            <b>UST</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.mirrorTWTR.Underlying],
    },
    id: 'mirrorTWTR',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.mirrorTWTR.NewPool,
    collateralAddress: addresses.V2.mirrorTWTR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.mTWTR}/${addresses.UST}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Got to
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust">
              curve.fi
            </a>
            and buy <b>UST</b> using stablecoins and{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/swap?inputCurrency=${addresses.UST}&outputCurrency=${addresses.mTWTR}"
            >
              buy mTWTR
            </a>
            with some <b>UST</b>. Visit{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.mTWTR}/${addresses.UST}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>MIRROR-TWTR</b> pair by depositing <b>mTWTR</b> and{' '}
            <b>UST</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-steth',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvSTETH.NewPool,
    collateralAddress: addresses.V2.crvSTETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['steth'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/steth/deposit">
              curve.fi
            </a>
            and deposit <b>ETH assets</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-aave',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvAAVE.NewPool,
    collateralAddress: addresses.V2.crvAAVE.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/aave/deposit">
              curve.fi
            </a>
            and deposit <b>USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.klondike_WBTC_KBTC.Underlying],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-klondike-wbtc-kbtc',
    isDegen: true,
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.klondike_WBTC_KBTC.NewPool,
    collateralAddress: addresses.V2.klondike_WBTC_KBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.KBTC}/${addresses.WBTC}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.KBTC}/${addresses.WBTC}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>WBTC-KBTC</b> pair by depositing <b>KBTC</b> and{' '}
            <b>WBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.klondike_WBTC_KLON.Underlying],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-klondike-wbtc-klon',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.klondike_WBTC_KLON.NewPool,
    collateralAddress: addresses.V2.klondike_WBTC_KLON.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.KLON}/${addresses.WBTC}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.KLONX}/${addresses.WBTC}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>WBTC-KLONX</b> pair by depositing <b>KLONX</b> and{' '}
            <b>WBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-crv-link',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.crvLink.NewPool,
    collateralAddress: addresses.V2.crvLink.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['link'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/link/deposit">
              curve.fi
            </a>
            and deposit <b>LINK assets</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-sushi',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.SUSHI.NewPool,
    collateralAddress: addresses.V2.SUSHI.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://exchange.sushi.com/">
              Sushiswap
            </a>
            and convert assets to <b>SUSHI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_DAI_WETH],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'SUSHI-ETH-DAI-HODL',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.sushi_DAI_WETH_HODL.NewPool,
    collateralAddress: addresses.V2.sushi_DAI_WETH_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM', 'fSUSHI'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0x6B175474E89094C44Da98b954EedeAC495271d0F`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0x6B175474E89094C44Da98b954EedeAC495271d0F"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>ETH-DAI</b> pair by depositing <b>ETH</b> and <b>DAI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_USDC_WETH],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'SUSHI-ETH-USDC-HODL',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.sushi_USDC_WETH_HODL.NewPool,
    collateralAddress: addresses.V2.sushi_USDC_WETH_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM', 'fSUSHI'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>ETH-USDC</b> pair by depositing <b>ETH</b> and{' '}
            <b>USDC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_USDT_WETH],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'SUSHI-ETH-USDT-HODL',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.sushi_USDT_WETH_HODL.NewPool,
    collateralAddress: addresses.V2.sushi_USDT_WETH_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM', 'fSUSHI'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0xdAC17F958D2ee523a2206206994597C13D831ec7`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0xdAC17F958D2ee523a2206206994597C13D831ec7"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>ETH-USDT</b> pair by depositing <b>ETH</b> and{' '}
            <b>USDT</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_WBTC_WETH],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'SUSHI-ETH-WBTC-HODL',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.sushi_WBTC_WETH_HODL.NewPool,
    collateralAddress: addresses.V2.sushi_WBTC_WETH_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM', 'fSUSHI'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>ETH-WBTC</b> pair by depositing <b>ETH</b> and{' '}
            <b>WBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-crv-usdp',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.crvUSDP.NewPool,
    collateralAddress: addresses.V2.crvUSDP.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['usdp'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/usdp/deposit">
              curve.fi
            </a>
            and deposit <b>USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    isDegen: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Muse.Underlying],
    },
    id: 'farm-muse-eth',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Muse.NewPool,
    collateralAddress: addresses.V2.nft20_Muse.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.MUSE}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>MUSE-ETH</b> pair by depositing <b>MUSE</b> and{' '}
            <b>ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    isDegen: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Dudes.Underlying],
    },
    id: 'farm-dudes20-eth',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Dudes.NewPool,
    collateralAddress: addresses.V2.nft20_Dudes.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.NUDES20}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>DUDES20-ETH</b> pair by depositing <b>DUDES20</b> and{' '}
            <b>ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    isDegen: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Mask.Underlying],
    },
    id: 'farm-mask20-eth',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Mask.NewPool,
    collateralAddress: addresses.V2.nft20_Mask.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.MASK20}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>MASK20-ETH</b> pair by depositing <b>MASK20</b> and{' '}
            <b>ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Rope.Underlying],
    },
    id: 'farm-rope20-eth',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Rope.NewPool,
    collateralAddress: addresses.V2.nft20_Rope.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.ROPE20}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>ROPE20-ETH</b> pair by depositing <b>ROPE20</b> and{' '}
            <b>ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    isDegen: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Mooncat.Underlying],
    },
    id: 'farm-mcat20-eth',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Mooncat.NewPool,
    collateralAddress: addresses.V2.nft20_Mooncat.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.MCAT20}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>MCAT20-ETH</b> pair by depositing <b>MCAT20</b> and{' '}
            <b>ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venusXVS',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.venus_XVS.NewPool,
    collateralAddress: addresses.BSC.venus_XVS.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vXVS'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venusDAI',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.venus_DAI.NewPool,
    collateralAddress: addresses.BSC.venus_DAI.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vDAI'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venusUSDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.venus_USDC.NewPool,
    collateralAddress: addresses.BSC.venus_USDC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vUSDC'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venusUSDT',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.venus_USDT.NewPool,
    collateralAddress: addresses.BSC.venus_USDT.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vUSDT'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venusBUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.venus_BUSD.NewPool,
    collateralAddress: addresses.BSC.venus_BUSD.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vBUSD'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venusVAI',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.venus_VAI.NewPool,
    collateralAddress: addresses.BSC.venus_VAI.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venusETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.venus_ETH.NewPool,
    collateralAddress: addresses.BSC.venus_ETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vETH'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venusBETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.venus_BETH.NewPool,
    collateralAddress: addresses.BSC.venus_BETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vBETH'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venusBTCB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.venus_BTCB.NewPool,
    collateralAddress: addresses.BSC.venus_BTCB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vBTC'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venusWBNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.venus_WBNB.NewPool,
    collateralAddress: addresses.BSC.venus_WBNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vBNB'],
    },
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.pancake_BUSD_BNB.Underlying],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'pancakeBUSDBNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.pancake_BUSD_BNB.NewPool,
    collateralAddress: addresses.BSC.pancake_BUSD_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/#/add/${addresses.BSC.bUSD}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b>BUSD-BNB</b> pair by depositing <b>BUSD</b> and{' '}
            <b>BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'pancakeCAKE',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.pancake_CAKE.NewPool,
    collateralAddress: addresses.BSC.pancake_CAKE.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/"
            >
              PancakeSwap
            </a>
            and convert assets to <b>CAKE</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.pancake_CAKE_BNB.Underlying],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'pancakeCAKEBNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.pancake_CAKE_BNB.NewPool,
    collateralAddress: addresses.BSC.pancake_CAKE_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/#/add/${addresses.BSC.CAKE}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b>CAKE-BNB</b> pair by depositing <b>CAKE</b> and{' '}
            <b>BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.pancake_ETH_BNB.Underlying],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'pancakeETHBNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.pancake_ETH_BNB.NewPool,
    collateralAddress: addresses.BSC.pancake_ETH_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/#/add/${addresses.BSC.ETH}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b>ETH-BNB</b> pair by depositing <b>ETH</b> and <b>BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.pancake_USDT_BNB.Underlying],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'pancakeUSDTBNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.pancake_USDT_BNB.NewPool,
    collateralAddress: addresses.BSC.pancake_USDT_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/#/add/${addresses.BSC.bUSDT}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b>USDT-BNB</b> pair by depositing <b>USDT</b> and{' '}
            <b>BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.pancake_XVS_BNB.Underlying],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'pancakeXVSBNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.pancake_XVS_BNB.NewPool,
    collateralAddress: addresses.BSC.pancake_XVS_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/#/add/${addresses.BSC.XVS}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b>XVS-BNB</b> pair by depositing <b>XVS</b> and <b>BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'gooseEGGBNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.goose_EGG_BNB.NewPool,
    collateralAddress: addresses.BSC.goose_EGG_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.goosedefi.com/#/add/${addresses.BSC.EGG}/${addresses.BSC.WBNB}"
            >
              Goose
            </a>
            and supply liquidity to the <b>EGG-BNB</b> pair by depositing <b>EGG</b> and <b>BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'gooseEGGBUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.goose_EGG_BUSD.NewPool,
    collateralAddress: addresses.BSC.goose_EGG_BUSD.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.goosedefi.com/#/add/${addresses.BSC.EGG}/${addresses.BSC.bUSD}"
            >
              Goose
            </a>
            and supply liquidity to the <b>EGG-BUSD</b> pair by depositing <b>EGG</b> and{' '}
            <b>BUSD</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'gooseEGG',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.goose_EGG.NewPool,
    collateralAddress: addresses.BSC.goose_EGG.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://exchange.goosedefi.com/">
              Goose
            </a>
            and convert assets to <b>EGG</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'bdo_BDO_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.bdo_BDO_BNB.NewPool,
    collateralAddress: addresses.BSC.bdo_BDO_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://v1exchange.pancakeswap.finance/#/add/${addresses.BSC.BDO}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b>BDO-BNB</b> pair by depositing <b>BDO</b> and <b>BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'bdo_BDO_BUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.bdo_BDO_BUSD.NewPool,
    collateralAddress: addresses.BSC.bdo_BDO_BUSD.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://v1exchange.pancakeswap.finance/#/add/${addresses.BSC.BDO}/${addresses.BSC.bUSD}"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b>BDO-BUSD</b> pair by depositing <b>BDO</b> and{' '}
            <b>BUSD</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'bdo_SBDO_BUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.bdo_SBDO_BUSD.NewPool,
    collateralAddress: addresses.BSC.bdo_SBDO_BUSD.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://v1exchange.pancakeswap.finance/#/add/${addresses.BSC.sBDO}/${addresses.BSC.bUSD}"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b>SBDO-BUSD</b> pair by depositing <b>SBDO</b> and{' '}
            <b>BUSD</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'oneInch_1INCH_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.oneInch_1INCH_BNB.NewPool,
    collateralAddress: addresses.BSC.oneInch_1INCH_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://1inch.exchange/#/dao/pools?network=56&token0=${addresses.BSC.b1INCH}&token1=0x0000000000000000000000000000000000000000"
            >
              1INCH
            </a>
            and supply liquidity to the <b>1INCH-BNB</b> pair by depositing <b>1INCH</b> and{' '}
            <b>BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'oneInch_1INCH_renBTC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.oneInch_1INCH_renBTC.NewPool,
    collateralAddress: addresses.BSC.oneInch_1INCH_renBTC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://1inch.exchange/#/dao/pools?network=56&token0=${addresses.BSC.b1INCH}&token1=${addresses.BSC.bRENBTC}"
            >
              1INCH
            </a>
            and supply liquidity to the <b>1INCH-RENBTC</b> pair by depositing <b>1INCH</b> and{' '}
            <b>RENBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    isDegen: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Meme.Underlying],
    },
    id: 'farm-meme20-eth',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Meme.NewPool,
    collateralAddress: addresses.V2.nft20_Meme.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.MEME20}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>MEME20-ETH</b> pair by depositing <b>MEME20</b> and{' '}
            <b>ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    isDegen: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Gpunks.Underlying],
    },
    id: 'farm-gpunks20-eth',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Gpunks.NewPool,
    collateralAddress: addresses.V2.nft20_Gpunks.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.GPUNKS20}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>GPUNKS20-ETH</b> pair by depositing <b>GPUNKS20</b> and{' '}
            <b>ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    uniPool: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.uni_ETH_MVI.Underlying],
    },
    id: 'weth-mvi-uni-farm',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.uni_ETH_MVI.NewPool,
    collateralAddress: addresses.V2.uni_ETH_MVI.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.MVI}/ETH"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>ETH-MVI</b> pair by depositing <b>ETH</b> and <b>MVI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.klondike_KXUSD_DAI.Underlying],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-klondike-kxusd-dai',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.klondike_KXUSD_DAI.NewPool,
    collateralAddress: addresses.V2.klondike_KXUSD_DAI.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.KXUSD}/${addresses.DAI}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.KXUSD}/${addresses.DAI}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>KXUSD-DAI</b> pair by depositing <b>KXUSD</b> and{' '}
            <b>DAI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'ellipsis_3pool',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.ellipsis_3pool.NewPool,
    collateralAddress: addresses.BSC.ellipsis_3pool.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://ellipsis.finance/3pool/deposit"
            >
              ellipsis
            </a>
            and deposit <b>USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.ellipsis_EPS_BNB.Underlying],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'ellipsis_EPS_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.ellipsis_EPS_BNB.NewPool,
    collateralAddress: addresses.BSC.ellipsis_EPS_BNB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://pancake.ellipsis.finance/#/add/${addresses.BSC.EPS}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b>EPS-BNB</b> pair by depositing <b>EPS</b> and <b>BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'swirl_SWIRL_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.swirl_SWIRL_BNB.NewPool,
    collateralAddress: addresses.BSC.swirl_SWIRL_BNB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://v1exchange.pancakeswap.finance/#/add/${addresses.BSC.SWIRL}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b>SWIRL-BNB</b> pair by depositing <b>SWIRL</b> and{' '}
            <b>BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.space_SPACE_BNB.Underlying],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'space_SPACE_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.space_SPACE_BNB.NewPool,
    collateralAddress: addresses.BSC.space_SPACE_BNB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://pancake.ellipsis.finance/#/add/${addresses.BSC.SPACE}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b>SPACE-BNB</b> pair by depositing <b>SPACE</b> and{' '}
            <b>BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.space_SPACE_BUSD.Underlying],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'space_SPACE_BUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.space_SPACE_BUSD.NewPool,
    collateralAddress: addresses.BSC.space_SPACE_BUSD.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://pancake.ellipsis.finance/#/add/${addresses.BSC.SPACE}/${addresses.BSC.bUSD}"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b>SPACE-BUSD</b> pair by depositing <b>SPACE</b> and{' '}
            <b>BUSD</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.belt_BELT_BNB.Underlying],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'belt_BELT_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.belt_BELT_BNB.NewPool,
    collateralAddress: addresses.BSC.belt_BELT_BNB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/#/add/${addresses.BSC.BELT}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b>BELT-BNB</b> pair by depositing <b>BELT</b> and{' '}
            <b>BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'belt_Venus',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.belt_Venus.NewPool,
    collateralAddress: addresses.BSC.belt_Venus.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://beta.belt.fi/">
              belt
            </a>
            , scroll down to the <b>Belt LP Staking</b> section and deposit <b>USD stablecoins</b>{' '}
            into the <b>venus</b> pool
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'belt_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.belt_BNB.NewPool,
    collateralAddress: addresses.BSC.belt_BNB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BELT,
      params: [addresses.BSC.belt_BNB.PoolId],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://beta.belt.fi/">
              belt
            </a>
            , scroll down to the <b>Belt Vaults</b> section and deposit <b>BNB</b> into the{' '}
            <b>BNB</b> vault
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'belt_ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.belt_ETH.NewPool,
    collateralAddress: addresses.BSC.belt_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BELT,
      params: [addresses.BSC.belt_ETH.PoolId],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://beta.belt.fi/">
              belt
            </a>
            , scroll down to the <b>Belt Vaults</b> section and deposit <b>ETH</b> into the{' '}
            <b>ETH</b> vault
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'belt_BTCB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.belt_BTCB.NewPool,
    collateralAddress: addresses.BSC.belt_BTCB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BELT,
      params: [addresses.BSC.belt_BTCB.PoolId],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://beta.belt.fi/">
              belt
            </a>
            , scroll down to the <b>Belt Vaults</b> section and deposit <b>BTCB</b> into the{' '}
            <b>BTCB</b> vault
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.popsicle_ICE_BNB.NewVault],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'popsicle_ICE_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.popsicle_ICE_BNB.NewPool,
    collateralAddress: addresses.BSC.popsicle_ICE_BNB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/add/${addresses.BSC.ICE}/ETH"
            >
              SushiSwap
            </a>
            and supply liquidity to the <b>ICE-BNB</b> pair by depositing <b>ICE</b> and <b>BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'popsicle_ICE',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.popsicle_ICE.NewPool,
    collateralAddress: addresses.BSC.popsicle_ICE.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/"
            >
              PancakeSwap
            </a>
            and convert assets to <b>ICE</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'ellipsis_FUSDT',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.ellipsis_FUSDT.NewPool,
    collateralAddress: addresses.BSC.ellipsis_FUSDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://ellipsis.finance/fusdt/deposit"
            >
              ellipsis
            </a>
            and deposit <b>USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'ellipsis_BTC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.ellipsis_BTC.NewPool,
    collateralAddress: addresses.BSC.ellipsis_BTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://ellipsis.finance/ren/deposit"
            >
              ellipsis
            </a>
            and deposit <b>BTC assets</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'complifi_COMPFI_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.complifi_COMPFI_WETH.NewPool,
    collateralAddress: addresses.V2.complifi_COMPFI_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/v2/${addresses.COMFI}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b>COMFI-ETH</b> pair by depositing <b>COMFI</b> and{' '}
            <b>ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_zUSD_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3,
      params: [addresses.V2.UniV3_ZUSD_ETH.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_ZUSD_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_ZUSD_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_zUSD_USDC_full_range',
    tradingApyFunction: {
      type: 'UNIV3_V2',
      params: [addresses.V2.UniV3_zUSD_USDC_full_range.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_zUSD_USDC_full_range.NewPool,
    collateralAddress: addresses.V2.UniV3_zUSD_USDC_full_range.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    vestingDescriptionOverride: { iFARM: '' },
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_ETH_sETH2',
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_ETH_sETH2.NewPool,
    collateralAddress: addresses.V2.UniV3_ETH_sETH2.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_USDC_ETH',
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_USDC_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_USDC_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_DPI_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3,
      params: [addresses.V2.Univ3_DPI_ETH.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.Univ3_DPI_ETH.NewPool,
    collateralAddress: addresses.V2.Univ3_DPI_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_UST_USDT',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [addresses.V2.UniV3_UST_USDT.NewVault, 'UniV3_UST_USDT', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_UST_USDT.NewPool,
    collateralAddress: addresses.V2.UniV3_UST_USDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM, addresses.LUNA],
    rewardTokenSymbols: ['iFARM', 'LUNA'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_USDC_USDT',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [addresses.V2.UniV3_USDC_USDT.NewVault, 'UniV3_USDC_USDT', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_USDC_USDT.NewPool,
    collateralAddress: addresses.V2.UniV3_USDC_USDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_WBTC_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [addresses.V2.UniV3_WBTC_ETH.NewVault, 'UniV3_WBTC_ETH', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_WBTC_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_WBTC_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_ETH_USDT',
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_ETH_USDT.NewPool,
    collateralAddress: addresses.V2.UniV3_ETH_USDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_DAI_USDC',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [addresses.V2.UniV3_DAI_USDC.NewVault, 'UniV3_DAI_USDC', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_DAI_USDC.NewPool,
    collateralAddress: addresses.V2.UniV3_DAI_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_DAI_ETH',
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_DAI_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_DAI_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_UNI_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [addresses.V2.UniV3_UNI_ETH.NewVault, 'UniV3_UNI_ETH', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_UNI_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_UNI_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_FCASH_USDC',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3,
      params: [addresses.V2.UniV3_FCASH_USDC.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_FCASH_USDC.NewPool,
    collateralAddress: addresses.V2.UniV3_FCASH_USDC.NewVault,
    rewardAPY: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Get fCash{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://fcash.farmdashboard.xyz/">
              here
            </a>
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'Univ3_USDT_ETH_1400_2400',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3,
      params: [addresses.V2.Univ3_USDT_ETH_1400_2400.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.Univ3_USDT_ETH_1400_2400.NewPool,
    collateralAddress: addresses.V2.Univ3_USDT_ETH_1400_2400.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'Univ3_USDC_ETH_1400_2400',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3,
      params: [addresses.V2.Univ3_USDC_ETH_1400_2400.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.Univ3_USDC_ETH_1400_2400.NewPool,
    collateralAddress: addresses.V2.Univ3_USDC_ETH_1400_2400.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'Univ3_DAI_ETH_1400_2400',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3,
      params: [addresses.V2.Univ3_DAI_ETH_1400_2400.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.Univ3_DAI_ETH_1400_2400.NewPool,
    collateralAddress: addresses.V2.Univ3_DAI_ETH_1400_2400.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-curve-tricrypto',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvThreeCrypto.NewPool,
    collateralAddress: addresses.V2.crvThreeCrypto.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['tricrypto2'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://curve.fi/tricrypto2/deposit"
            >
              curve.fi
            </a>
            and deposit <b>WBTC, ETH, and/or USDT</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'bal_BAL_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.bal_BAL_WETH.NewPool,
    collateralAddress: addresses.V2.bal_BAL_WETH.NewVault,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BALANCER,
      params: [addresses.V2.bal_BAL_WETH.PoolId, CHAINS_ID.ETH_MAINNET],
    },
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.balancer.fi/#/pool/${addresses.V2.bal_BAL_WETH.PoolId}"
            >
              balancer.fi
            </a>
            and deposit <b>BAL</b> and <b>WETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'bal_DAI_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.bal_DAI_WETH.NewPool,
    collateralAddress: addresses.V2.bal_DAI_WETH.NewVault,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BALANCER,
      params: [addresses.V2.bal_DAI_WETH.PoolId, CHAINS_ID.ETH_MAINNET],
    },
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.balancer.fi/#/pool/${addresses.V2.bal_DAI_WETH.PoolId}"
            >
              balancer.fi
            </a>
            and deposit <b>DAI</b> and <b>WETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'bal_USDC_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.bal_USDC_WETH.NewPool,
    collateralAddress: addresses.V2.bal_USDC_WETH.NewVault,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BALANCER,
      params: [addresses.V2.bal_USDC_WETH.PoolId, CHAINS_ID.ETH_MAINNET],
    },
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.balancer.fi/#/pool/${addresses.V2.bal_USDC_WETH.PoolId}"
            >
              balancer.fi
            </a>
            and deposit <b>USDC</b> and <b>WETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'bal_USDT_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.bal_USDT_WETH.NewPool,
    collateralAddress: addresses.V2.bal_USDT_WETH.NewVault,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BALANCER,
      params: [addresses.V2.bal_USDT_WETH.PoolId, CHAINS_ID.ETH_MAINNET],
    },
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.balancer.fi/#/pool/${addresses.V2.bal_USDT_WETH.PoolId}"
            >
              balancer.fi
            </a>
            and deposit <b>USDT</b> and <b>WETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'bal_WBTC_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.bal_WBTC_WETH.NewPool,
    collateralAddress: addresses.V2.bal_WBTC_WETH.NewVault,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BALANCER,
      params: [addresses.V2.bal_WBTC_WETH.PoolId, CHAINS_ID.ETH_MAINNET],
    },
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.balancer.fi/#/pool/${addresses.V2.bal_WBTC_WETH.PoolId}"
            >
              balancer.fi
            </a>
            and deposit <b>WBTC</b> and <b>WETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'Univ3_BUSD_USDC',
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.Univ3_BUSD_USDC.NewPool,
    collateralAddress: addresses.V2.Univ3_BUSD_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3,
      params: [addresses.V2.Univ3_BUSD_USDC.NewVault],
    },
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'Univ3_renBTC_wBTC',
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.Univ3_renBTC_wBTC.NewPool,
    collateralAddress: addresses.V2.Univ3_renBTC_wBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_V3,
      params: [addresses.V2.Univ3_renBTC_wBTC.NewVault, 'Univ3_renBTC_wBTC', strat30PercentFactor],
    },
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.uni_FOX_WETH.Underlying],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'Uni_FOX_WETH',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.uni_FOX_WETH.NewPool,
    collateralAddress: addresses.V2.uni_FOX_WETH.NewVault,
    rewardAPY: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://fox.shapeshift.com/fox-farming/liquidity/add"
          >
          Shapeshift
          </a>
          and provide liquidity using <b>FOX</b> and <b>ETH</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.sushi_PHTR_FARM.Underlying],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'SUSHI-PHTR-FARM',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_PHTR_FARM.NewPool,
    collateralAddress: addresses.V2.sushi_PHTR_FARM.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/add/${addresses.PHTR}/${addresses.FARM}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>PHTR-FARM</b> pair by depositing <b>PHTR</b> and
            <b>FARM</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.sushi_PHTR_ETH.Underlying],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'SUSHI-PHTR-ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_PHTR_ETH.NewPool,
    collateralAddress: addresses.V2.sushi_PHTR_ETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM, addresses.PHTR],
    rewardTokenSymbols: ['iFARM', 'PHTR'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/add/${addresses.PHTR}/${addresses.WETH}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b>PHTR-ETH</b> pair by depositing <b>PHTR</b> and
            <b>ETH</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_REI_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3,
      params: [addresses.V2.UniV3_REI_ETH.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_REI_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_REI_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    vestingDescriptionOverride: { iFARM: '' },
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_REI_ETH_full_range',
    tradingApyFunction: {
      type: 'UNIV3_V2',
      params: [addresses.V2.UniV3_REI_ETH_full_range.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_REI_ETH_full_range.NewPool,
    collateralAddress: addresses.V2.UniV3_REI_ETH_full_range.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_REI_wBTC',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3,
      params: [addresses.V2.UniV3_REI_wBTC.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_REI_wBTC.NewPool,
    collateralAddress: addresses.V2.UniV3_REI_wBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JEUR_USDC_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JEUR_USDC_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JEUR_USDC_HODL.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.jarvis_JEUR_USDC_HODL.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.WMATIC],
    rewardTokenSymbols: ['miFARM', 'WMATIC', 'fAURFEB22_USDC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://dmm.exchange/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c/0xa1219DBE76eEcBf7571Fed6b020Dd9154396B70e">
            KyberDMM
          </a>
          and add liquidity for jEUR-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JGBP_USDC_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JGBP_USDC_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JGBP_USDC_HODL.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.jarvis_JGBP_USDC_HODL.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.WMATIC],
    rewardTokenSymbols: ['miFARM', 'WMATIC', 'fAURFEB22_USDC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://dmm.exchange/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0x767058F11800FBA6A682E73A6e79ec5eB74Fac8c/0xbb2d00675B775E0F8acd590e08DA081B2a36D3a6">
            KyberDMM
          </a>
          and add liquidity for jGBP-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JCHF_USDC_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JCHF_USDC_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JCHF_USDC_HODL.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.jarvis_JCHF_USDC_HODL.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.WMATIC],
    rewardTokenSymbols: ['miFARM', 'WMATIC', 'fAURFEB22_USDC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://dmm.exchange/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0xbD1463F02f61676d53fd183C2B19282BFF93D099/0x439E6A13a5ce7FdCA2CC03bF31Fb631b3f5EF157">
            KyberDMM
          </a>
          and add liquidity for jCHF-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_AUR_USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_AUR_USDC.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_AUR_USDC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.WMATIC],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://dmm.exchange/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0xfAdE2934b8E7685070149034384fB7863860D86e/0xA0fB4487c0935f01cBf9F0274FE3CdB21a965340">
            KyberDMM
          </a>
          and add liquidity for AUR-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'bal_POLYBASE',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BALANCER,
      params: [addresses.MATIC.V2.balancer_POLYBASE.PoolId, CHAINS_ID.MATIC_MAINNET],
    },
    contractAddress: addresses.MATIC.V2.balancer_POLYBASE.NewPool,
    collateralAddress: addresses.MATIC.V2.balancer_POLYBASE.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.balancer_POLYBASE.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.WMATIC],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.balancer.fi/#/pool/${addresses.MATIC.V2.balancer_POLYBASE.PoolId}">
            balancer
          </a>
          and invest <b>WMATIC</b>, <b>USDC</b>, <b>WETH</b> or <b>BAL</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'bal_TRICRYPTO',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BALANCER,
      params: [addresses.MATIC.V2.balancer_TRICRYPTO.PoolId, CHAINS_ID.MATIC_MAINNET],
    },
    contractAddress: addresses.MATIC.V2.balancer_TRICRYPTO.NewPool,
    collateralAddress: addresses.MATIC.V2.balancer_TRICRYPTO.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.balancer_TRICRYPTO.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.WMATIC],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.balancer.fi/#/pool/${addresses.MATIC.V2.balancer_TRICRYPTO.PoolId}">
            balancer
          </a>
          and invest <b>WBTC</b>, <b>USDC</b>, or <b>WETH</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'bal_STABLE',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BALANCER,
      params: [addresses.MATIC.V2.balancer_STABLE.PoolId, CHAINS_ID.MATIC_MAINNET],
    },
    contractAddress: addresses.MATIC.V2.balancer_STABLE.NewPool,
    collateralAddress: addresses.MATIC.V2.balancer_STABLE.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.balancer_STABLE.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.WMATIC],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.balancer.fi/#/pool/${addresses.MATIC.V2.balancer_STABLE.PoolId}">
            balancer
          </a>
          and invest <b>USDT</b>, <b>miMATIC</b>, <b>USDC</b> or <b>DAI</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.sushi_YEL_ETH.Underlying],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_YEL_ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_YEL_ETH.NewPool,
    collateralAddress: addresses.V2.sushi_YEL_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM', 'fYEL'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
        <li>
        Go to&nbsp;
        <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://app.sushi.com/add/ETH/${addresses.YEL}"
          >
            Sushiswap
          </a>
          and supply liquidity to the <b>YEL-ETH</b> pair by depositing <b>YEL</b> and
          <b>ETH</b>
        </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'yelhold_YEL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.yelhold_YEL.NewPool,
    collateralAddress: addresses.V2.yelhold_YEL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/swap"
            >
             Sushiswap
            </a>
            and swap assets to <b>YEL</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
]
