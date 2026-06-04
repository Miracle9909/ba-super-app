/**
 * Markdown-aware recursive text chunker.
 *
 * Key improvements over the naive version:
 *  1. Splits at Markdown structural boundaries first (headings, paragraphs,
 *     sentences, words) — never cuts inside a heading + its first paragraph.
 *  2. Implements real overlap: the last `overlap` characters of the previous
 *     chunk are prepended to the next chunk so the embedding model doesn't
 *     lose context at chunk boundaries.
 *  3. Injects the nearest parent heading as a "context prefix" into each
 *     chunk so vector search results carry their section context.
 */

const MD_HEADING_RE = /^#{1,6}\s+/;

/**
 * Split text into chunks respecting Markdown structure with overlap.
 * @param text       Input text (ideally Markdown).
 * @param chunkSize  Max characters per chunk (default 1000).
 * @param overlap    Characters of overlap between consecutive chunks (default 200).
 */
export function splitTextIntoChunks(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200,
): string[] {
  if (!text || text.trim().length === 0) return [];

  // --- Phase 1: Split into heading-scoped sections ---
  const sections = splitByHeadings(text);

  // --- Phase 2: For each section, split into chunks ≤ chunkSize ---
  const rawChunks: string[] = [];
  for (const section of sections) {
    if (section.body.length <= chunkSize) {
      rawChunks.push(formatChunk(section.heading, section.body));
    } else {
      const subChunks = recursiveSplit(section.body, chunkSize);
      for (const sub of subChunks) {
        rawChunks.push(formatChunk(section.heading, sub));
      }
    }
  }

  // --- Phase 3: Apply overlap ---
  if (overlap <= 0 || rawChunks.length <= 1) return rawChunks;

  const overlapped: string[] = [rawChunks[0]];
  for (let i = 1; i < rawChunks.length; i++) {
    const prev = rawChunks[i - 1];
    const overlapText = prev.slice(-overlap);
    overlapped.push(overlapText + '\n' + rawChunks[i]);
  }

  return overlapped;
}

/* ── Internal helpers ──────────────────────────────────────── */

interface Section {
  heading: string; // e.g. "## Requirements" — empty for preamble text
  body: string;
}

/**
 * Split markdown into sections, each anchored by its heading.
 * Text before the first heading becomes a "preamble" section.
 */
function splitByHeadings(text: string): Section[] {
  const lines = text.split('\n');
  const sections: Section[] = [];
  let currentHeading = '';
  let currentBody: string[] = [];

  for (const line of lines) {
    if (MD_HEADING_RE.test(line)) {
      // Flush previous section
      if (currentBody.length > 0 || currentHeading) {
        sections.push({ heading: currentHeading, body: currentBody.join('\n').trim() });
      }
      currentHeading = line.trim();
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }

  // Flush last section
  if (currentBody.length > 0 || currentHeading) {
    sections.push({ heading: currentHeading, body: currentBody.join('\n').trim() });
  }

  return sections.filter(s => s.body.length > 0 || s.heading.length > 0);
}

/** Prefix chunk with its section heading for context. */
function formatChunk(heading: string, body: string): string {
  if (!heading) return body.trim();
  return `${heading}\n${body.trim()}`;
}

/**
 * Recursive split at progressively finer boundaries:
 *   paragraph → sentence → word → character
 */
function recursiveSplit(text: string, chunkSize: number): string[] {
  const separators = ['\n\n', '\n', '. ', ' ', ''];

  function doSplit(input: string, sepIdx: number): string[] {
    if (input.length <= chunkSize) return [input];

    const sep = separators[sepIdx];
    if (sep === undefined) {
      // Hard character split — last resort
      const parts: string[] = [];
      for (let i = 0; i < input.length; i += chunkSize) {
        parts.push(input.slice(i, i + chunkSize));
      }
      return parts;
    }

    const pieces = sep ? input.split(sep) : input.split('');
    const chunks: string[] = [];
    let current = '';

    for (const piece of pieces) {
      const candidate = current ? current + sep + piece : piece;

      if (candidate.length <= chunkSize) {
        current = candidate;
      } else {
        if (current) chunks.push(current);
        // If single piece exceeds chunkSize, recurse with finer separator
        if (piece.length > chunkSize) {
          const subs = doSplit(piece, sepIdx + 1);
          chunks.push(...subs.slice(0, -1));
          current = subs[subs.length - 1] || '';
        } else {
          current = piece;
        }
      }
    }

    if (current) chunks.push(current);
    return chunks;
  }

  return doSplit(text, 0);
}
