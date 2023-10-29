import { useState, useEffect, useRef, useMemo } from "react";
import "./App.css";
import { SortBy, type User } from "./types.d";
import { UsersList } from "./components/UsersList";
// https://app.quicktype.io/
// we copy the json to the site and make a types.d.ts with the interfaces n stuff
// useRef guarda un valor que queremos que se comparta entre renderizados.
// pero que al cambiar no vuelva a renderizar el componente.
function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState<boolean>(false);
  // const [sortByCountry, setSortByCountry] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);

  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  const originalUsers = useRef<User[]>([]);

  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const toggleSortByCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    setSorting(newSortingValue);
    // setSortByCountry((prev) => !prev);
  };

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => {
      // devuelve todos los items que no son iguales al email del usuario escogido
      return user.email !== email;
    });
    setUsers(filteredUsers);
  };

  const handleReset = () => {
    // utilizamos el useRef para resetear los items. useRef esta guardando
    // res.results en el useEffect.
    setUsers(originalUsers.current);
  };

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=10")
      .then(async (res) => await res.json())
      .then((res) => {
        setUsers(res.results);
        originalUsers.current = res.results;
      });
  }, []);

  // 1- primero ordenamos los usuarios
  // useMemo => lets you cache the result of a calculation between re-renders.
  const filteredUsers = useMemo(() => {
    return typeof filterCountry === "string" && filterCountry.length > 0
      ? users.filter(
          (user) =>
            user.location.country
              .toLowerCase()
              .includes(filterCountry.toLowerCase())
          // estamos filtrando los usuarios que tienen en country el mismo texto
          // que guardamos en filterCountry. Lo pasamos todo a lowercase!
        )
      : users;
    // esto solo se ejecuta cuando haya cambiado el users y filterCountry
  }, [users, filterCountry]);

  // si hemos de ordenar por pais hacemos el sort y si no devolvemos los usuarios.
  // ESTA MAL. sort muta el array original.
  // podemos hacer ⁡⁢⁣⁣[...users]⁡ para una copia del array.
  //⁡⁢⁣⁢ 𝘁𝗼𝗦𝗼𝗿𝘁𝗲𝗱⁡ !!!! cambios en el type.d.ts

  // 2- luego los filtramos. useMEMO 1:06 prueba 55k
  const sortedUsers = useMemo(() => {
    // El codigo antes de añadir el enum para ordenar por nombre apellido y country
    // return sorting === SortBy.COUNTRY
    //   ? filteredUsers.toSorted((a, b) =>
    //       a.location.country.localeCompare(b.location.country)
    //     )
    //   : filteredUsers;

    // el codigo despues del enum
    if (sorting === SortBy.COUNTRY) {
      return filteredUsers.toSorted((a, b) =>
        a.location.country.localeCompare(b.location.country)
      );
    }
    if (sorting === SortBy.NAME) {
      return filteredUsers.toSorted((a, b) =>
        a.name.first.localeCompare(b.name.first)
      );
    }
    if (sorting === SortBy.LAST) {
      return filteredUsers.toSorted((a, b) =>
        a.name.last.localeCompare(b.name.last)
      );
    }

    return filteredUsers;
  }, [filteredUsers, sorting]);

  return (
    <>
      <h1 className="p-8">Lista de usuarios</h1>

      <header>
        <button type="button" onClick={toggleColors}>
          Colorea las filas
        </button>
        <button type="button" onClick={toggleSortByCountry}>
          {sorting === SortBy.COUNTRY
            ? "No ordenar por país"
            : "Ordenar por país"}
        </button>
        <button type="button" onClick={handleReset}>
          Resetear Filas
        </button>
        <input
          type="text"
          placeholder="Filtra por pais"
          onChange={(e) => setFilterCountry(e.target.value)}
        />
      </header>
      <main>
        <UsersList
          changeSorting={handleChangeSort}
          deleteUser={handleDelete}
          users={sortedUsers}
          showColors={showColors}
        />
      </main>
    </>
  );
}

export default App;
