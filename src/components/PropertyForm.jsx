import { useState } from "react";

const LAYOUT_OPTIONS = ["1R", "1K", "1DK", "1LDK", "2K", "2DK", "2LDK", "3LDK", "4LDK以上"];

// 新規登録・編集の両方で使うフォーム。initialValuesがあれば編集モードとして値を初期表示する
function PropertyForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [rent, setRent] = useState(initialValues?.rent ?? "");
  const [area, setArea] = useState(initialValues?.area ?? "");
  const [layout, setLayout] = useState(initialValues?.layout ?? LAYOUT_OPTIONS[3]);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ name, rent: Number(rent), area, layout });
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <label className="form-label">
        物件名
        <input
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="form-label">
        家賃（円）
        <input
          type="number"
          className="form-input"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          required
          min={0}
        />
      </label>

      <label className="form-label">
        エリア名
        <input
          className="form-input"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
        />
      </label>

      <label className="form-label">
        間取り
        <select className="form-input" value={layout} onChange={(e) => setLayout(e.target.value)}>
          {LAYOUT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className="property-form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          キャンセル
        </button>
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : "保存"}
        </button>
      </div>
    </form>
  );
}

export default PropertyForm;
