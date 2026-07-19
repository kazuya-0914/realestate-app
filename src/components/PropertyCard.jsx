function PropertyCard({ property }) {
  return (
    <div className="property-card">
      <h3 className="property-name">{property.name}</h3>
      <p className="property-rent">¥{property.rent.toLocaleString()} / 月</p>
      <p className="property-area">{property.area}</p>
    </div>
  );
}

export default PropertyCard;
