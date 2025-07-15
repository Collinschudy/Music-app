// "use client";
// import React, { useEffect, useState } from "react";
// import { FaMusic } from "react-icons/fa";

// export default function Home() {
//   const [token, setToken] = useState("");
//   const [albums, setAlbums] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     async function fetchToken() {
//       try {
//         const res = await fetch("/api/spotify-token");
//         const data = await res.json();
//         if (data.access_token) {
//           setToken(data.access_token);
//         } else {
//           console.error("Error getting token:", data);
//           setError("Failed to get Spotify token.");
//         }
//       } catch (err) {
//         console.error("Error fetching token:", err);
//         setError("Failed to get Spotify token.");
//       }
//     }

//     fetchToken();
//   }, []);

//   useEffect(() => {
//     if (!token) return;

//     async function fetchNewReleases() {
//       setLoading(true);
//       try {
//         const res = await fetch("https://api.spotify.com/v1/browse/new-releases", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();
//         console.log("New releases data:", data);

//         if (data.albums && data.albums.items) {
//           setAlbums(data.albums.items);
//           setError("");
//         } else {
//           console.error("Spotify API error or missing albums field:", data);
//           setError("Failed to fetch new releases from Spotify.");
//         }
//       } catch (err) {
//         console.error("Fetch new releases error:", err);
//         setError("Failed to fetch new releases from Spotify.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchNewReleases();
//   }, [token]);

//   return (
//     <div className="p-8 bg-black text-white min-h-screen">
//       <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
//         <FaMusic className="text-green-400" />
//         Welcome to Olahhh's Music
//       </h1>
//       <p className="text-gray-400 mb-6">Discover the latest Spotify new releases 🎧</p>

//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       {loading && <p className="text-gray-400 mb-4">Loading new releases...</p>}

//       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
//         {albums.map((album) => (
//           <div
//             key={album.id}
//             className="bg-gray-800 p-4 rounded-lg transform transition-transform hover:scale-101 hover:bg-gray-700"
//           >
//             <h2 className="text-lg font-semibold mb-2">{album.name}</h2>
//             <img
//               src={album.images[0]?.url || "/default-cover.jpg"}
//               alt={album.name}
//               className="rounded mb-2"
//             />
//             <p className="mb-2">By {album.artists.map((artist) => artist.name).join(", ")}</p>
//             <a
//               href={album.external_urls.spotify}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-green-400"
//             >
//               Open Album on Spotify
//             </a>

//             {/* Embed Spotify album player */}
//             <div className="mt-4">
//               <iframe
//                 src={`https://open.spotify.com/embed/album/${album.id}`}
//                 width="100%"
//                 height="80"
//                 frameBorder="0"
//                 allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
//                 loading="lazy"
//                 className="rounded"
//               ></iframe>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useEffect, useState } from "react";
import { FaMusic, FaSearch } from "react-icons/fa";

export default function Home() {
  const [token, setToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch("/api/spotify-token");
        const data = await res.json();
        if (data.access_token) {
          setToken(data.access_token);
        } else {
          console.error("Error getting token:", data);
          setError("Failed to get Spotify token.");
        }
      } catch (err) {
        console.error("Fetch token error:", err);
        setError("Failed to get Spotify token.");
      }
    }

    fetchToken();
  }, []);

  useEffect(() => {
    if (!token) return;

    async function fetchNewReleases() {
      setLoading(true);
      try {
        const res = await fetch("https://api.spotify.com/v1/browse/new-releases?country=US", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("New releases data:", data);

        if (data.albums && data.albums.items) {
          setAlbums(data.albums.items);
          setFilteredAlbums(data.albums.items);
          setError("");
        } else {
          console.error("Spotify API error or missing albums field:", data);
          setError("Failed to fetch new releases from Spotify.");
        }
      } catch (err) {
        console.error("Fetch new releases error:", err);
        setError("Failed to fetch new releases from Spotify.");
      } finally {
        setLoading(false);
      }
    }

    fetchNewReleases();
  }, [token]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = albums.filter((album) => {
      const albumName = album.name.toLowerCase();
      const artistNames = album.artists.map((artist) => artist.name.toLowerCase()).join(", ");
      return albumName.includes(query) || artistNames.includes(query);
    });
    setFilteredAlbums(filtered);
  }, [searchQuery, albums]);

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
        <FaMusic className="text-green-400" />
        Welcome to Olahhh's Music
      </h1>
      <p className="text-gray-400 mb-6">Discover the latest Spotify new releases 🎧</p>

      <div className="flex items-center mb-6 bg-gray-800 rounded-lg p-2">
        <FaSearch className="text-gray-400 ml-2" />
        <input
          type="text"
          placeholder="Search albums or artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent ml-2 w-full focus:outline-none placeholder-gray-400 text-white"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-400 mb-4">Loading new releases...</p>}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            className="bg-gray-800 p-4 rounded-lg transform transition-transform hover:scale-101 hover:bg-gray-700"
          >
            <h2 className="text-lg font-semibold mb-2">{album.name}</h2>
            <img
              src={album.images[0]?.url || "/default-cover.jpg"}
              alt={album.name}
              className="rounded mb-2"
            />
            <p className="mb-2">By {album.artists.map((artist) => artist.name).join(", ")}</p>
            <a
              href={album.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400"
            >
              Open Album on Spotify
            </a>

            <div className="mt-4">
              <iframe
                src={`https://open.spotify.com/embed/album/${album.id}`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded"
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
