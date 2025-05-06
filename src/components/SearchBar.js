import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex">
      <input
        type="text"
        placeholder="Search songs, artists..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 p-2 rounded-l border border-gray-300"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 rounded-r hover:bg-green-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
