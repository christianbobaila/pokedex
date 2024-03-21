import "./App.css";
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div className="bg-gray-100 flex-1">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <Link to="/" className="flex">
                  <img
                    className="h-9 w-auto "
                    src="/src/assets/pokedex.png"
                    alt="Your Company"
                  />
                  <span className="ml-3 text-3xl">Pokedex</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="p-4 text-black">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
