import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ErrorMessage,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/AuthComponents";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "nickname") {
      setNickname(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (
      isLoading ||
      username === "" ||
      email === "" ||
      nickname === "" ||
      password === ""
    )
      return;

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ 추가
        body: JSON.stringify({ username, email, nickname, password }),
      });

      let data;
      try {
        data =
          response.headers.get("content-length") !== "0"
            ? await response.json()
            : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      navigate("/login");
    } catch (e) {
      console.error("Error:", e);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Join LUCKY DAY</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="username"
          value={username}
          placeholder="아이디"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="이메일"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="비밀번호"
          type="password"
          required
        />
        <Input
          onChange={onChange}
          name="nickname"
          value={nickname}
          placeholder="닉네임"
          type="text"
          required
        />
        <Input type="submit" value={isLoading ? "가입 중..." : "회원가입"} />
      </Form>
      {error !== "" ? <ErrorMessage>{error}</ErrorMessage> : null}
      <Switcher>
        이미 계정이 있나요? <Link to={"/login"}>로그인 &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
