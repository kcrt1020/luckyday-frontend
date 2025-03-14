import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ErrorMessage,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || username === "" || email === "" || password === "") return;

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ 추가
        body: JSON.stringify({ username, email, password }),
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
          placeholder="Name"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <ErrorMessage>{error}</ErrorMessage> : null}
      <Switcher>
        Already have an account? <Link to={"/login"}>Log in &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
