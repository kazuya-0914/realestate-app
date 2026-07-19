import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      navigate("/properties");
    } catch {
      setErrorMessage("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card">
      <h1>ログイン</h1>

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
          パスワード
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

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <p className="form-footer">
        アカウントをお持ちでない方は <Link to="/signup">会員登録</Link>
      </p>
    </div>
  );
}

export default LoginPage;
