/** Fill {placeholders} in a translated string: fmt("Hello {name}", { name: "Eric" }) */
export function fmt(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}