import { Button, Space, Typography } from "antd";
import { Auth, User } from "firebase/auth";
import CreateCharacterModal from "./CreateCharacterModal";
import { useState } from "react";

const { Paragraph } = Typography;

type HeaderContentProps = {
  user: User | null;
  handleLogin: () => Promise<void>;
  auth: Auth;
};

export default function HeaderContent(props: HeaderContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  return (
    <header>
      {props.user ? (
        <Space align="center">
          <Button type="primary" onClick={showModal}>
            Create BFRPG Character
          </Button>
          <Paragraph>{props.user.displayName}</Paragraph>
          <Button type="link" onClick={() => props.auth.signOut()}>
            Log out
          </Button>
        </Space>
      ) : (
        <Button type="primary" onClick={props.handleLogin}>
          Log in with Google
        </Button>
      )}
      <CreateCharacterModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </header>
  );
}