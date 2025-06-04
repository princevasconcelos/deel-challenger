import React, { useState, useEffect, useRef } from 'react';

import match, { type MatchType } from '../../utils/match';
import parse, { type PartType } from '../../utils/parser';
import debounce from '../../utils/debounce';

import { MOCK, type Film } from './mock';
import './styles.css';

export default function AutoComplete() {
    const [films, setFilms] = useState<Film[]>([]);
    const [error, setError] = useState<boolean>(false);
    const [filtered, setFiltered] = useState<Film[]>([]);
    const [query, setQuery] = useState<string>('');
    const [isLoading, setLoading] = useState(false);
    const [isFocused, setFocused] = useState(false);
    const GET_FILMS_REQUEST_DELAY = 3000;
    const QUERY_DEBOUNCE_DELAY = 1000;

    const containerRef = useRef<HTMLDivElement>(null);
    const abortController = useRef<AbortController | null>(null);

    const getFilmsAsync = async (signal: AbortSignal) => {
        return new Promise<Film[]>((resolve, reject) => {
            const timeout = setTimeout(() => {
                if (signal.aborted) {
                    reject("Request Aborted");
                } else {
                    resolve(MOCK);
                }
            }, GET_FILMS_REQUEST_DELAY);

            signal.addEventListener("abort", () => clearTimeout(timeout));
        });
    };

    const fetchFilms = async () => {
        abortController.current?.abort();
        abortController.current = new AbortController();
        const { signal } = abortController.current;

        setLoading(true);
        try {
            const data = await getFilmsAsync(signal);
            setFilms(data);
            setFiltered(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilms();
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', closeDropdown);
        return () => document.removeEventListener('mousedown', closeDropdown);
    }, []);

    useEffect(() => {
        if (error) setError(false);
    }, [query]);

    const handleItemSelected = (film: Film) => {
        setQuery(film.Title);
        setFiltered([]);
        setFocused(false);
    };

    const closeDropdown = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setFocused(false);
        }
    };

    const debouncedHandleInputChange = debounce(async (searchQuery: string) => {
        if (searchQuery.trim() === '') {
            setFiltered(films);
            return;
        }

        abortController.current?.abort();
        abortController.current = new AbortController();
        const { signal } = abortController.current;

        setLoading(true);
        try {
            const filtered = await new Promise<Film[]>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    if (signal.aborted) {
                        reject("Request Aborted");
                    } else {
                        resolve(
                            films.filter((film) =>
                                film.Title.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                        );
                    }
                }, 300);

                signal.addEventListener("abort", () => clearTimeout(timeout));
            });

            setError(Boolean(searchQuery) && filtered.length === 0);
            setFiltered(filtered);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, QUERY_DEBOUNCE_DELAY);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = event.target.value;
        setQuery(searchQuery);
        debouncedHandleInputChange(searchQuery);
    };

    const handleInputFocus = () => setFocused(true);

    return (
        <div
            ref={containerRef}
            className="form"
            style={{ position: 'relative' }}
        >
            {error && !isLoading && query && <p className='not-found'>No match found for <b>"{query}"</b></p>}
            <div className='input-container'>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder="Choose a film"
                    maxLength={25}
                    className="autocomplete"
                />
                {isFocused && isLoading && <div className="spinner" />}
            </div>

            {isFocused && <ul className="dropdown">
                {isFocused && !isLoading && filtered.map(data => {
                    const queryMatches: MatchType[] = match(data.Title, query);
                    const textParts: PartType[] = parse(data.Title, queryMatches);
                    return (
                        <li
                            key={`${data.Id}-${data.Title}`}
                            onClick={() => handleItemSelected(data)}
                        >
                            {textParts.map((part, partIndex) => (
                                <span
                                    key={partIndex}
                                    style={{
                                        fontWeight: part.highlight ? 'bold' : 'normal',
                                    }}
                                >
                                    {part.text}
                                </span>
                            ))}
                        </li>
                    )
                })}
            </ul>}
        </div>
    );
}
