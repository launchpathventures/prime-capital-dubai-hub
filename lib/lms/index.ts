/**
 * CATALYST - LMS Module
 *
 * Barrel export for LMS utilities.
 */

export {
  syncLmsContent,
  syncCompetencies,
  syncModules,
  syncAudioTranscripts,
  syncQuizzes,
} from "./sync"

export {
  ESSENTIALS_PROMPT_VERSION,
  hashContent,
  isEssentialsStale,
  extractImagesFromMarkdown,
  buildEssentialsPrompt,
  parseEssentialsResponse,
} from "./essentials"
export {
  getAudioForModule,
  getAudioForCompetency,
  formatAudioDuration,
  type AudioTrackData,
} from "./audio"

export {
  getMarketData,
  getMarketDataByCategory,
  getMarketDataBatch,
  getMarketOverview,
  getSupplyPipeline,
  getExistingStock,
  getUnderConstruction,
  getMedianPrices,
  getBudgetGuide,
  getMarketDataForModule,
  type MarketDataRecord,
  type MarketOverviewData,
  type SupplyPipelineData,
  type AreaStockData,
  type AreaPriceData,
  type BudgetGuideData,
} from "./market-data"