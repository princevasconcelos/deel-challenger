import React, { useState, useEffect, useRef } from 'react';
// import type { Country } from '../../mock';
// import { allCountriesMock } from '../../mock';
import { MOCK, type Film } from '../../mock-films';

// import parse from './autosuggest-highlight/parse';
// import match from './autosuggest-highlight/match';

import './styles.css';

interface AutoCompleteProps {
    onSelect: (country: Film | null) => void;
}

export default function AutoComplete({ onSelect }: AutoCompleteProps) {
    const [countries, setCountries] = useState<Film[]>([]);
    const [filteredCountries, setFilteredCountries] = useState<Film[]>([]);
    const [query, setQuery] = useState<string>('');
    const [isLoading, setLoading] = useState(false);
    const [isFocused, setFocused] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState<number>(-1);
    const THREE_SECONDS = 3000;

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        return;
        if (!isFocused || countries.length > 0) return;

        setLoading(true);
        const tm = setTimeout(() => {
            setCountries(MOCK);
            setFilteredCountries(MOCK);
            setLoading(false);
        }, THREE_SECONDS);
        return () => clearTimeout(tm);
    }, [isFocused ]);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        return;
        const searchQuery = e.target.value;
        setQuery(searchQuery);

        if (searchQuery.trim() === '') {
            setFilteredCountries(countries);
            return;
        }

        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        const filtered = countries.filter((country) =>
            country.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCountries(filtered);
        setLoading(false);
        setHighlightIndex(-1);
    };

    const handleSelect = (film: Film) => {
        return;
        setQuery(film.title);
        setFilteredCountries([]);
        setFocused(false);
        onSelect(film);
    };

    const closeDropdown = (event: MouseEvent) => {
        return;
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setFocused(false);
        }
    };

    useEffect(() => {
        return;
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
                {!isLoading && query.length > 2 &&  <button className='clear-button'>X</button>}
            </div>

            {isFocused && <ul className="dropdown">
                {isLoading && filteredCountries.length === 0 && <li className='loading-item' key="loading">Loading...</li>}
                {isFocused && filteredCountries.map((film, index) => (
                    <li
                        key={`${film.title}-${film.year}`}
                        onClick={() => handleSelect(film)}
                        className={index === highlightIndex ? 'highlight' : ''}
                    >
                        <span style={{ marginLeft: '8px', color: '#333' }}>
                            {film.title}
                        </span>
                    </li>
                ))}
            </ul>}
        </div>
    );
}
