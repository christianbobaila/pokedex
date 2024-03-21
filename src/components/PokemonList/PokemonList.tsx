import { PokemonClient } from "pokenode-ts";
import { useEffect, useState, memo, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";

interface PokemonList {
  name: string;
  types: Array<string>;
  url: string;
}

export const PokemonList = memo(() => {
  const api = new PokemonClient();

  const params: any = useParams();
  const navigate = useNavigate();
  const [pokemonList, setPokemonList]: [Array<PokemonList>, any] = useState([]);
  const [searchFieldValue, setSearchFieldValue]: [string, any] = useState("");
  const [selectTypeValue, setSelectTypeValue]: [string, any] = useState("");
  const [pokemonTypes, setPokemonTypes]: [Array<any>, any] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [filteredPokemonList, setFilteredPokemonList]: [
    Array<PokemonList>,
    any
  ] = useState([]);
  const [paginatedPokemonList, setPaginatedPokemonList]: [
    Array<PokemonList>,
    any
  ] = useState([]);
  const [pageCount, setPageCount]: [number, any] = useState(0);
  const [itemOffset, setItemOffset]: [number, any] = useState(0);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;

  const searchFilter = (event: any) => {
    const searchTerm = event.target.value;
    navigate("/" + searchTerm);
    setData(searchTerm);
    setSelectTypeValue("");
  };

  const selectType = (event: any) => {
    const {
      target: { value },
    } = event;
    const filteredList = pokemonList.filter(
      (item: { name: String; types: Array<string> }) =>
        item.types.indexOf(value) !== -1
    );
    navigate("/");
    setSelectTypeValue(value);
    setSearchFieldValue("");
    setCombinedFilteredPokemonList(filteredList);
  };

  const setCombinedFilteredPokemonList = useCallback(
    (filteredList: Array<{}>) => {
      setFilteredPokemonList(filteredList);
      setPageCount(Math.ceil(filteredList.length / itemsPerPage));
      setPaginatedPokemonList(filteredList.slice(itemOffset, endOffset));
      setItemOffset(0);
    },
    [pokemonList]
  );

  const setData = useCallback(
    (searchTerm: any) => {
      const filteredList = pokemonList.filter(
        (item: { name: string; url: string }): boolean => {
          return item.name
            .trim()
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase());
        }
      );
      setCombinedFilteredPokemonList(filteredList);
    },
    [pokemonList]
  );

  const fetchPokemons = useCallback(async () => {
    setIsLoading(true);

    await api
      .listPokemons(0, 1302)
      .then((data) => {
        const { results } = data;
        setPokemonList(results);
        setFilteredPokemonList(results);
        setPaginatedPokemonList(results.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(results.length / itemsPerPage));
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  const fetchAllPokemonTypes = useCallback(async () => {
    let numberOfResolvedPromises = 0;
    setIsLoadingTypes(true);
    pokemonTypes.map((type: { url: string }, index: number) => {
      axios.get(type.url).then((response) => {
        const {
          data: { name, pokemon },
        } = response;
        pokemon.map((pokemonEntry: { pokemon: { name: string } }) => {
          const { pokemon } = pokemonEntry;
          const pokemonName = pokemon.name;
          pokemonList.map((item: { name: string; types: Array<string> }) => {
            if (typeof item.types !== "undefined") {
              if (item.name === pokemonName) {
                item.types.push(name);
              }
            } else {
              item.types = [];
            }
          });
        });
        numberOfResolvedPromises++;
        if (numberOfResolvedPromises === pokemonTypes.length) {
          setIsLoadingTypes(false);
        }
      });
    });
  }, [pokemonTypes, pokemonList]);

  const fetchPokemonTypes = useCallback(async () => {
    await api
      .listTypes(0, 100)
      .then((data) => {
        const { results } = data;
        setPokemonTypes(results);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  const handlePageClick = useCallback(
    (event: any) => {
      const newOffset =
        (event.selected * itemsPerPage) % filteredPokemonList.length;
      setItemOffset(newOffset);
    },
    [filteredPokemonList]
  );

  useEffect(() => {
    fetchPokemons();
    fetchPokemonTypes();
  }, []);

  useEffect(() => {
    fetchAllPokemonTypes();
  }, [pokemonTypes]);

  useEffect(() => {
    if (!!params.searchTerm) {
      setData(params.searchTerm);
    }
  }, [pokemonList]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setPaginatedPokemonList(filteredPokemonList.slice(itemOffset, endOffset));
  }, [itemOffset, itemsPerPage]);

  return isLoading ? (
    "Loading..."
  ) : (
    <>
      <div className="filter-container mx-auto w-100 flex my-4 mx-4 border-b-2 pb-4">
        <input
          type="text"
          onChange={searchFilter}
          className="block w-50 flex-1 rounded-md border-0 py-1.5 pl-7 pr-20 bg-gray-200 text-gray-600 ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Pokemon name..."
          // defaultValue={params.searchTerm || ""}
          value={params.searchTerm || searchFieldValue}
        ></input>
        <select
          className="ml-2 block w-50 flex-1 bg-gray-200 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={selectType}
          disabled={isLoadingTypes}
          value={selectTypeValue}
        >
          <option value="">Select Pokemon Type</option>
          {pokemonTypes.map((item: { name: string; url: string }) => (
            <option value={item.name} key={item.name}>
              {item.name[0].toUpperCase() + item.name.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {paginatedPokemonList.length > 0 && (
        <>
          <ul className="my-4">
            {paginatedPokemonList.map((item: { url: string; name: string }) => (
              <li
                key={item.url}
                className="block w-50 my-4 bg-gray-200 p-4 text-left cursor-pointer"
              >
                <Link to={`pokemon/${item.name}`} className="flex">
                  <img
                    src={`https://img.pokemondb.net/artwork/avif/${item.name}.avif`}
                    className="w-10 h-10 mr-4 rounded-3xl border-white border-4"
                  />
                  <span className="mt-2 font-bold">
                    {item.name[0].toUpperCase() + item.name.slice(1)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      <ReactPaginate
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="<"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
});
