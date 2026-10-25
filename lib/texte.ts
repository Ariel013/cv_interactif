// Retire le balisage léger du CV maître (**gras**, *italique*, [texte](url))
// pour un affichage en texte simple. Partagé par l'île et le terminal.
export const sansBalisage = (texte: string) =>
  texte.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*|\*/g, "");
