import { useEffect, useState } from "react";
import "./style.css";
import { getEpisodeByTitle } from "../../utils/getEpisodeByTitle";
import { ISeason, ISeasons } from "../../types/ISeason";

export default function Comments() {
  const [errorMsg, setErrorMsg] = useState<string>();

  const fetchComments = async () => {
    const animeName =
      document.querySelector(".show-title-link h4")?.textContent ?? "";

    const episode = getEpisodeByTitle(
      document.querySelector(".erc-current-media-info h1")?.textContent ?? ""
    );

    const season = getSeasonDataFromStore(animeName, episode);

    if (!season) {
      setErrorMsg("Sem comentários configurado");
      return;
    }

    chrome.runtime.sendMessage(
      {
        action: "fetchComments",
        animeName: season.betterAnimeName,
        episode,
      },
      (response) => {
        if (!response.success) {
          setErrorMsg("Falhar ao obter comentários");
          return;
        }
      }
    );
  };

  const getSeasonDataFromStore = (
    animeName: string,
    episode: number
  ): ISeason | undefined => {
    const seasons: ISeasons = JSON.parse(
      localStorage.getItem("seasons") ?? "{}"
    );

    let season: ISeason | undefined;
    if (Array.isArray(seasons[animeName])) {
      season = seasons[animeName].find(
        (season) => episode >= season.firstEp && episode <= season.lastEp
      );
    } else {
      season = seasons[animeName];
    }

    return season;
  };

  useEffect(() => {
    setTimeout(() => {
      fetchComments();
    }, 2000);
  }, []);

  return (
    <div className="comments-wrapper">
      <h2>Comentários</h2>
      {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
}
