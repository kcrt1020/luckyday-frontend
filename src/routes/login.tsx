import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  ErrorMessage,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

      // const API_URL = "http://172.20.0.3:8080";
      // const API_URL = "http://localhost:8081";

      console.log("✅ API 요청 주소:", API_URL); // ✅ 콘솔에서 요청 주소 확인

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("✅ email:", email, "password:", password);

      if (!response.ok) {
        throw new Error(
          (await response.json()).message || "Invalid email or password"
        );
      }

      // ✅ response.text() 사용 (JWT는 JSON이 아닌 문자열)
      const token = await response.text();
      console.log("✅ 로그인 토큰:", token);

      // 토큰을 저장
      localStorage.setItem("jwt", token);

      console.log("Login successful!", token);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else if (typeof err === "string") {
        setErrorMessage(err);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Log into LUCKY DAY</Title>
      <Form onSubmit={onSubmit}>
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
          value={loading ? "Logging in..." : "Log In"}
          disabled={loading}
        />
      </Form>
      {errorMessage !== "" ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
      <Switcher>
        Don't have an account?{" "}
        <Link to={"/create-account"}>Create one &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
