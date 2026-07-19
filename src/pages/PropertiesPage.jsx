import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import { useAuth } from "../contexts/useAuth";
import { dummyProperties } from "../data/dummyProperties";

function PropertiesPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/login");
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

      <div className="property-grid">
        {dummyProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

export default PropertiesPage;
