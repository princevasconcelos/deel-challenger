import React, { useState, useEffect, useRef } from 'react';
import type { Country } from '../../mock';
import { allCountriesMock } from '../../mock';

import './styles.css';

interface AutoCompleteProps {
    onSelect: (country: Country | null) => void;
}

export default function AutoComplete({ onSelect }: AutoCompleteProps) {
    const [countries, setCountries] = useState<Country[]>([]);
    const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
    const [query, setQuery] = useState<string>('');
    const [isLoading, setLoading] = useState(false);
    const [isFocused, setFocused] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState<number>(-1);
    const THREE_SECONDS = 3000;

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isFocused || countries.length > 0) return;

        setLoading(true);
        const tm = setTimeout(() => {
            setCountries(allCountriesMock);
            setFilteredCountries(allCountriesMock);
            setLoading(false);
        }, THREE_SECONDS);
        return () => clearTimeout(tm);
    }, [isFocused ]);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);

        if (searchQuery.trim() === '') {
            setFilteredCountries(countries);
            return;
        }

        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        const filtered = countries.filter((country) =>
            country.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCountries(filtered);
        setLoading(false);
        setHighlightIndex(-1);
    };

    const handleSelect = (country: Country) => {
        setQuery(country.name);
        setFilteredCountries([]);
        setFocused(false);
        onSelect(country);
    };

    const closeDropdown = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setFocused(false);
        }
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
                    placeholder="Choose a country"
                    className="autocomplete"
                />
                {isFocused && isLoading && <div className="spinner" />}
                {!isLoading && query.length > 2 &&  <button className='clear-button'>X</button>}
            </div>

            {isFocused && <ul className="dropdown">
                {isLoading && filteredCountries.length === 0 && <li className='loading-item' key="loading">Loading...</li>}
                {isFocused && filteredCountries.map((country, index) => (
                    <li
                        key={`${country.code}-${country.abbr}`}
                        onClick={() => handleSelect(country)}
                        className={index === highlightIndex ? 'highlight' : ''}
                    >
                        <img
                            loading="lazy"
                            width="20"
                            src={`https://flagcdn.com/w20/${country.abbr.toLowerCase()}.png`}
                            alt={`${country.name} flag`}
                        />
                        <span style={{ marginLeft: '8px', color: '#888' }}>
                            (+{country.code}) {country.name}
                        </span>
                    </li>
                ))}
            </ul>}
        </div>
    );
}
