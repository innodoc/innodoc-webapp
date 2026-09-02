import type { LanguageCode } from 'iso-639-1'
import { DEFAULT_LOCALES } from '#constants'

/**
 * Locales the UI can actually render.
 *
 * `i18next` appends its internal `cimode` marker to `supportedLngs` when it initialises, and that is
 * not a language: a document rendered in it has every UI string replaced by its key.
 *
 * @param supportedLngs - `supportedLngs` as configured on an i18next instance
 * @returns Locale codes the UI bundles exist for
 */
function uiLocales(supportedLngs: false | readonly string[] | undefined): string[] {
  if (!supportedLngs) {
    return []
  }

  return supportedLngs.filter((lng) => lng !== 'cimode')
}

/**
 * Resolve the locale the document is rendered in: the one carried by the URL, as long as the UI
 * bundles exist for it, and the default locale otherwise.
 *
 * This is the single resolution shared by the request handler (`Content-Language`, the server's
 * `t()`, `__initial_state__.locale`) and the route store (`routeInfo.locale`, `<html lang>`, the
 * client's i18next): every one of those must carry the same value for the same document, so all of
 * them apply this one function to the locale of the URL.
 *
 * @param locale - Locale parsed from the URL
 * @param supported - Locales the UI can render, see {@link uiLocales}
 * @returns Locale code to render and to hand to the client
 */
function resolveDocumentLocale(locale: string, supported: readonly string[]): LanguageCode {
  if (supported.includes(locale)) {
    return locale as LanguageCode
  }

  return DEFAULT_LOCALES[0] ?? 'en'
}

export { resolveDocumentLocale, uiLocales }
