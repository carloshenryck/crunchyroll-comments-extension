import { useEffect } from "react";

export function Test() {
  useEffect(() => {
    console.log("teste");
  }, []);

  return <div>AOOO POTÊNCIA</div>;
}
