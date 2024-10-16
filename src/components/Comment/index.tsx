import { ReactPortal, useEffect, useState } from "react";
import { IComment } from "../../types/ICommentsData";
import { timeAgo } from "../../utils/timeAgo";
import "./style.css";
import { createPortal } from "react-dom";
import { waitForElement } from "../../utils/waitForElement";
import { LinkImage } from "../LinkImage";

interface Props {
  comment: IComment;
  nestedLevel: number;
  replyingTo?: string;
}

export function Comment({ comment, nestedLevel, replyingTo }: Props) {
  const NESTING_LIMIT = 3;
  const { replies, author, createdAt, message, isDeleted, media, id } = comment;
  const [portals, setPortals] = useState<ReactPortal[]>();

  const nestingLevel =
    nestedLevel > NESTING_LIMIT ? NESTING_LIMIT : nestedLevel;

  const formatMessage = (message: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(message, "text/html");

    const images = Array.from(doc.querySelectorAll("a")).filter((link) =>
      link.href.startsWith("https://uploads.disquscdn.com/images")
    );

    images.forEach((image, index) => {
      const next = image.nextElementSibling;
      if (next?.nodeName === "BR") {
        next.remove();
      }

      const div = document.createElement("div");
      div.setAttribute("id", `image-link-${index}-${id}`);

      image.insertAdjacentElement("beforebegin", div);
      image.remove();
    });

    return doc.body.innerHTML;
  };

  const addImageLink = async () => {
    if (media.length === 0) return;
    await waitForElement(`#image-link-0-${id}`);
    const portals: ReactPortal[] = [];
    media.forEach((img, index) => {
      const div = document.querySelector(`#image-link-${index}-${id}`);
      if (!div) return;
      portals.push(createPortal(<LinkImage href={img.resolvedUrl} />, div));
    });

    setPortals(portals);
  };

  useEffect(() => {
    addImageLink();
  }, []);

  return (
    <div className="comment-wrapper">
      <div
        className="comment"
        style={{
          paddingLeft: `${4.25 * nestingLevel}rem`,
        }}
      >
        <img
          src={`https://disqus.com/api/users/avatars/${author.username}.jpg`}
          alt=""
        />
        <div>
          {!isDeleted && (
            <p className="comment-header">
              {author.name}
              {replyingTo && (
                <div className="reply">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M232.49,112.49l-48,48a12,12,0,0,1-17-17L195,116H128a84.09,84.09,0,0,0-84,84,12,12,0,0,1-24,0A108.12,108.12,0,0,1,128,92h67L167.51,64.48a12,12,0,0,1,17-17l48,48A12,12,0,0,1,232.49,112.49Z"></path>
                  </svg>
                  <span>{replyingTo}</span>
                </div>
              )}
            </p>
          )}
          {isDeleted ? (
            <p className="deleted-comment">Esse comentário foi apagado</p>
          ) : (
            <>
              <p className="created-at">{timeAgo(createdAt)}</p>
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: formatMessage(message) }}
              ></div>
            </>
          )}
        </div>
      </div>

      {portals}

      {replies?.map((reply) => (
        <Comment
          comment={reply}
          nestedLevel={nestedLevel + 1}
          replyingTo={author.name}
        />
      ))}
    </div>
  );
}
