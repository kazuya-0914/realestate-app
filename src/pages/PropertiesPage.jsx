import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import PropertyForm from "../components/PropertyForm";
import { useAuth } from "../contexts/useAuth";
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from "../lib/propertiesApi";

function PropertiesPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await fetchProperties();
      setProperties(data);
    } catch {
      setErrorMessage("物件の取得に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  function handleAddClick() {
    setEditingProperty(null);
    setIsFormOpen(true);
  }

  function handleEditClick(property) {
    setEditingProperty(property);
    setIsFormOpen(true);
  }

  function handleCancelForm() {
    setIsFormOpen(false);
    setEditingProperty(null);
  }

  async function handleFormSubmit(values) {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (editingProperty) {
        await updateProperty(editingProperty.id, values);
      } else {
        await createProperty({ ...values, userId: user.id });
      }
      setIsFormOpen(false);
      setEditingProperty(null);
      await loadProperties();
    } catch {
      setErrorMessage("保存に失敗しました。入力内容を確認してください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("この物件を削除しますか？")) return;

    try {
      await deleteProperty(id);
      await loadProperties();
    } catch {
      setErrorMessage("削除に失敗しました。");
    }
  }

  return (
    <div className="card properties-card">
      <div className="properties-header">
        <div>
          <h1>物件一覧</h1>
          <p className="logged-in-as">{user?.email} でログイン中</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={handleLogout}>
          ログアウト
        </button>
      </div>

      {errorMessage && <p className="form-error">{errorMessage}</p>}

      {isFormOpen ? (
        <PropertyForm
          initialValues={editingProperty}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
          isSubmitting={isSubmitting}
        />
      ) : (
        <button type="button" className="btn" onClick={handleAddClick}>
          ＋ 物件を登録
        </button>
      )}

      {isLoading ? (
        <p className="status-message-dark">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="empty-message">登録された物件はまだありません</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertiesPage;
