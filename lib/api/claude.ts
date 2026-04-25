import Anthropic from "@anthropic-ai/sdk";

/**
 * Optional Claude "polish / tighten" layer for the final image prompt.
 *
 * Runs *after* the constraint engine and template constructor, *before* Gemini.
 * The model must not invent new procedures or undo TREATMENT IDENTITY LOCK.
 */
export interface PolishArgs {
  prompt: string;
  notes?: string;
}

const DEFAULT_MODEL = "claude-3-5-haiku-20241022";

export async function polishPrompt(args: PolishArgs): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return args.prompt;

  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model,
      max_tokens: 4096,
      system: `You are a clinical dental copy editor. You receive a pre-approved text prompt for a photorealistic dental clinical-outcome image generator.

Your job is ONLY to:
- Tighten wording, remove redundancy, and improve scanability
- Keep every clinical constraint: allowed changes, forbidden changes, and preservation rules must remain equivalent in meaning
- You MUST keep all section headers and the TREATMENT IDENTITY LOCK block; do not delete or relax constraints
- Do NOT add new teeth, materials, or procedures that are not already implied
- Do NOT add marketing language

Output the FULL revised prompt as plain text only. No preface, no markdown code fences.`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Revise the following prompt. Return the complete prompt only.${
                args.notes
                  ? `\n\nEditor notes: ${args.notes}`
                  : ""
              }\n\n---\n\n${args.prompt}`,
            },
          ],
        },
      ],
    });

    const block = message.content.find((b) => b.type === "text");
    if (block && block.type === "text" && block.text?.trim()) {
      return block.text.trim();
    }
  } catch (err) {
    console.error("[claude] polishPrompt failed, using original prompt:", err);
  }

  return args.prompt;
}
