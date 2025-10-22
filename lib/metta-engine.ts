// MeTTa logic engine for advanced policy reasoning
// Enables declarative policy rules and inference

export interface MeTTaRule {
  id: string
  name: string
  pattern: string
  conditions: string[]
  actions: string[]
  priority: number
}

export interface MeTTaKnowledgeBase {
  rules: MeTTaRule[]
  facts: Map<string, unknown>
}

export class MeTTaEngine {
  private kb: MeTTaKnowledgeBase = {
    rules: [],
    facts: new Map(),
  }

  // Add a rule to the knowledge base
  addRule(rule: MeTTaRule): void {
    this.kb.rules.push(rule)
    this.kb.rules.sort((a, b) => b.priority - a.priority)
    console.log(`[MeTTa] Rule added: ${rule.name}`)
  }

  // Assert a fact
  assertFact(key: string, value: unknown): void {
    this.kb.facts.set(key, value)
    console.log(`[MeTTa] Fact asserted: ${key}`)
  }

  // Query the knowledge base
  query(pattern: string): unknown[] {
    const results: unknown[] = []
    for (const [key, value] of this.kb.facts.entries()) {
      if (key.includes(pattern)) {
        results.push(value)
      }
    }
    return results
  }

  // Infer new facts based on rules
  infer(): Map<string, unknown> {
    const newFacts = new Map<string, unknown>()
    for (const rule of this.kb.rules) {
      const conditionsMet = rule.conditions.every((cond) => {
        const [key, expectedValue] = cond.split("=")
        return this.kb.facts.get(key) === expectedValue
      })

      if (conditionsMet) {
        for (const action of rule.actions) {
          const [key, value] = action.split("=")
          newFacts.set(key, value)
        }
      }
    }
    return newFacts
  }

  // Get all rules
  getRules(): MeTTaRule[] {
    return this.kb.rules
  }

  // Get knowledge base facts
  getFacts(): Map<string, unknown> {
    return this.kb.facts
  }
}

export const mettaEngine = new MeTTaEngine()
