import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Row, Tooltip, Typography } from "antd";
import { HeaderContentProps } from "./definitions";
import {
  LogoutOutlined,
  ReconciliationOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import LoginSignupModal from "../../../modals/LoginSignupModal";
import { useState } from "react";
import { title } from "../../../../package.json";
import classNames from "classnames";

export default function HeaderContent({
  auth,
  handleLogin,
  user,
  className,
}: HeaderContentProps & React.ComponentPropsWithRef<"div">) {
  const navigate = useNavigate();
  const [isLoginSignupModalOpen, setIsLoginSignupModalOpen] = useState(false);
  const handleCancel = () => setIsLoginSignupModalOpen(false);
  const HeaderContentClassNames = classNames("gap-y-4", className);
  return (
    <Row className={HeaderContentClassNames}>
      <Col
        xs={24}
        md={16}
        className="text-center leading-none lg:flex lg:justify-start lg:items-center gap-4"
      >
        <Typography.Title
          level={1}
          className="!mb-0 mt-0 leading-none text-4xl"
        >
          <Link
            to="/"
            className="text-white/95 font-enchant tracking-wider text-5xl"
          >
            {title}
          </Link>
        </Typography.Title>
        {user && (
          <div className="flex gap-4">
            <Button
              type="primary"
              onClick={() => navigate(`/create`)}
              // className="mt-4 lg:mt-0 lg:ml-4 leading-none"
            >
              <UserAddOutlined />
              New Character
            </Button>
            <Button type="primary" onClick={() => navigate(`/gm`)}>
              <ReconciliationOutlined />
              GM Portal
            </Button>
          </div>
        )}
      </Col>
      <Col
        xs={24}
        md={8}
        className="text-center flex md:justify-center items-baseline lg:items-center lg:justify-end gap-4 justify-center"
      >
        {user ? (
          <>
            <Typography.Text className="leading-none">
              {user.displayName || user.email}
            </Typography.Text>
            <Tooltip title="Logout of CODEX.QUEST" color="#3E3643">
              <Button
                type="primary"
                shape="circle"
                icon={<LogoutOutlined />}
                onClick={() => auth.signOut()}
                className="mt-4 lg:m-0 lg:ml-4 leading-none"
              />
            </Tooltip>
          </>
        ) : (
          <Button
            type="primary"
            onClick={() => setIsLoginSignupModalOpen(true)}
          >
            Log in / Sign up
          </Button>
        )}
      </Col>
      <LoginSignupModal
        handleCancel={handleCancel}
        isLoginSignupModalOpen={isLoginSignupModalOpen}
        handleLogin={handleLogin}
      />
    </Row>
  );
}
