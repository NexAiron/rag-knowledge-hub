export interface ParsedDocumentBlock {
  title?: string;
  content: string;
  page?: number | null;
  section?: string | null;
  order: number;
}

export interface ParsedDocument {
  title: string;
  content: string;
  blocks: ParsedDocumentBlock[];
}
