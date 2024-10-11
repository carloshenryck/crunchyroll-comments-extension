import { useState } from "react";
import "./style.css";
import { createPortal } from "react-dom";
import { ISeasons } from "../../types/ISeason";

export default function AddComments() {
  const [useSameNameForAllSeasons, setUseSameNameForAllSeasons] =
    useState<boolean>(false);
  const [betterAnimeName, setBetterAnimeName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  console.log(useSameNameForAllSeasons);

  const updateSeasons = () => {
    const seasons: ISeasons = JSON.parse(
      localStorage.getItem("seasons") ?? "{}"
    );
    const episodesList = document.querySelectorAll(
      ".playable-card-hover--preaw a"
    );
    const animeName =
      document.querySelector(".hero-heading-line h1")?.textContent ?? "";
    const firstEp = getEpisodeByTitle(
      episodesList[0]?.getAttribute("title") ?? ""
    );
    const lastEp = getEpisodeByTitle(
      episodesList[episodesList.length - 2]?.getAttribute("title") ?? ""
    );

    const prevState = Array.isArray(seasons[animeName])
      ? seasons[animeName].filter((season) => season.firstEp !== firstEp)
      : [];
    const updatedSeason = useSameNameForAllSeasons
      ? { betterAnimeName, firstEp, lastEp }
      : [...prevState, { betterAnimeName, firstEp, lastEp }];

    const updatedSeasons = {
      ...seasons,
      [animeName]: updatedSeason,
    };

    saveSeasons(updatedSeasons);
  };

  const saveSeasons = (season: ISeasons) => {
    localStorage.setItem("seasons", JSON.stringify(season));
  };

  const getEpisodeByTitle = (title: string): number => {
    const episode = title.match(/E(\d+)/)?.[1];
    return +(episode ?? -1);
  };

  return (
    <div className="add-comments-wrapper">
      <button onClick={() => setIsModalOpen(true)}>
        <div>Adicionar/editar comentários</div>
        <svg
          className="comments-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M216,48H40A16,16,0,0,0,24,64V224a15.85,15.85,0,0,0,9.24,14.5A16.13,16.13,0,0,0,40,240a15.89,15.89,0,0,0,10.25-3.78l.09-.07L83,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,224h0ZM216,192H80a8,8,0,0,0-5.23,1.95L40,224V64H216ZM88,112a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,32a8,8,0,0,1,8-8h64a8,8,0,1,1,0,16H96A8,8,0,0,1,88,144Z"></path>
        </svg>
      </button>

      {createPortal(
        <div
          onMouseDown={() => {
            setIsModalOpen(false);
            setBetterAnimeName("");
          }}
          className="comments-modal-wrapper"
          style={{
            opacity: `${isModalOpen ? "1" : "0"}`,
            pointerEvents: `${isModalOpen ? "all" : "none"}`,
          }}
        >
          <div onMouseDown={(e) => e.stopPropagation()}>
            <p>Adicionar/Editar comentários</p>
            <input
              value={betterAnimeName}
              onChange={(e) => setBetterAnimeName(e.currentTarget.value)}
              placeholder="Nome do anime"
              type="text"
            />
            <div className="checkbox">
              <input
                type="checkbox"
                id="useSameName"
                value={useSameNameForAllSeasons.toString()}
                onChange={(e) =>
                  setUseSameNameForAllSeasons(e.currentTarget.checked)
                }
              />
              <label htmlFor="useSameName">
                Mesmo nome para todas as temporadas
              </label>
            </div>
            <button
              disabled={betterAnimeName.length === 0}
              onClick={() => {
                updateSeasons();
                setIsModalOpen(false);
                setBetterAnimeName("");
              }}
            >
              Salvar
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
