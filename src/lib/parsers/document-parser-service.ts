import { DocumentParser, ParseResult, ParserOptions } from "./types";
import { ExcelParser } from "./excel-parser";
import { CSVParser } from "./csv-parser";

export class DocumentParserService {
  private parsers: DocumentParser[] = [];

  constructor() {
    // Register default parsers
    this.registerParser(new ExcelParser());
    this.registerParser(new CSVParser());
  }

  /**
   * Register a new parser
   */
  registerParser(parser: DocumentParser): void {
    this.parsers.push(parser);
  }

  /**
   * Get all supported file extensions
   */
  getSupportedExtensions(): string[] {
    const extensions = new Set<string>();
    this.parsers.forEach(parser => {
      parser.getSupportedExtensions().forEach(ext => extensions.add(ext));
    });
    return Array.from(extensions);
  }

  /**
   * Check if a file can be parsed
   */
  canParse(file: File): boolean {
    return this.parsers.some(parser => parser.canParse(file));
  }

  /**
   * Get the appropriate parser for a file
   */
  private getParser(file: File): DocumentParser | null {
    return this.parsers.find(parser => parser.canParse(file)) || null;
  }

  /**
   * Parse a file using the appropriate parser
   */
  async parse(file: File, options?: ParserOptions): Promise<ParseResult> {
    const parser = this.getParser(file);
    
    if (!parser) {
      const supportedExtensions = this.getSupportedExtensions().join(', ');
      throw new Error(`No parser found for file type. Supported extensions: ${supportedExtensions}`);
    }

    return parser.parse(file, options);
  }

  /**
   * Get parser information for a file
   */
  getParserInfo(file: File): { parser: DocumentParser; supportedExtensions: string[] } | null {
    const parser = this.getParser(file);
    
    if (!parser) {
      return null;
    }

    return {
      parser,
      supportedExtensions: parser.getSupportedExtensions()
    };
  }

  /**
   * Get all registered parsers
   */
  getRegisteredParsers(): DocumentParser[] {
    return [...this.parsers];
  }

  /**
   * Remove a parser by type
   */
  removeParser(parserType: new (...args: unknown[]) => DocumentParser): void {
    this.parsers = this.parsers.filter(parser => !(parser instanceof parserType));
  }

  /**
   * Clear all parsers
   */
  clearParsers(): void {
    this.parsers = [];
  }
}

// Export a singleton instance
export const documentParserService = new DocumentParserService(); 