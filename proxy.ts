import { NextResponse, type NextRequest } from "next/server";

// « / » n'a pas de page : il renvoie vers /fr ou /en (ADR 0005). Le choix
// retenu (cookie posé par le bouton de langue) passe avant la langue du
// navigateur.
export function proxy(request: NextRequest) {
  const choix = request.cookies.get("langue")?.value;
  let langue = choix === "fr" || choix === "en" ? choix : null;
  if (!langue) {
    // Première langue préférée du navigateur : français si c'est du français,
    // anglais sinon (ADR 0005, « anglais par défaut hors francophonie »).
    const prefere = (request.headers.get("accept-language") ?? "").split(",")[0]?.trim().toLowerCase() ?? "";
    langue = prefere.startsWith("fr") ? "fr" : "en";
  }
  return NextResponse.redirect(new URL(`/${langue}`, request.url), 307);
}

export const config = {
  matcher: "/",
};
