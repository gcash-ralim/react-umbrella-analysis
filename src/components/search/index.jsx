// to take three props: search (state variable representing city value), setSearch (to update search state), handleSearch (triggers search action or API call)
export default function Search({search, setSearch, handleSearch}) {
    return (
        // will house the search bar and button
        <div className="search-bar">
            <input
                type="text"
                placeholder="Please enter city name"
                name="search"
                value={search}      // binds input field to the search state
                onChange={(event) => setSearch(event.target.value)}     // handles event when user inputs something wherein it calls setSearch function with input value and then update state accordingly
            />
            <button onClick={handleSearch}>
                Search City
            </button>
        </div>
    );
}