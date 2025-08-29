const Card = ({ title, children }) => {
  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default Card;
