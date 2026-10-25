"use client";

import { Component, type ReactNode } from "react";

// Si la scène 3D plante (contexte WebGL refusé, module qui ne se charge pas),
// on bascule sur l'introduction de secours plutôt que de laisser un écran vide.
export class ErreurScene extends Component<{ surErreur: () => void; children: ReactNode }, { erreur: boolean }> {
  state = { erreur: false };

  static getDerivedStateFromError() {
    return { erreur: true };
  }

  componentDidCatch() {
    this.props.surErreur();
  }

  render() {
    return this.state.erreur ? null : this.props.children;
  }
}
