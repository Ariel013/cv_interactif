import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Three.js se pilote en mutant ses objets dans la boucle de rendu
  // (useFrame) : c'est l'usage normal de React Three Fiber. Le joystick écrit
  // dans la même référence partagée, lue à chaque image.
  {
    files: ["components/monde/SceneMonde.tsx", "components/monde/Joystick.tsx"],
    rules: { "react-hooks/immutability": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
