import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Card, Col, Empty, Row } from "antd";
import { CharacterData, CharacterListProps } from "./types";
// import { User } from "firebase/auth";

export default function CharacterList({
  user,
  refreshCharacters,
}: CharacterListProps) {
  const [characters, setCharacters] = useState<CharacterData[]>([]);

  useEffect(() => {
    async function fetchCharacters() {
      if (user) {
        const uid = user.uid;
        const charactersCollectionRef = collection(
          db,
          `users/${uid}/characters`
        );
        const characterSnapshot = await getDocs(charactersCollectionRef);

        const characters = characterSnapshot.docs.map((doc) => {
          const data = doc.data() as CharacterData;
          data.id = doc.id;
          return data;
        });
        setCharacters(characters);
      }
      //  else {
      //   console.error("No user is currently logged in.");
      // }
    }

    fetchCharacters();
  }, [user, refreshCharacters]);

  return (
    <div>
      {characters.length ? (
        <Row justify={"space-evenly"}>
          {characters.map((character) => (
            <Col span={4} key={character.id}>
              <Card hoverable>
                <Card.Meta
                  title={character.name}
                  description={`${character.race} - ${character.class} - ${character.id}`}
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty />
      )}
    </div>
  );
}
