import { useEffect } from "react";
import "./style.css";

export default function Comments() {
  useEffect(() => {
    console.log("pegando os comentários...");
  }, []);

  return (
    <div className="comments-wrapper">
      <h2>Comentários</h2>
    </div>
  );
}
