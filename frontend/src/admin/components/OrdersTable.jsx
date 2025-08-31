import React, { memo, useCallback } from "react";
import { FixedSizeList as List } from "react-window";

const Row = memo(({ index, style, data }) => {
  const order = data.orders[index];

  const handleClick = useCallback(() => {
    if (data.onRowClick) data.onRowClick(order);
  }, [data, order]);

  return (
    <div
      style={style}
      className="grid grid-cols-4 border-b p-2 hover:bg-gray-100 cursor-pointer text-center"
      role="row"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={`سفارش شماره ${order.id} توسط ${order.userName}, مجموع: ${order.total} تومان, وضعیت: ${order.status}`}
    >
      <div role="cell">{order.id}</div>
      <div role="cell">{order.userName}</div>
      <div role="cell">{order.total} تومان</div>
      <div role="cell" className="capitalize">{order.status}</div>
    </div>
  );
});

const OrdersTable = ({ orders, onRowClick }) => {
  if (!orders || orders.length === 0) return <p>هیچ سفارشی وجود ندارد.</p>;

  return (
    <div className="overflow-x-auto border rounded" role="table" aria-label="جدول سفارش‌ها">
      <div className="grid grid-cols-4 bg-gray-100 p-2 font-semibold text-center border-b" role="rowgroup">
        <div role="columnheader">آیدی</div>
        <div role="columnheader">نام مشتری</div>
        <div role="columnheader">مجموع سفارش</div>
        <div role="columnheader">وضعیت</div>
      </div>

      <List
        height={400}
        itemCount={orders.length}
        itemSize={50}
        width={"100%"}
        itemData={{ orders, onRowClick }}
      >
        {Row}
      </List>
    </div>
  );
};

export default React.memo(OrdersTable);
