import React, { useState, useEffect } from 'react';
import type { Country } from '../../mock';
import { allCountriesMock } from '../../mock';

interface AutoCompleteProps {
    onSelect: (country: Country | null) => void;
}

export default function AutoComplete({ onSelect }: AutoCompleteProps) {
    const [countries, setCountries] = useState<Country[]>([]);
    const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
    const [query, setQuery] = useState<string>('');
    const [isLoading, setLoading] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState<number>(-1);

    useEffect(() => {
        setLoading(true);

        const tm = setTimeout(() => {
            setCountries(allCountriesMock);
            setFilteredCountries(allCountriesMock);
            setLoading(false);
        }, 3000)
        return () => clearTimeout(tm);
    }, []);

    const handleInputChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        return;
        if (e.key === 'ArrowDown') {
            setHighlightIndex((prev) => Math.min(prev + 1, filteredCountries.length - 1));
        } else if (e.key === 'ArrowUp') {
            setHighlightIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && highlightIndex >= 0) {
            handleSelect(filteredCountries[highlightIndex]);
        }
    };

    const handleSelect = (country: Country) => {
        return;
        setQuery(country.name);
        setFilteredCountries([]);
        setHighlightIndex(-1);
        onSelect(country);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', width: '300px' }}>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Choose a country"
                style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                }}
            />
            {isLoading && <div style={{ marginTop: '4px' }}>Loading...</div>}
            {!isLoading && filteredCountries.length > 0 && (
                <ul
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        border: '1px solid #ccc',
                        backgroundColor: '#fff',
                        zIndex: 1000,
                        borderRadius: '4px',
                    }}
                >
                    {filteredCountries.map((country, index) => (
                        <li
                            key={`${country.code}-${country.abbr}`}
                            onClick={() => handleSelect(country)}
                            style={{
                                padding: '8px',
                                cursor: 'pointer',
                                backgroundColor:
                                    index === highlightIndex ? '#f0f0f0' : 'transparent',
                            }}
                            onMouseEnter={() => setHighlightIndex(index)}
                        >
                            <img
                                loading="lazy"
                                width="20"
                                src={`https://flagcdn.com/w20/${country.abbr.toLowerCase()}.png`}
                                alt={`${country.name} flag`}
                                />
                            {/* <span
                                dangerouslySetInnerHTML={{
                                    __html: country.name.replace(
                                        new RegExp(query, 'gi'),
                                        (match) => `<b>\${match}</b>`
                                    ),
                                }}
                            /> */}
                            <span style={{ marginLeft: '8px', color: '#888' }}>
                                (+${country.code}) {country.name}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
