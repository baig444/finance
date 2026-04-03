



const SummaryCard = ({ title, amount }) => (
  <div className="p-4 bg-[#6E62E6] rounded-md">
    <h3 className="text-white">{title}</h3>
    <p className="text-2xl text-white">₹{amount}</p>
  </div>
);

export default SummaryCard;