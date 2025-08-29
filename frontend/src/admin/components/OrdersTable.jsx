import React, { memo } from "react";
import { FixedSizeList as List } from "react-window";

const Row = memo(({ index, style, data }) => {
  const order = data.orders[index];
  return (
    <div
      style={style}
      className="grid grid-cols-4 border-b p-2 hover:bg-gray-100 cursor-pointer text-center"
    >
      <div>{order.id}</div>
      <div>{order.userName}</div>
      <div>{order.total} تومان</div>
      <div className="capitalize">{order.status}</div>
    </div>
  );
});

const OrdersTable = ({ orders }) => {
  if (orders.length === 0) return <p>هیچ سفارشی وجود ندارد.</p>;

  return (
    <div className="overflow-x-auto border rounded">
      <div className="grid grid-cols-4 bg-gray-100 p-2 font-semibold text-center border-b">
        <div>آیدی</div>
        <div>نام مشتری</div>
        <div>مجموع سفارش</div>
        <div>وضعیت</div>
      </div>

      <List
        height={400}
        itemCount={orders.length}
        itemSize={50}
        width={"100%"}
        itemData={{ orders }}
      >
        {Row}
      </List>
    </div>
  );
};

export default OrdersTable;
