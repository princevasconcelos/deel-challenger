const specialCharsRegex = /[.*+?^${}()|[\]\\]/g;
const wordCharacterRegex = /[a-z0-9_]/i;
const whitespacesRegex = /\s+/;

const removeDiacritics = (word: string) => {
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const escapeRegexCharacters = (str: string) => {
    return str.replace(specialCharsRegex, '\\$&');
}

export type MatchType = number[];

/**
 * The `match` function is used to find the position of a query string within a given text.
 * 
 * For example:
 * Given the text "The Shawshank Redemption" and the query "Redemption", it will return the start and end indexes of the match.
 * In this case, it will return [[14, 24]].
 * 
 * Another example:
 * Given the text "The Godfather Part II" and the query "God", it will return [[4, 7]].
 */
export default function match(text: string, query: string): MatchType[] {
    const options = {
        insideWords: true,
        findAllOccurrences: false,
    }

    const cleanedTextArray = Array.from(text).map((x) => removeDiacritics(x));
    let cleanedText = cleanedTextArray.join('');

    query = removeDiacritics(query);

    return (
        query
            .trim()
            .split(whitespacesRegex)
            .filter((word) => word.length > 0)
            .reduce((result, word) => {
                const wordLen = word.length;
                const prefix =
                    !options.insideWords && wordCharacterRegex.test(word[0]) ? '\\b' : '';
                const regex = new RegExp(prefix + escapeRegexCharacters(word), 'i');
                let occurrence;
                let index;

                occurrence = regex.exec(cleanedText);

                while (occurrence) {
                    index = occurrence.index;

                    const cleanedLength = cleanedTextArray
                        .slice(index, index + wordLen)
                        .join('').length;
                    const offset = wordLen - cleanedLength;

                    const initialOffset =
                        index - cleanedTextArray.slice(0, index).join('').length;

                    const indexes = [
                        index + initialOffset,
                        index + wordLen + initialOffset + offset
                    ];

                    if (indexes[0] !== indexes[1]) {
                        // @ts-ignore
                        result.push(indexes);
                    }

                    cleanedText =
                        cleanedText.slice(0, index) +
                        new Array(wordLen + 1).join(' ') +
                        cleanedText.slice(index + wordLen);

                    if (!options.findAllOccurrences) {
                        break;
                    }

                    occurrence = regex.exec(cleanedText);
                }

                return result;
            }, [])
            .sort((match1, match2) => match1[0] - match2[0])
    );
};