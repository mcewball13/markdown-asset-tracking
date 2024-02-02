import { NextResponse } from "next/server";
import { marked, Tokens } from "marked";
import fs from "fs";
import path from "path";
import OpenAi from "openai";
import { MAIN_SYSTEM_PROMPT } from "./prompts";
import { NextApiRequest, NextApiResponse } from "next";
import { buildPrompt } from "./prompts/main-prompt";

const openai = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

type ImageLinkToken = Tokens.Image | Tokens.Link;

interface MarkdownData {
  markdown: string;
}

export const parseMarkdown = (markdownData: MarkdownData) => {
  try {
    const filePath = path.join(process.cwd(), "test_markdown/README.md");
    const markdownFile = fs.readFileSync(filePath, "utf8");
    const imageLinkTokenList: ImageLinkToken[] = [];
    // console.log('markdownFile', markdownFile)
    const tokens = marked.lexer(markdownData.markdown);

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
    return imageLinkTokenList;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const data = await req.json();

    const verifiedTokens = parseMarkdown(data);
    console.log("verifiedTokens", verifiedTokens);

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        // { role: "system", content: MAIN_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildPrompt({
            markdownContent: JSON.stringify(verifiedTokens),
          }),
        },
      ],
      model: "gpt-4-1106-preview",
    });

    for await (const message of chatCompletion.choices) {
      console.log("response", message.message.content);
    }

    return NextResponse.json(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
