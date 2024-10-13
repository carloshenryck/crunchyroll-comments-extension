import { useEffect, useState } from "react";
import "./style.css";
import { getEpisodeByTitle } from "../../utils/getEpisodeByTitle";
import { ISeason, ISeasons } from "../../types/ISeason";
import { IComment, ICommentsData } from "../../types/ICommentsData";
import { Comment } from "../Comment";

export default function Comments() {
  const [commentsData, setCommentsData] = useState<ICommentsData>();
  const [isLoading, setIsLoading] = useState(true);
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
          setIsLoading(false);
          return;
        }

        console.log(response.data.response);

        setCommentsData({
          ...response.data,
          response: organizeComments(response.data.response),
        });
        setIsLoading(false);
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

  function organizeComments(comments: IComment[]): IComment[] {
    // Crie um mapa para acessar rapidamente os comentários pelo ID
    const commentMap = new Map<string, IComment>();
    comments.forEach((comment) => {
      commentMap.set(comment.id, comment);
    });

    // Função auxiliar para encontrar o pai de um comentário
    const findParent = (
      commentId: string | undefined
    ): IComment | undefined => {
      if (!commentId) return;
      return commentMap.get(commentId);
    };

    // Função para organizar os comentários recursivamente
    const organize = (comment: IComment): IComment => {
      const parent = findParent(comment.parent?.toString());
      if (parent) {
        if (!parent.replies) {
          parent.replies = [];
        }
        parent.replies.push(comment);
      }
      if (comment.replies) {
        comment.replies = comment.replies.map(organize);
      }
      return comment;
    };

    // Organize cada comentário e retorne o array com a estrutura hierárquica
    return comments.map(organize).filter((comment) => comment.parent === null);
  }

  useEffect(() => {
    setTimeout(() => {
      fetchComments();
    }, 2000);
  }, []);

  return (
    <div className="comments-session">
      <h2>Comentários</h2>
      {errorMsg && <p>{errorMsg}</p>}
      {isLoading && <p>Carregando...</p>}
      <div className="comments-wrapper">
        {commentsData?.response.map((comment) => (
          <Comment comment={comment} nestedLevel={0} />
        ))}
      </div>
    </div>
  );
}
