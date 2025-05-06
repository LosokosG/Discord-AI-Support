/**
 * JavaScript wrapper dla OpenRouter Service
 * Pozwala na korzystanie z implementacji TypeScript w JavaScript
 */

import { OpenRouterService, OpenRouterModel, DEFAULT_PARAMS } from "./index.ts";

/**
 * Funkcja tworząca instancję OpenRouterService
 * @param {string} apiKey - Klucz API dla OpenRouter
 * @param {string} [model] - Domyślny model do użycia (opcjonalny)
 * @param {object} [params] - Domyślne parametry modelu (opcjonalne)
 * @returns {OpenRouterService} Instancja serwisu OpenRouter
 */
export function createOpenRouterService(apiKey, model, params) {
  const defaultModel = model || OpenRouterModel.GPT35Turbo;
  const defaultParams = params || DEFAULT_PARAMS;

  return new OpenRouterService(apiKey, defaultModel, defaultParams);
}

/**
 * Eksportuje modele OpenRouter jako obiekt
 */
export const Models = OpenRouterModel;

/**
 * Eksportuje domyślne parametry
 */
export const DefaultParams = DEFAULT_PARAMS;
