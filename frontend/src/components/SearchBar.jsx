export default function SearchBar({ value, onChange }) {
  return (
    <label className="search-field">
      Search the catalog
      <input
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
        placeholder="Title or author"
        type="search"
        value={value}
      />
    </label>
  );
}
