import axiosInstance from "../api/axios";


export default function CartItem({ item, refreshCart }) {

  const increase = async () => {
    await update(item.quantity + 1);
  };

  const decrease = async () => {
    if (item.quantity <= 1) return;
    await update(item.quantity - 1);
  };

  const update = async (newQuantity) => {
    try {
      await axiosInstance.put(`/cart/${item.id}`, {
        quantity: newQuantity,
      });
      refreshCart();
    } catch (error) {
      alert(error.response?.data?.msg || "Update failed");
    }
  };

  const remove = async () => {
    try {
      await axiosInstance.delete(`/cart/${item.id}`);
      refreshCart();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">

      <div>
        <h4 className="font-semibold">{item.productName}</h4>
        <p className="text-sm text-gray-500">
          ₹ {item.priceAtAdd} × {item.quantity}
        </p>
      </div>

      <div className="flex items-center gap-3">

        <button
          onClick={decrease}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          -
        </button>

        <span>{item.quantity}</span>

        <button
          onClick={increase}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          +
        </button>

        <button
          onClick={remove}
          className="text-red-600 ml-4"
        >
          Remove
        </button>

      </div>

    </div>
  );
}
