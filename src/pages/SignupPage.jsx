import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    setIsSubmitting(true);

    try {
      const { needsEmailConfirmation } = await signUp(email, password);

      if (needsEmailConfirmation) {
        setInfoMessage("確認メールを送信しました。メール内のリンクから登録を完了してください。");
      } else {
        navigate("/properties");
      }
    } catch {
      setErrorMessage("会員登録に失敗しました。入力内容を確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card">
      <h1>会員登録</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="form-label">
          メールアドレス
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="form-label">
          パスワード（6文字以上）
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        {errorMessage && <p className="form-error">{errorMessage}</p>}
        {infoMessage && <p className="form-info">{infoMessage}</p>}

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "登録中..." : "会員登録"}
        </button>
      </form>

      <p className="form-footer">
        既にアカウントをお持ちの方は <Link to="/login">ログイン</Link>
      </p>
    </div>
  );
}

export default SignupPage;
