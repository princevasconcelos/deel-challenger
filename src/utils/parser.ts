import type { MatchType } from "./match";

export type PartType = {
    highlight: boolean;
    text: string;
}

/**
 * The `parse` function is used to break a string into parts that can be highlighted or not.
 * 
 * For example:
 * Given the text "The Shawshank Redemption" and the matches [[14, 24]], it will return an array of objects representing each part of the string.
 * In this case, it will return: 
 * [{ "text": "The Shawshank ", "highlight": false }, { "text": "Redemption", "highlight": true }].
 * 
 * Another example:
 * Given the text "The Godfather Part II" and the query "God",
 * it will return: 
 * [{ "text": "The ", "highlight": false }, { "text": "God", "highlight": true }, { "text": "father Part II", "highlight": false }].
 */
export default function parse(text: string, matches: MatchType[]): PartType[] {
  const result = [];

  if (matches.length === 0) {
    result.push({
      text,
      highlight: false
    });
  } else if (matches[0][0] > 0) {
    result.push({
      text: text.slice(0, matches[0][0]),
      highlight: false
    });
  }

  matches.forEach((match, i) => {
    const startIndex = match[0];
    const endIndex = match[1];

    result.push({
      text: text.slice(startIndex, endIndex),
      highlight: true
    });

    if (i === matches.length - 1) {
      if (endIndex < text.length) {
        result.push({
          text: text.slice(endIndex, text.length),
          highlight: false
        });
      }
    } else if (endIndex < matches[i + 1][0]) {
      result.push({
        text: text.slice(endIndex, matches[i + 1][0]),
        highlight: false
      });
    }
  });

  return result;
};