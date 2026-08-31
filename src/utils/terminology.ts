/**
 * SRF Terminology Compliance Checker.
 *
 * Validates user-facing text against the Structural Regulation Framework
 * terminology rules. Returns an array of violation descriptions for any
 * prohibited terms or phrasings found.
 *
 * Rules enforced:
 * 1. "binary" (psychological context) -> "highly compressed dichotomous processing"
 * 2. "primitive" -> "minimally differentiated" or "categorical"
 * 3. "existence" (ontological context) -> "continuity of being"
 * 4. IRC must not be described as energy/fuel/resource
 * 5. Compression must not be described as a mechanism
 * 6. "complexity" (simultaneity context) -> "simultaneity"
 * 7. No em dash characters
 * 8. Healing/change must not be asserted as assumed outcome
 */

/** A single terminology violation */
export interface TerminologyViolation {
  /** The prohibited term or pattern that was found */
  found: string;
  /** Why it violates SRF terminology */
  reason: string;
  /** Suggested replacement */
  suggestion: string;
}

/** Rule definition for the checker */
interface TerminologyRule {
  /** Regex pattern to detect violations */
  pattern: RegExp;
  /** Reason this is prohibited */
  reason: string;
  /** What to use instead */
  suggestion: string;
}

const TERMINOLOGY_RULES: TerminologyRule[] = [
  {
    pattern: /\bbinary\b(?!\s+(?:data|code|file|format|number|digit|tree|search))/gi,
    reason: '"binary" should not describe psychological states',
    suggestion: 'Use "highly compressed dichotomous processing"',
  },
  {
    pattern: /\bprimitive\b(?!\s+(?:type|value|data))/gi,
    reason: '"primitive" implies a developmental hierarchy',
    suggestion: 'Use "minimally differentiated" or "categorical"',
  },
  {
    pattern: /\bexistence\b/gi,
    reason: '"existence" should be replaced with SRF ontological terminology',
    suggestion: 'Use "continuity of being" when describing ontological stakes',
  },
  {
    pattern: /\bIRC\b.*?\b(energy|fuel|resource)\b|\b(energy|fuel|resource)\b.*?\bIRC\b/gi,
    reason: 'IRC must not be described as energy, fuel, or resource',
    suggestion: 'Describe IRC as a holding threshold',
  },
  {
    pattern: /compression\s+mechanism|mechanism\s+of\s+compression/gi,
    reason: 'Compression is a consequence, not a mechanism',
    suggestion:
      'Describe compression as a consequence of simultaneity failure',
  },
  {
    pattern: /\bcomplexity\b(?=.*?(?:hold|capacity|representations|contradictory))/gi,
    reason:
      '"complexity" is incorrect when referring to holding capacity',
    suggestion:
      'Use "simultaneity" for the capacity to hold contradictory representations',
  },
  {
    pattern: /\u2014|\u2013/g,
    reason: 'Em dash and en dash characters are prohibited in user-facing text',
    suggestion: 'Use a comma, period, or hyphen instead',
  },
  {
    pattern: /\b(will\s+heal|healing\s+is\s+(certain|guaranteed|assured|inevitable)|topology\s+(will|can)\s+(always\s+)?change)\b/gi,
    reason:
      'Healing and topological change must be presented as open questions (DIH)',
    suggestion:
      'Present as an open question: "whether topology can change remains an open developmental question"',
  },
];

/**
 * TerminologyChecker validates text against SRF terminology rules.
 *
 * Usage:
 * ```ts
 * const checker = new TerminologyChecker();
 * const violations = checker.validate("This is a binary state");
 * // violations[0].found === "binary"
 * ```
 */
export class TerminologyChecker {
  private rules: TerminologyRule[];

  constructor() {
    this.rules = TERMINOLOGY_RULES;
  }

  /**
   * Validate a text string against all SRF terminology rules.
   * Returns an empty array if no violations are found.
   */
  validate(text: string): TerminologyViolation[] {
    const violations: TerminologyViolation[] = [];

    for (const rule of this.rules) {
      // Reset regex state (important for global patterns)
      rule.pattern.lastIndex = 0;

      let match: RegExpExecArray | null;
      while ((match = rule.pattern.exec(text)) !== null) {
        violations.push({
          found: match[0],
          reason: rule.reason,
          suggestion: rule.suggestion,
        });
      }
    }

    return violations;
  }

  /**
   * Check if text passes all terminology rules.
   * Returns true if no violations are found.
   */
  isCompliant(text: string): boolean {
    return this.validate(text).length === 0;
  }
}
