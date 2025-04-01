import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  ErrorMessage,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/AuthComponents";
import { apiRequest } from "../utills/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
      console.log("🟡 로그인 요청 시작...");
      const data = await apiRequest(
        "/api/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
        true
      ); // ✅ 로그인 요청 표시

      console.log("🟢 로그인 응답 데이터:", data);

      if (!data || !data.accessToken || !data.refreshToken) {
        console.error("🚨 서버에서 올바른 토큰을 받지 못함:", data);
        throw new Error("🚨 서버에서 유효한 토큰을 받지 못했습니다.");
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      setTimeout(() => {
        console.log(
          "✅ 저장된 액세스 토큰:",
          localStorage.getItem("accessToken")
        );
        console.log(
          "✅ 저장된 리프레시 토큰:",
          localStorage.getItem("refreshToken")
        );
        navigate("/");
      }, 0);
    } catch (err: unknown) {
      console.error("❌ 로그인 오류:", err);
      setErrorMessage(err instanceof Error ? err.message : "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>
        Make Today <br /> a <strong>LUCKY DAY</strong>
      </Title>
      <Form onSubmit={onSubmit}>
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
          type="submit"
          value={loading ? "로그인 중..." : "로그인"}
          disabled={loading}
        />
      </Form>
      {errorMessage !== "" ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
      <Switcher>
        계정이 없으신가요? <Link to={"/create-account"}>회원가입 &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
