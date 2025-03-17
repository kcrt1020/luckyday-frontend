import React, { useState } from "react";
import styled from "styled-components";
import { apiRequest } from "../utills/api";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 600px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  background-color: black;
  color: white;
  resize: none;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #81c147;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #81c147;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #81c147;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #81c147;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostCloverForm() {
  const [isLoading, setLoading] = useState(false);
  const [clover, setClover] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClover(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || clover === "" || clover.length > 180) return;

    try {
      setLoading(true);

      const formData = new FormData();
      const cloverData = JSON.stringify({ content: clover });
      formData.append(
        "content",
        new Blob([cloverData], { type: "application/json" })
      );

      if (file) {
        formData.append("file", file);
      }

      // ✅ API 요청 (apiRequest 사용)
      const response = await apiRequest("/api/clovers", {
        method: "POST",
        body: formData,
      });

      if (!response) {
        console.error("❌ [트윗 작성 실패]: 서버 응답 없음");
        throw new Error("트윗 작성 실패: 서버 응답이 없습니다.");
      }

      console.log("✅ [트윗 작성 성공]:", response);

      setClover("");
      setFile(null);

      // ✅ 트윗이 등록되면 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error("❌ [트윗 작성 오류]", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={clover}
        placeholder="무슨 일이야?"
        required
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "Posting..." : "Post Clover"}
      />
    </Form>
  );
}
