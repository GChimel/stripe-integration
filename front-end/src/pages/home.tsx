import { useEffect, useState } from "react";
import { IUser } from "../entities/IUser";
import { useAuth } from "../hooks/useAuth";
import { httpClient } from "../services/httpClient";

export function Home() {
  const { signOut } = useAuth();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await httpClient.get("/user");
        setUsers(data.users);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  console.log(users);

  return (
    <div className="w-screen h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button
          onClick={signOut}
          className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-100"
        >
          Sign Out
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 bg-gray-50 overflow-auto">
        {loading ? (
          <h1 className="text-center text-lg font-semibold">Loading...</h1>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Subscription Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      {user.stripeSubscriptionStatus || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
}
