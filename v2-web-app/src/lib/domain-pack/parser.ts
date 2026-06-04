import YAML from 'yaml';

export interface DomainRule {
  id: string;
  name: string;
  description: string;
}

export interface DomainTerm {
  term: string;
  definition: string;
}

export interface DomainEntity {
  name: string;
  type: string;
  description: string;
}

export interface DomainPack {
  name: string;
  version: string;
  domain: string;
  expert_persona?: string;
  rules?: DomainRule[];
  terms?: DomainTerm[];
  entities?: DomainEntity[];
  compliance?: { name: string; description: string; }[];
  suggested_questions?: string[];
}

export class DomainPackParser {
  /**
   * Parses a YAML string into a DomainPack object
   * @param yamlContent The raw YAML string
   * @returns Parsed DomainPack
   */
  public static parse(yamlContent: string): DomainPack {
    try {
      const parsed = YAML.parse(yamlContent);
      
      if (!parsed || typeof parsed !== 'object') {
        throw new Error("Invalid YAML structure");
      }

      if (!parsed.name || !parsed.domain) {
        throw new Error("Domain pack must contain 'name' and 'domain' fields");
      }

      return {
        name: parsed.name,
        version: parsed.version || '1.0',
        domain: parsed.domain,
        expert_persona: parsed.expert_persona,
        rules: parsed.rules || [],
        terms: parsed.terms || [],
        entities: parsed.entities || [],
        compliance: parsed.compliance || [],
        suggested_questions: parsed.suggested_questions || []
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse Domain Pack: ${error.message}`);
      }
      throw new Error("Failed to parse Domain Pack: Unknown error");
    }
  }
}
