const MAIN_SYSTEM_PROMPT: string = `
You are creating a google doc that tracks third party assets like link and images derived from a Markdown Document. The Google sheet you are pasting the data into has 14 Columns. From left to right the column titles are: Program Name, Version, Asset Description, Asset Type, Module, Location, Location Details, Author/Creator, Bibliographic Details, Link to Asset (original source), Link to Asset (2U created), Reproduced or Addapted, Describe the Adaptation/Use. Take the following list of links and images in markdown and create a list filling in those columns with the information required that i can just copy and paste into google sheets. The Program Name is Always "Coding Boot Camp", the Version is Always "5.99999999999998", Leave the Link to Asset Columns and the Reproduced or Adapted Column as NA for now. 

Respond ONLY with the list I can copy and paste:
`

export default MAIN_SYSTEM_PROMPT;
