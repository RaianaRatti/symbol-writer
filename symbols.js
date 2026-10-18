// Shortcut table, based on the Google Docs equation editor shortcuts
// (https://equation-shortcuts.notuom.com/) plus a few common LaTeX extras.
// Names are case-sensitive: "pi" -> π, "Pi" -> Π.
//
// Entries marked `accent: true` are combining marks: "v/vec " -> v⃗.
// If there is no character right before the shortcut, the mark is applied
// to the next character you type instead ("/vec v" -> v⃗).
//
// Structural shortcuts from the equation editor (\frac, \sub, \abs, \lim, ...)
// and keywords (\sin, \log, ...) have no single-character equivalent, so they
// are not included.

(function () {
  const groups = {
    "Greek letters": {
      alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ϵ",
      varepsilon: "ε", zeta: "ζ", eta: "η", theta: "θ", vartheta: "ϑ",
      iota: "ι", kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ",
      pi: "π", varpi: "ϖ", rho: "ρ", varrho: "ϱ", sigma: "σ",
      varsigma: "ς", tau: "τ", upsilon: "υ", phi: "ϕ", varphi: "φ",
      chi: "χ", psi: "ψ", omega: "ω",
      Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ", Xi: "Ξ", Pi: "Π",
      Sigma: "Σ", Upsilon: "Υ", Phi: "Φ", Psi: "Ψ", Omega: "Ω",
    },
    "Operations": {
      times: "×", div: "÷", cdot: "⋅", pm: "±", mp: "∓", ast: "∗",
      star: "⋆", circ: "∘", bullet: "∙", oplus: "⊕", ominus: "⊖",
      oslash: "⊘", otimes: "⊗", odot: "⊙", dagger: "†", ddagger: "‡",
      vee: "∨", wedge: "∧", cap: "∩", cup: "∪", aleph: "ℵ", Re: "ℜ",
      Im: "ℑ", top: "⊤", bot: "⊥", infty: "∞", partial: "∂",
      forall: "∀", exists: "∃", neg: "¬", triangle: "△", diamond: "⋄",
    },
    "Relations": {
      leq: "≤", geq: "≥", prec: "≺", succ: "≻", preceq: "⪯", succeq: "⪰",
      ll: "≪", gg: "≫", equiv: "≡", sim: "∼", simeq: "≃", asymp: "≍",
      approx: "≈", ne: "≠", subset: "⊂", supset: "⊃", subseteq: "⊆",
      supseteq: "⊇", in: "∈", ni: "∋", notin: "∉",
    },
    "Big operators": {
      sqrt: "√", sum: "∑", sumab: "∑", prod: "∏", prodab: "∏",
      coprod: "∐", coprodab: "∐", int: "∫", intab: "∫", oint: "∮",
      ointab: "∮", bigcap: "⋂", bigcapab: "⋂", bigcup: "⋃", bigcupab: "⋃",
    },
    "Arrows": {
      leftarrow: "←", rightarrow: "→", leftrightarrow: "↔",
      Leftarrow: "⇐", Rightarrow: "⇒", Leftrightarrow: "⇔",
      uparrow: "↑", downarrow: "↓", updownarrow: "↕",
      Uparrow: "⇑", Downarrow: "⇓", Updownarrow: "⇕",
    },
    "Other symbols": {
      angle: "∠", hbar: "ℏ", vdots: "⋮", cdots: "⋯", ldots: "…",
      nabla: "∇", vdash: "⊢", parallel: "∥", propto: "∝",
    },
    "Accents": {
      vec: "⃗", bar: "̄", overline: "̅", hat: "̂",
      widehat: "̂", tilde: "̃", dot: "̇", ddot: "̈",
      underline: "̲",
    },
    "Extras (LaTeX)": {
      le: "≤", ge: "≥", neq: "≠", to: "→", gets: "←", implies: "⇒",
      iff: "⇔", mapsto: "↦", emptyset: "∅", varnothing: "∅",
      therefore: "∴", because: "∵", degree: "°", cong: "≅", perp: "⊥",
      mid: "∣", setminus: "∖", nexists: "∄", ell: "ℓ", land: "∧",
      lor: "∨", lnot: "¬", cbrt: "∛",
      N: "ℕ", Z: "ℤ", Q: "ℚ", R: "ℝ", C: "ℂ",
    },
  };

  const list = [];
  const byName = Object.create(null);
  for (const [group, entries] of Object.entries(groups)) {
    for (const [name, symbol] of Object.entries(entries)) {
      const entry = { name, symbol, group, accent: group === "Accents" };
      list.push(entry);
      byName[name] = entry;
    }
  }

  globalThis.SYMBOL_WRITER = { list, byName };
})();
