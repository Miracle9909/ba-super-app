import type { DomainPack } from './parser';
import { DomainPackParser } from './parser';

export class DomainPackLoader {
  /**
   * Fetches and parses a domain pack by its domain ID (e.g., 'banking' or 'insurance')
   */
  public static async loadDomainPack(domain: string): Promise<DomainPack> {
    try {
      const response = await fetch(`/domain-packs/${domain}.yaml`);
      if (!response.ok) {
        throw new Error(`Failed to fetch domain pack: ${response.statusText}`);
      }
      const yamlContent = await response.text();
      return DomainPackParser.parse(yamlContent);
    } catch (error) {
      console.error(`Error loading domain pack '${domain}':`, error);
      throw error;
    }
  }

  /**
   * Generates a system prompt overlay from a loaded DomainPack
   */
  public static generatePromptOverlay(pack: DomainPack): string {
    let overlay = `\n\n--- DOMAIN KNOWLEDGE: ${pack.name.toUpperCase()} ---\n`;
    
    if (pack.expert_persona) {
      overlay += `ROLE: ${pack.expert_persona}\n`;
    }

    if (pack.entities && pack.entities.length > 0) {
      overlay += `\nCORE ENTITIES:\n`;
      pack.entities.forEach(e => {
        overlay += `- ${e.name} (${e.type}): ${e.description}\n`;
      });
    }

    if (pack.rules && pack.rules.length > 0) {
      overlay += `\nBUSINESS RULES:\n`;
      pack.rules.forEach(r => {
        overlay += `- [${r.id}] ${r.name}: ${r.description}\n`;
      });
    }

    if (pack.terms && pack.terms.length > 0) {
      overlay += `\nGLOSSARY:\n`;
      pack.terms.forEach(t => {
        overlay += `- ${t.term}: ${t.definition}\n`;
      });
    }

    if (pack.compliance && pack.compliance.length > 0) {
      overlay += `\nCOMPLIANCE REQUIREMENTS:\n`;
      pack.compliance.forEach((c) => {
        overlay += `- ${c.name}: ${c.description}\n`;
      });
    }

    overlay += `\n--- END DOMAIN KNOWLEDGE ---\n`;
    
    return overlay;
  }
}
