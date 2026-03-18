/**
 * Limpia un string HTML reemplazando textos problemáticos como 'undefined', 'null' o 'NaN'
 * por espacios en blanco para evitar errores visuales en correos electrónicos.
 */
export function sanitizeHtmlPlaceholders(html: string): string {
  if (typeof html !== 'string') return ''

  return html
    .replace(/\bundefined\b/g, ' ')
    .replace(/\bnull\b/g, ' ')
    .replace(/\bNaN\b/g, ' ')
    .trim()
}
