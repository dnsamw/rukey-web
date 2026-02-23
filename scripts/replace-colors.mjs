import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";
import { resolve } from "path";

// ─── Color map: hardcoded hex → CSS variable ───────────────────────
const replacements = [
  // Tailwind arbitrary value classes — must come BEFORE plain hex replacements
  // bg / text / border / ring / fill / from / via / to / divide / stroke
  [/\[#F97316\]/g, "[var(--color-primary)]"],
  [/\[#EA6C0A\]/g, "[var(--color-primary-dark)]"],
  [/\[#1E3A5F\]/g, "[var(--color-secondary)]"],
  [/\[#162d4a\]/g, "[var(--color-secondary-dark)]"],

  // Plain hex values used in style={{ }} props or string literals
  [/'#F97316'/g, "'var(--color-primary)'"],
  [/'#EA6C0A'/g, "'var(--color-primary-dark)'"],
  [/'#1E3A5F'/g, "'var(--color-secondary)'"],
  [/'#162d4a'/g, "'var(--color-secondary-dark)'"],

  // Unquoted hex in JSX string attributes  e.g. color="#F97316"
  [/"#F97316"/g, '"var(--color-primary)"'],
  [/"#EA6C0A"/g, '"var(--color-primary-dark)"'],
  [/"#1E3A5F"/g, '"var(--color-secondary)"'],
  [/"#162d4a"/g, '"var(--color-secondary-dark)"'],
];

// ─── Files to process ──────────────────────────────────────────────
const files = globSync("**/*.{tsx,ts,css}", {
  ignore: [
    "node_modules/**",
    ".next/**",
    "scripts/**", // don't process this file itself
    "globals.css", // already done manually above
  ],
});

let totalFiles = 0;
let totalReplacements = 0;

for (const file of files) {
  const path = resolve(file);
  let content = readFileSync(path, "utf8");
  const original = content;

  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  if (content !== original) {
    writeFileSync(path, content, "utf8");
    const count = (content.match(/var\(--color-/g) ?? []).length;
    console.log(`✅  ${file}  (${count} variables)`);
    totalFiles++;
    totalReplacements += count;
  }
}

console.log(
  `\n🎨  Done — ${totalFiles} files updated, ~${totalReplacements} CSS variables injected.`,
);
