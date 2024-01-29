import { NextResponse } from "next/server";
import { marked, TokensList, Tokens } from "marked";
import fs from "fs";
import path from "path";

type ImageLinkToken = Tokens.Image[] | Tokens.Link[];

export const parseMarkdown = () => {
  try {
    const filePath = path.join(process.cwd(), "test_markdown/test.md");
    const markdownFile = fs.readFileSync(filePath, "utf8");
    const imageLinkTokenList: ImageLinkToken = [];

    const tokens = marked.lexer(markdownFile);

    const recursiveFindImageLink = (tokens: any) => {
        for (const token of tokens) {
            if (token.type === "image" || token.type === "link") {
                imageLinkTokenList.push(token);
            } else if (token.tokens && token.tokens.length > 0) {
                recursiveFindImageLink(token.tokens);
            }
        }
    };
    recursiveFindImageLink(tokens);
    console.log(imageLinkTokenList);

    return imageLinkTokenList;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export async function GET() {
  const verifiedTokens = parseMarkdown();
  return NextResponse.json(verifiedTokens);
}
