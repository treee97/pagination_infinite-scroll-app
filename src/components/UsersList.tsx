import { SortBy, type User } from "../types.d";

interface Props {
  changeSorting: (sort: SortBy) => void;
  users: User[];
  showColors: boolean;
  deleteUser: (email: string) => void;
}

export const UsersList = ({
  users,
  showColors,
  deleteUser,
  changeSorting,
}: Props) => {
  const colorClasses = {
    even: "bg-slate-200",
    odd: "bg-slate-500",
  };
  return (
    <table width="100%">
      <thead>
        <tr>
          <th>Foto</th>
          <th
            className="cursor-pointer"
            onClick={() => changeSorting(SortBy.NAME)}
          >
            Nombre
          </th>
          <th
            className="cursor-pointer"
            onClick={() => changeSorting(SortBy.LAST)}
          >
            Apellido
          </th>
          <th
            className="cursor-pointer"
            onClick={() => changeSorting(SortBy.COUNTRY)}
          >
            País
          </th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => {
          // toggle color with tailwind
          const backgroundColor =
            index % 2 === 0 ? colorClasses.even : colorClasses.odd;
          const color = showColors ? backgroundColor : "transparent";

          return (
            // user.id.value
            <tr key={user.email} className={color}>
              <td>
                <img src={user.picture.thumbnail} alt="user" />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button type="button" onClick={() => deleteUser(user.email)}>
                  Borrar
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
