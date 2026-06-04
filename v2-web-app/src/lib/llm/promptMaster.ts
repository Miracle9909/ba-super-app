/**
 * PromptMaster — Structured prompt builder for the BA Super App.
 *
 * Based on the Prompt Master methodology:
 *   - Decompose intent into explicit dimensions
 *   - Minimise re-prompt by being precise upfront
 *   - Carry memory blocks across sessions
 *
 * Each dimension is optional; only non-empty blocks appear in the
 * assembled prompt, keeping token usage as lean as possible.
 */

export interface PromptBlock {
  identity?: string;
  task?: string;
  context?: string;
  rules?: string[];
  outputFormat?: string;
  memory?: string;
  examples?: string[];
}

export class PromptBuilder {
  private blocks: PromptBlock = {};

  /** Who the AI should impersonate. */
  setIdentity(identity: string): this {
    this.blocks.identity = identity;
    return this;
  }

  /** The specific task to perform. */
  setTask(task: string): this {
    this.blocks.task = task;
    return this;
  }

  /** Project context: documents, knowledge, conversation history. */
  setContext(context: string): this {
    this.blocks.context = context;
    return this;
  }

  /** Hard constraints the AI must follow. */
  setRules(rules: string[]): this {
    this.blocks.rules = rules;
    return this;
  }

  /** Expected output structure. */
  setOutputFormat(format: string): this {
    this.blocks.outputFormat = format;
    return this;
  }

  /** Session memory — extracted entities, rules, terms from prior turns. */
  setMemory(memory: string): this {
    this.blocks.memory = memory;
    return this;
  }

  /** Few-shot examples to guide the response style. */
  setExamples(examples: string[]): this {
    this.blocks.examples = examples;
    return this;
  }

  /**
   * Assemble all non-empty blocks into a single system prompt.
   * Blocks are separated by clear markdown headers so the LLM
   * can parse each dimension unambiguously.
   */
  build(): string {
    const sections: string[] = [];

    if (this.blocks.identity) {
      sections.push(`## IDENTITY\n${this.blocks.identity}`);
    }

    if (this.blocks.task) {
      sections.push(`## TASK\n${this.blocks.task}`);
    }

    if (this.blocks.context) {
      sections.push(`## CONTEXT\n${this.blocks.context}`);
    }

    if (this.blocks.rules && this.blocks.rules.length > 0) {
      const rulesList = this.blocks.rules.map((r, i) => `${i + 1}. ${r}`).join('\n');
      sections.push(`## RULES\n${rulesList}`);
    }

    if (this.blocks.memory) {
      sections.push(`## MEMORY (prior session knowledge)\n${this.blocks.memory}`);
    }

    if (this.blocks.examples && this.blocks.examples.length > 0) {
      const exList = this.blocks.examples.map((ex, i) => `### Example ${i + 1}\n${ex}`).join('\n\n');
      sections.push(`## EXAMPLES\n${exList}`);
    }

    if (this.blocks.outputFormat) {
      sections.push(`## OUTPUT FORMAT\n${this.blocks.outputFormat}`);
    }

    return sections.join('\n\n');
  }

  /** Reset all blocks for reuse. */
  reset(): this {
    this.blocks = {};
    return this;
  }
}

/* ──────────────────────────────────────────────
   Pre-built prompt templates for BA workflows
   ────────────────────────────────────────────── */

/**
 * Build the system prompt for the Discovery chat agent.
 * @param domainOverlay  Optional domain-pack overlay text.
 * @param memoryBlock    Serialised prior knowledge (entities/rules/terms).
 */
export function buildDiscoveryChatPrompt(
  domainOverlay?: string,
  memoryBlock?: string,
): string {
  const builder = new PromptBuilder()
    .setIdentity(
      'You are a Senior Business Analyst with 15+ years of experience in requirements engineering, ' +
      'domain modelling, and stakeholder communication. You think critically, cite sources, and never fabricate information.',
    )
    .setTask(
      "Analyse the user's question using the provided project context. " +
      "Extract key knowledge (entities, business rules, glossary terms) while answering.",
    )
    .setRules([
      'Cite sources using [Source X] notation.',
      'Mark any unverified or assumed information as [Giả định].',
      'Be concise — avoid unnecessary filler or caveats.',
      'If the question is ambiguous, ask ONE clarifying question before answering.',
      "Respond in the same language as the user's question.",
    ])
    .setOutputFormat(
      `Answer the question in well-structured Markdown.

At the end of EVERY response, append an extraction block using this EXACT format:

---
ENTITIES:
- EntityName [Source X]: Brief description

RULES:
- RuleName [Source Y]: Brief description

TERMS:
- Term [Source Z]: Definition
---

If nothing new is discovered, write "No new knowledge extracted." instead of the block.`,
    );

  if (memoryBlock) {
    builder.setMemory(memoryBlock);
  }

  let prompt = builder.build();

  if (domainOverlay) {
    prompt += '\n\n## DOMAIN EXPERTISE\n' + domainOverlay;
  }

  return prompt;
}

/**
 * Build the prompt for draft document generation (BRD, SRS, User Story, Sprint Plan, Diagram).
 * @param selectedOutputs  Array of output type IDs the user selected.
 * @param projectDocuments Full markdown of project documents (if within token budget).
 * @param knowledgeBlock   Serialised extracted knowledge.
 */
export function buildDraftGenerationPrompt(
  selectedOutputs: string[],
  projectDocuments: string,
  knowledgeBlock: string,
): string {
  const outputLabels: Record<string, string> = {
    'user-story': 'User Story (As a / I want to / So that + Acceptance Criteria in Given/When/Then)',
    'brd': 'Business Requirements Document (BRD)',
    'srs': 'Software Requirements Specification (SRS)',
    'diagram': 'Sơ đồ (Use-Case, Sequence, hoặc Activity — dùng Mermaid syntax)',
    'sprint': 'Sprint Plan (với Story Points ước lượng, priorities, và sprint goal)',
  };

  const requestedTypes = selectedOutputs
    .map(id => outputLabels[id] || id)
    .join('\n- ');

  const builder = new PromptBuilder()
    .setIdentity(
      'You are an expert Business Analyst generating production-quality BA documentation drafts.',
    )
    .setTask(
      `Using the provided project documents and extracted knowledge, create comprehensive drafts for:\n- ${requestedTypes}`,
    )
    .setRules([
      'Each document type should have its own top-level heading (##).',
      'Use standard BA templates appropriate for each document type.',
      'Include traceability: reference Entities, Rules, and Terms where relevant.',
      'For diagrams, output Mermaid syntax inside a fenced code block.',
      'Do NOT fabricate requirements — mark assumptions as [Giả định].',
      'Write in Vietnamese unless the source material is in English.',
    ])
    .setOutputFormat(
      'Return a single Markdown document with clear separation between each output type. ' +
      'Use headings (##), lists, tables, and code blocks (for diagrams) as appropriate.',
    );

  if (projectDocuments) {
    builder.setContext(projectDocuments);
  }

  if (knowledgeBlock) {
    builder.setMemory(knowledgeBlock);
  }

  return builder.build();
}

/**
 * Build the prompt for User Story generation.
 * @param actor    Role / persona.
 * @param goal     What the actor wants to do.
 * @param benefit  Why (business value).
 * @param context  Additional project knowledge.
 */
export function buildUserStoryPrompt(
  actor: string,
  goal: string,
  benefit: string,
  context?: string,
): string {
  const builder = new PromptBuilder()
    .setIdentity(
      'You are an expert Agile Business Analyst specialising in writing high-quality User Stories ' +
      'with robust Acceptance Criteria.',
    )
    .setTask(
      `Generate a comprehensive Agile User Story for:
- **Actor**: ${actor}
- **Goal**: ${goal}
- **Benefit**: ${benefit || '(not specified)'}`,
    )
    .setRules([
      'Follow the standard format: "As a [actor], I want to [goal] so that [benefit]".',
      'Generate at least 3 Acceptance Criteria in Given/When/Then (Gherkin) format.',
      'Include edge cases and out-of-scope notes.',
      'If the benefit is not specified, infer a reasonable one and mark it [Giả định].',
      'Return ONLY the markdown content, no surrounding explanation.',
    ])
    .setOutputFormat(
      `## User Story
As a [actor], I want to [goal] so that [benefit].

## Acceptance Criteria
### AC-1: [Title]
- **Given** ...
- **When** ...
- **Then** ...

## Edge Cases
- ...

## Out of Scope
- ...`,
    );

  if (context) {
    builder.setContext(context);
  }

  return builder.build();
}
