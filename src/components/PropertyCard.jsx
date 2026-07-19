function PropertyCard({ property, onEdit, onDelete }) {
  return (
    <div className="property-card">
      <h3 className="property-name">{property.name}</h3>
      <p className="property-rent">¥{property.rent.toLocaleString()} / 月</p>
      <p className="property-area">
        {property.area} ・ {property.layout}
      </p>
      <div className="property-card-actions">
        <button type="button" className="link-btn" onClick={() => onEdit(property)}>
          編集
        </button>
        <button
          type="button"
          className="link-btn link-btn-danger"
          onClick={() => onDelete(property.id)}
        >
          削除
        </button>
      </div>
    </div>
  );
}

export default PropertyCard;
