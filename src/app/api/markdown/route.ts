import { NextResponse } from "next/server";
import { marked, Tokens } from "marked";
import fs from "fs";
import path from "path";
import OpenAi from "openai";
import { MAIN_SYSTEM_PROMPT } from "./prompts";

const openai = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

type ImageLinkToken = Tokens.Image | Tokens.Link;

export const parseMarkdown = () => {
  try {
    const filePath = path.join(process.cwd(), "test_markdown/README.md");
    const markdownFile = fs.readFileSync(filePath, "utf8");
    const imageLinkTokenList: ImageLinkToken[] = [];

    const tokens = marked.lexer(markdownFile);

    const recursiveFindImageLink = (tokens: any) => {
      for (const token of tokens) {
        if (token.type === "image" || token.type === "link") {
          imageLinkTokenList.push(token);
        } else if (token.tokens && token.tokens.length > 0) {
          recursiveFindImageLink(token.tokens);
        } else if (token.items && token.items.length > 0) {
          recursiveFindImageLink(token.items);
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

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: MAIN_SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(verifiedTokens) },
    ],
    model: "gpt-3.5-turbo",
  });

  for await (const message of chatCompletion.choices) {
    console.log(message.message);
  }

  return NextResponse.json(verifiedTokens);
}
