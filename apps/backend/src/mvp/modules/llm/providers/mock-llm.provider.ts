import { Injectable } from "@nestjs/common";
import { LlmProvider } from "./llm-provider.interface";

interface PromptSource {
  title: string;
  content: string;
}

@Injectable()
export class MockLlmProvider implements LlmProvider {
  async complete(prompt: string): Promise<string> {
    const questionMatch = prompt.match(/Question:\s*(.+)/);
    const question = questionMatch?.[1]?.trim() || "当前问题";
    const hasIndexedSources = !prompt.includes(
      "No indexed sources were found for this question.",
    );

    if (!hasIndexedSources) {
      return [
        `当前知识库里还没有命中与“${question}”直接相关的文档片段。`,
        "可以先补充资料，或换一种更贴近文档内容的问法再继续提问。",
      ].join("\n\n");
    }

    const sources = this.parseSources(prompt);
    const answer = this.buildGroundedAnswer(question, sources);

    return (
      answer ??
      [
        `我已经在当前知识库中检索了与“${question}”相关的内容。`,
        "现有片段可以作为回答依据，但还建议继续补充更完整的文档资料。",
      ].join("\n\n")
    );
  }

  async *stream(prompt: string): AsyncGenerator<string> {
    const content = await this.complete(prompt);
    const pieces = content.split("");

    for (const piece of pieces) {
      yield piece;
    }
  }

  private parseSources(prompt: string): PromptSource[] {
    const sourcesSection = prompt.split("Sources:\n")[1] ?? "";
    const blocks = sourcesSection
      .split(/\n\n(?=\[\d+\]\s)/)
      .map((block) => block.trim())
      .filter(Boolean);

    return blocks.map((block) => {
      const lines = block.split("\n").filter(Boolean);
      const title = lines[0]?.replace(/^\[\d+\]\s*/, "").trim() || "知识库片段";
      const content = lines.slice(1).join(" ").trim();

      return { title, content };
    });
  }

  private buildGroundedAnswer(
    question: string,
    sources: PromptSource[],
  ): string | null {
    const sentences = this.collectCandidateSentences(sources);
    if (sentences.length === 0) {
      return null;
    }

    const keywords = this.extractKeywords(question);
    const selected = sentences
      .map((sentence) => ({
        sentence,
        score: this.scoreSentence(sentence, keywords),
      }))
      .sort((a, b) => b.score - a.score)
      .filter((item) => item.score > 0);

    const prioritized = this.prioritizeSentences(
      question,
      selected.map((item) => item.sentence),
    );

    const bestSentences =
      prioritized.length > 0
        ? prioritized.slice(0, 2)
        : sentences.slice(0, Math.min(2, sentences.length));

    return [...new Set(bestSentences)].join("\n");
  }

  private collectCandidateSentences(sources: PromptSource[]): string[] {
    return sources
      .flatMap((source) =>
        source.content
          .split(/(?<=[。！？.!?])/)
          .map((sentence) => sentence.replace(/\s+/g, " ").trim())
          .filter((sentence) => sentence.length >= 8),
      )
      .slice(0, 12);
  }

  private extractKeywords(question: string): string[] {
    const chinesePhrases = question.match(/[\u4e00-\u9fa5]{2,}/g) ?? [];
    const latinWords = question.toLowerCase().match(/[a-z0-9-]{3,}/g) ?? [];
    const chineseNgrams = chinesePhrases.flatMap((phrase) =>
      this.toChineseNgrams(phrase),
    );

    return [...new Set([...chinesePhrases, ...chineseNgrams, ...latinWords])];
  }

  private scoreSentence(sentence: string, keywords: string[]): number {
    if (keywords.length === 0) {
      return 0;
    }

    return keywords.reduce((score, keyword) => {
      if (!sentence.includes(keyword)) {
        return score;
      }

      if (
        (sentence.includes("包括") || sentence.includes("常见")) &&
        (sentence.includes("指标") || sentence.includes("模型"))
      ) {
        return score + 4;
      }

      if (sentence.includes("包括") || sentence.includes("常见")) {
        return score + 3;
      }

      return score + 1;
    }, 0);
  }

  private prioritizeSentences(question: string, sentences: string[]): string[] {
    if (question.includes("指标")) {
      const metricSentences = sentences.filter((sentence) =>
        sentence.includes("指标"),
      );
      if (metricSentences.length > 0) {
        return metricSentences;
      }
    }

    if (question.includes("哪些") || question.includes("什么")) {
      const listLikeSentences = sentences.filter(
        (sentence) => sentence.includes("包括") || sentence.includes("常见"),
      );
      if (listLikeSentences.length > 0) {
        return listLikeSentences;
      }
    }

    return sentences;
  }

  private toChineseNgrams(phrase: string): string[] {
    const compact = phrase.replace(/[的了呢吗吧请问里提到哪些什么如何怎么是否]/g, "");
    const chars = [...compact];
    const grams: string[] = [];

    for (let size = 2; size <= 4; size += 1) {
      for (let index = 0; index <= chars.length - size; index += 1) {
        grams.push(chars.slice(index, index + size).join(""));
      }
    }

    return grams.filter((item) => item.length >= 2);
  }
}
