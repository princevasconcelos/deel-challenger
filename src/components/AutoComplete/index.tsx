import React, { useState, useEffect, useRef } from 'react';

import match, { type MatchType } from '../../utils/match';
import parse, { type PartType } from '../../utils/parser';
import debounce from '../../utils/debounce';

import { MOCK, type Film } from './mock';
import './styles.css';

export default function AutoComplete() {
    const [films, setFilms] = useState<Film[]>([]);
    const [filtered, setFiltered] = useState<Film[]>([]);
    const [query, setQuery] = useState<string>('');
    const [isLoading, setLoading] = useState(false);
    const [isFocused, setFocused] = useState(false);
    const ONE_SECONDS = 3000;
    const QUERY_DEBOUNCE_DELAY = 500;

    const containerRef = useRef<HTMLDivElement>(null);

    const getFilmsAsync = async () => {
        await new Promise((resolve) => {
            setFilms(MOCK);
            setFiltered(MOCK);
            resolve(true);
            setLoading(false)
        });
    }

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => getFilmsAsync(), ONE_SECONDS);
        return () => clearTimeout(timeout);
    }, []);

    const handleSelect = (film: Film) => {
        setQuery(film.title);
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

        const filtered = films.filter((country) =>
            country.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFiltered(filtered);
    }, QUERY_DEBOUNCE_DELAY);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = event.target.value;
        setQuery(searchQuery);
        debouncedHandleInputChange(searchQuery);
    };

    useEffect(() => {
        document.addEventListener('mousedown', closeDropdown);
        return () => {
            document.removeEventListener('mousedown', closeDropdown);
        };
    }, []);

    const handleFocus = () => {
        setFocused(true);
    };

    return (
        <div
            ref={containerRef}
            className="form"
            style={{ position: 'relative' }}
        >
            <div className='input-container'>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    placeholder="Choose a film"
                    className="autocomplete"
                />
                {isFocused && isLoading && <div className="spinner" />}
            </div>

            {isFocused && <ul className="dropdown">
                {isLoading && filtered.length === 0 && <li className='loading-item' key="loading">Loading...</li>}
                {isFocused && filtered.map(data => {
                    const queryMatches: MatchType[] = match(data.title, query);
                    const textParts: PartType[] = parse(data.title, queryMatches);
                    return (
                        <li
                            key={`${data.title}-${data.year}`}
                            onClick={() => handleSelect(data)}
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
