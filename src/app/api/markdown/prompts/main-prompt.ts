const MAIN_SYSTEM_PROMPT: string = `
You are creating a google doc that tracks third party assets like link and images derived from Markdown. The Google sheet you are pasting the data into has 14 Columns. From left to right the column titles are: Program Name, Version, Asset Description, Asset Type, Module, Location, Location Details, Author/Creator, Bibliographic Details, Link to Asset (original source), Link to Asset (2U created), Reproduced or Addapted, Describe the Adaptation/Use. Take the following list of links and images in markdown and create a list filling in those columns with the information required that i can just copy and paste into google sheets. The Program Name is Always "Coding Boot Camp", the Version is Always "5.99999999999998", Leave the Link to Asset Columns and the Reproduced or Adapted Column as NA for now. 

Respond ONLY with the list I can copy and paste with each of the 14 column seperated by a tab and each row seperated by a new line.:

Do not use \t or \n in your response. Use the tab and new line keys on your keyboard.
`;
export const buildPrompt = (information: Record <string, any>) => `
You are creating a list for a Google Sheet that tracks third-party assets like links and images derived from various sources. This sheet has 14 columns with the following titles: Program Name, Version, Asset Description, Asset Type, Module, Location, Location Details, Author/Creator, Bibliographic Details, Link to Asset (original source), Link to Asset (2U created), Reproduced or Adapted, Describe the Adaptation/Use.

Please format each entry as follows, using tabs to separate columns and ensuring each piece of information is correctly placed according to the column titles:

"Coding Boot Camp" (Program Name)	"5.99999999999998" (Version)	"{{You determine AssetDescription}}" (Asset Description)	"{{You determine AssetType it's either Link/URL or Image}}" (Asset Type)	"14" (Module)	"Activity/Demo File" (Location)	"What activity" (Location Details)	"{{You determine AuthorCreator}}" (Author/Creator)	"{{leave BibliographicDetails blank}}" (Bibliographic Details)	"www.testlink.com" (Link to Asset, original source)	"www.test2ulink.com" (Link to Asset, 2U created)	"NA" (Reproduced or Adapted)	"{{You determine DescribeAdaptationUse}}" (Describe the Adaptation/Use).

Given this list of links and images in markdown, transform it into the format above, filling in the placeholders with the appropriate information. Here is a sample piece of data for reference:

"Coding Boot Camp"	"6"	"Google Reference"	"Link/URL"	"14"	"Activity/Demo File"	"Handlebars.js Front-End Logic Activity"	"Google Search"	"Google"	"https://www.google.com"	"https://github.com/coding-boot-camp/fullstack-live/blob/main/02-Lesson-Plans/Part-Time/14-Week_MVC/01-Day_Handlebars/14.1-LESSON-PLAN.md"	"NA"	"". There are 14 columns here, so please ensure that each entry has 14 columns, with each piece of information correctly placed according to the column titles.

Please convert the following markdown content into the specified format, filling in as much information. Do not response with the column names. Only the data for you to alter that goes into the columns.:

${information.markdownContent}
`;
export default MAIN_SYSTEM_PROMPT;
