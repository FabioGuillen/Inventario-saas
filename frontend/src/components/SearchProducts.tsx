import { FaSearch } from "react-icons/fa";
interface SearchProductsProps {
  search: string;
  setSearch: (s: string) => void;
}
export const SearchProducts = ({ search, setSearch }: SearchProductsProps) => {
  return (
    <form className="flex-1 max-w-xl mx-3 hidden sm:flex">
      <div className="relative w-full">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar productos..."
          className="
              w-full pl-9 pr-3 py-2
              bg-[#121212]
              border border-[#2A2A2A]
              rounded-lg
              text-white text-sm
              outline-none
              focus:border-[#BB86FC]
              transition
            "
        />
      </div>
    </form>
  );
};
