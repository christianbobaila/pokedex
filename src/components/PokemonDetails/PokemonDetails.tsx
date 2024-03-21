import { PokemonClient } from "pokenode-ts";
import { useEffect, useState, memo, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./PokemonDetails.css";

export const PokemonDetails = memo(() => {
  const params: any = useParams();
  const [pokemonDetails, setPokemonDetails]: [any, any] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchPokemonDetails = useCallback(async () => {
    const api = new PokemonClient();
    setIsLoading(true);

    await api
      .getPokemonByName(params.name)
      .then((data) => {
        setPokemonDetails(data);
        setIsLoading(false);
      })
      .catch((error) => setIsLoading(true));
  }, [params]);

  useEffect(() => {
    fetchPokemonDetails();
  }, []);

  return isLoading ? (
    "Loading..."
  ) : (
    <div className="pl-4 text-left">
      {pokemonDetails.name && (
        <>
          <p className="text-4xl font-bold mb-6">
            {pokemonDetails.name[0].toUpperCase() +
              pokemonDetails.name.slice(1)}
          </p>
          <img
            src={`https://img.pokemondb.net/artwork/avif/${pokemonDetails.name}.avif`}
            className="mr-4 rounded-3xl border-white border-4 float-right pokemon-avatar"
            width={150}
            height={150}
          />
          {(pokemonDetails.cries.latest || pokemonDetails.cries.legacy) && (
            <div className="section mb-4">
              <p className="section-title text-2xl mt-2 mb-2">Cries</p>
              {pokemonDetails.cries.latest && (
                <audio controls className="mb-2">
                  <source src={pokemonDetails.cries.latest} type="audio/ogg" />
                  <source src={pokemonDetails.cries.latest} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              {pokemonDetails.cries.legacy && (
                <audio controls>
                  <source src={pokemonDetails.cries.legacy} type="audio/ogg" />
                  <source src={pokemonDetails.cries.legacy} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}
          {pokemonDetails.abilities.length > 0 && (
            <div className="section mb-4">
              <p className="section-title text-2xl mt-2 mb-2">Abilities</p>
              <ol className="section-content pl-6">
                {pokemonDetails.abilities.map((item: any) => (
                  <li key={item.ability.name}>{item.ability.name}</li>
                ))}
              </ol>
            </div>
          )}
          {pokemonDetails.game_indices.length > 0 && (
            <div className="section mb-4">
              <p className="section-title text-2xl mt-2 mb-2">Versions</p>
              <table className="table-content text-left p-4">
                <thead>
                  <tr className="font-bold">
                    <td width={150}>Game Index</td>
                    <td width={150}>Name</td>
                  </tr>
                </thead>
                <tbody>
                  {pokemonDetails.game_indices.map((item: any) => (
                    <tr key={item.version.name}>
                      <td>{item.game_index}</td>
                      <td>{item.version.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
});
